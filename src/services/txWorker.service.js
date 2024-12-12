const Caver = require("caver-js");
const config = require("../config/config");
const { transactionRepository } = require("../repositories");
const { cache } = require("../utils/caches/txCaching");
const constants = require("../config/constants");

class TxWorkerService {
  constructor(config) {
    this.config = config;
    this.caver = new Caver(config.klaytn.klaytnNetworkUrl);
  }

  // 키링 등록 함수
  async addAdminKeyringAtCaverJs() {
    const adminKeyring = this.caver.wallet.keyring.createFromPrivateKey(
      this.config.klaytn.adminPrivateKey
    );
    this.caver.wallet.add(adminKeyring);
    if (!this.caver.utils.isAddress(this.config.klaytn.adminAddress)) {
      throw new Error("Invalid admin address.");
    }
    return adminKeyring;
  }

  async initialize() {
    await this.addAdminKeyringAtCaverJs(); // 키링 등록
  }

  // txData = { mintData, nonce }
  async signAndSubmitTransaction(txData) {
    try {
      const transaction = await transactionRepository.getTransactionByNonce(
        txData.nonce
      );

      if (!cache.gasPrice) {
        const gasPrice = await this.caver.rpc.klay.getGasPrice();
        cache.setGasPrice(gasPrice);
      }

      if (!cache.gas) {
        const mintTxForEstimate = {
          from: this.config.klaytn.adminAddress,
          to: this.config.klaytn.smartContractAddress,
          input: txData.mintData,
          gasPrice: cache.gasPrice,
          nonce: txData.nonce,
        };

        const estimatedGas = await this.caver.rpc.klay.estimateGas(
          mintTxForEstimate
        );
        cache.setGas(estimatedGas);
      }

      const mintTx = await this.caver.transaction.smartContractExecution.create(
        {
          from: this.config.klaytn.adminAddress,
          to: this.config.klaytn.smartContractAddress,
          input: txData.mintData,
          gas: cache.gas,
          gasPrice: cache.gasPrice,
          nonce: txData.nonce,
        }
      );

      const signedTx = await this.caver.wallet.sign(
        this.config.klaytn.adminAddress,
        mintTx
      );
      const rawTransaction = signedTx.getRLPEncoding();

      const sendDate = Date.now();

      // 트랜잭션 전송
      const sendResult = await this.caver.rpc.klay.sendRawTransaction(
        rawTransaction
      );

      await transactionRepository.updateTransaction({
        transactionId: transaction.transaction_id,
        txHash: sendResult.transactionHash,
        sendDate: sendDate,
        status: constants.TX_STATUS.SEND,
      });

      // 트랜잭션 상태 확인 로직
      const checkTransaction = async () => {
        const elapsedTime = Date.now() - sendDate;

        // n초 이상 경과 시 재전송
        if (elapsedTime >= constants.RECOVER_TIME) {
          console.log(
            `Transaction taking too long (${elapsedTime}ms), resending...`
          );
          const updatedGasPrice = this.caver.utils.toHex(
            Math.floor(parseInt(cache.gasPrice, 16) * 1.2) // Gas Price 20% 증가
          );

          const newMintTx =
            await this.caver.transaction.smartContractExecution.create({
              from: this.config.klaytn.adminAddress,
              to: this.config.klaytn.smartContractAddress,
              input: txData.mintData,
              gas: cache.gas,
              gasPrice: updatedGasPrice,
              nonce: txData.nonce,
            });

          const newSignedTx = await this.caver.wallet.sign(
            this.config.klaytn.adminAddress,
            newMintTx
          );
          const newRawTransaction = newSignedTx.getRLPEncoding();

          const newSendResult = await this.caver.rpc.klay.sendRawTransaction(
            newRawTransaction
          );
          console.log("Resent transaction:", newSendResult);

          await transactionRepository.updateTransaction({
            transactionId: transaction.transaction_id,
            txHash: newSendResult.transactionHash,
            sendDate: Date.now(),
            status: constants.TX_STATUS.SEND,
          });

          return;
        }

        try {
          const receipt = await this.caver.rpc.klay.getTransactionReceipt(
            sendResult.transactionHash
          );

          if (receipt) {
            if (receipt.status) {
              console.log(
                `Transaction confirmed in block ${receipt.blockNumber}`
              );
              await transactionRepository.updateTransaction({
                transactionId: transaction.transaction_id,
                status: constants.TX_STATUS.SUCCESS,
                successDate: Date.now(),
              });
              return receipt;
            } else {
              console.error("Transaction failed.");
              await transactionRepository.updateTransaction({
                transactionId: transaction.transaction_id,
                status: constants.TX_STATUS.FAILED,
              });
            }
          } else {
            setTimeout(checkTransaction, 1); // 1초 후 다시 확인
          }
        } catch (error) {
          console.log("Error while checking transaction receipt:", error);
        }
      };

      // 상태 확인 시작
      checkTransaction();
    } catch (error) {
      console.error("Error submitting transaction:", error?.message);

      if (
        error?.message.includes("nonce too low") ||
        error?.message.includes("known transaction")
      ) {
        return;
      }

      console.error("Unexpected error, resending transaction:", txData);
    }
  }
}

const txWorkerService = new TxWorkerService(config);
txWorkerService.initialize(); // 키링 등록

module.exports = txWorkerService;
