const { getRabbitMqChannel } = require("./rabbitMq");

const sendMessageToQueue = async (queueName, message) => {
  try {
    const channel = await getRabbitMqChannel();
    await channel.assertQueue(queueName, { durable: false });
    channel.sendToQueue(queueName, Buffer.from(message));
    // console.log(`Message sent to ${queueName}:`, message);
  } catch (error) {
    console.error(`Failed to send message to ${queueName}:`, error);
  }
};

module.exports = {
  sendMessageToQueue,
};
