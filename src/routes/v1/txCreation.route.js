const express = require("express");
const validate = require("../../middlewares/validate");
const { txCreationValidation } = require("../../validations");
const { txCreationController } = require("../../controllers");

const router = express.Router();

router.route("/sync-nonce").get(txCreationController.synchronizeNonce);
router
  .route("/sync-nonce")
  .post(txCreationController.synchronizeNonceAndSubmitTransaction);

router
  .route("/account")
  .post(txCreationController.setAccount)
  .get(txCreationController.getAccount);
router
  .route("/contract")
  .post(txCreationController.setContract)
  .get(txCreationController.getContract);
router
  .route("/start-tx-creation")
  .post(txCreationController.startTransactionCreation);
router
  .route("/stop-tx-creation")
  .post(txCreationController.stopTransactionCreation);
router
  .route("/receipts")
  .get(txCreationController.getReceipts)
  .delete(txCreationController.deleteReceipts);

module.exports = router;
