const txCreationService = require("../services/txCreation.service");
const catchAsync = require("../utils/catchAsync");

const synchronizeNonce = catchAsync(async (req, res) => {
  const nonce = await txCreationService.synchronizeNonce();
  res.status(200).send({ nonce });
});

const synchronizeNonceAndSubmitTransaction = catchAsync(async (req, res) => {
  const nonce = await txCreationService.synchronizeNonceAndSubmitTransaction();
  res.status(200).send({ nonce });
});

const setAccount = catchAsync(async (req, res) => {
  res.status(200).send();
});

const getAccount = catchAsync(async (req, res) => {
  res.status(200).send(txCreationService.config.ether.address);
});

const setContract = catchAsync(async (req, res) => {
  txCreationService.config.smartContractAddress = req.body.contractAddress;
  res.status(200).send(txCreationService.config.smartContractAddress);
});

const getContract = catchAsync(async (req, res) => {
  res.status(200).send(txCreationService.config.smartContractAddress);
});

const startTransactionCreation = catchAsync(async (req, res) => {
  txCreationService.startTransactionCreation();
  res.status(204).send();
});

const stopTransactionCreation = catchAsync(async (req, res) => {
  txCreationService.stopTransactionCreation();
  res.status(204).send();
});

const getReceipts = catchAsync(async (req, res) => {
  res.status(200).send(txCreationService.getReceipts());
});

const deleteReceipts = catchAsync(async (req, res) => {
  const receipts = txCreationService.deleteReceipts();
  res.status(200).send(receipts);
});

module.exports = {
  synchronizeNonce,
  setAccount,
  getAccount,
  setContract,
  getContract,
  startTransactionCreation,
  stopTransactionCreation,
  getReceipts,
  synchronizeNonceAndSubmitTransaction,
  deleteReceipts,
};
