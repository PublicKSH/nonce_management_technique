const { when } = require("joi");
const { Transaction, sequelize } = require("../models/index");
const { filterUndefinedOrNull } = require("../utils/objectFilter");
const getTransactions = async (transaction) => {
  return await Transaction.findAll({
    attributes: { exclude: ["updated_at"] },
    where: {},
    transaction,
  });
};

const getTransactionById = async (transactionId) => {
  return await Transaction.findByPk(transactionId, {
    attributes: { exclude: ["updated_at"] },
  });
};

const getTransactionByNonce = async (nonce) => {
  return await Transaction.findOne({
    where: { nonce: nonce },
    attributes: { exclude: ["updated_at"] },
  });
};

const createTransaction = async ({ nonce, txData, transaction = null }) => {
  return await Transaction.create(
    {
      nonce,
      status: 0,
      tx_data: txData,
      // tx_hash: txHash,
      // raw_transaction: rawTransaction,
    },
    { transaction }
  );
};

const getLastTransaction = async (serverKeyId, transaction) => {
  return await Transaction.findOne({
    attributes: { exclude: ["updated_at"] },
    where: { server_key_id: serverKeyId },
    order: [["nonce", "DESC"]],
    transaction,
  });
};

const getTransaction = async (transactionId, transaction) => {
  return await Transaction.findOne({
    where: { transaction_id: transactionId },
    transaction,
  });
};

const updateTransaction = async ({
  transactionId,
  status,
  txHash,
  sendDate,
  successDate,
  transaction,
  lock = false,
}) => {
  if (!transactionId) {
    throw new Error("transactionId is required");
  }

  const updateFields = filterUndefinedOrNull({
    status: status,
    tx_hash: txHash,
    send_date: sendDate,
    success_date: successDate,
  });

  await Transaction.update(updateFields, {
    where: { transaction_id: transactionId },
    transaction,
    lock,
  });
};

const deleteTransaction = async (transactionId, transaction) => {
  await Transaction.destroy({
    where: { transaction_id: transactionId },
    transaction,
  });
};

module.exports = {
  getTransactions,
  getTransactionById,
  getTransactionByNonce,
  createTransaction,
  getLastTransaction,
  getTransaction,
  updateTransaction,
  deleteTransaction,
};
