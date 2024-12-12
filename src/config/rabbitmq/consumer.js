const { getRabbitMqChannel } = require("./rabbitMq");
const { messageHandlers } = require("./handler");
const constants = require("../constants");

const startConsumers = async () => {
  try {
    const channel = await getRabbitMqChannel();

    const queues = [
      {
        name: constants.QUEUE.TX_WORKER,
        handler: messageHandlers.txWorkerQueue,
      },
    ];

    for (const { name, handler } of queues) {
      await channel.assertQueue(name, { durable: false });
      channel.consume(
        name,
        async (msg) => {
          try {
            const content = msg.content.toString();
            await handler(content);
            channel.ack(msg);
          } catch (error) {
            console.error(`Error processing message in queue ${name}:`, error);
            channel.nack(msg);
          }
        },
        { noAck: false }
      );
      console.log(`Consumer set for queue: ${name}`);
    }
  } catch (error) {
    console.error("Error setting up consumers:", error);
  }
};

module.exports = {
  startConsumers,
};
