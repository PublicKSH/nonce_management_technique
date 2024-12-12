module.exports = {
  LOGIN_TYPE: {
    EXAMPLE: "EXAMPLE",
    ADMIN: "ADMIN",
  },
  REDIS: {
    NONCE_KEY: "nonce_key",
  },
  QUEUE: {
    TEST: "testQueue",
    TX_WORKER: "txWorkerQueue",
  },
  TX_STATUS: {
    CREATED: 1,
    SEND: 2,
    SUCCESS: 3,
    FAILED: 3,
  },
  RECOVER_TIME: 5000,
};
