const { txWorkerService } = require("../../services");

const handleTxWorker = async (content) => {
  // await createMatches(content);
  // JSON 문자열을 다시 객체로 변환
  const parsedJson = JSON.parse(content);
  // console.log(parsedJson);

  txWorkerService.signAndSubmitTransaction(parsedJson);
};

const messageHandlers = {
  txWorkerQueue: handleTxWorker,
};

module.exports = {
  messageHandlers,
};
