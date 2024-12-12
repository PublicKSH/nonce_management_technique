const Caver = require("caver-js");
const config = require("../config/config");
const { sendMessageToQueue } = require("../config/rabbitmq/publisher");
const constants = require("../config/constants");
const { Transaction, sequelize } = require("../models/index");
const { redisRepository, transactionRepository } = require("../repositories");
const { cache } = require("../utils/caches/txCaching");

class TxCreationService {
  constructor(config) {
    this.config = config;
    this.caver = new Caver(config.klaytn.klaytnNetworkUrl);
    this.txCreationThread = null;
  }

  // add caver keying
  async addAdminKeyringAtCaverJs() {
    const adminKeyring = this.caver.wallet.keyring.createFromPrivateKey(
      this.config.klaytn.adminPrivateKey
    );
    this.caver.wallet.add(adminKeyring);
    return adminKeyring;
  }

  // add caver keyring
  async initialize() {
    await this.addAdminKeyringAtCaverJs();
  }

  async synchronizeNonce() {
    const address = this.config.klaytn.adminAddress;
    const nonceBigInt = await this.caver.rpc.klay.getTransactionCount(
      address,
      "pending"
    );
    const nonce = Number(nonceBigInt) - 1;

    await redisRepository.redisSet("nonce", nonce);
    return nonce;
  }

  async synchronizeNonceAndSubmitTransaction() {
    const address = this.config.klaytn.adminAddress;
    const nonceBigInt = await this.caver.rpc.klay.getTransactionCount(
      address,
      "pending"
    );
    const nonce = Number(nonceBigInt);

    await redisRepository.redisSet("nonce", nonce);
    this.submitTransaction(nonce);
    return nonce;
  }

  startTransactionCreation() {
    if (this.txCreationThread) {
      throw new Error("Transaction creation already running");
    }

    this.txCreationThread = setInterval(() => {
      this.submitTransaction();
    }, 1);

    setTimeout(() => {
      this.stopTransactionCreation();
    }, 1000);
  }

  stopTransactionCreation() {
    if (this.txCreationThread) {
      clearInterval(this.txCreationThread);
      this.txCreationThread = null;
    }
  }

  async submitTransaction(nonce = null) {
    try {
      if (!cache.mintData) {
        const kip7 = await this.caver.kct.kip7.create(
          this.config.klaytn.smartContractAddress
        );

        const mintData = kip7.methods
          .mint(
            this.config.klaytn.adminAddress,
            this.caver.utils.toPeb("100", "KLAY")
          )
          .encodeABI();
        cache.setMintData(mintData);
      }
      const mintData = cache.mintData;
      if (!nonce) {
        nonce = await redisRepository.redisIncr("nonce");
      }

      const txData = {
        mintData,
        nonce,
      };

      // 객체를 JSON 문자열로 변환
      const jsonString = JSON.stringify(txData);

      // create transaction at db
      await transactionRepository.createTransaction({
        nonce: nonce,
        txData: mintData,
      });

      sendMessageToQueue(constants.QUEUE.TX_WORKER, jsonString);
    } catch (error) {
      console.error("Error submitting transaction:", error);
      this.stopTransactionCreation();
    }
  }

  async getReceipts() {
    return await transactionRepository.getTransactions();
  }

  deleteReceipts() {
    if (this.txCreationThread) {
      throw new Error("Can't delete receipts while TX creation is running");
    }

    // todo: delete transactions
    return receipts;
  }
}

const txCreationService = new TxCreationService(config);
txCreationService.initialize(); // 키링 등록

module.exports = txCreationService;
