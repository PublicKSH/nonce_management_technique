const amqp = require("amqplib");
const logger = require("../logger");

let connection;
let channel;

const connectRabbitMq = async () => {
  try {
    connection = await amqp.connect("amqp://guest:guest@localhost:5672");
    channel = await connection.createChannel();
    logger.info("RabbitMQ connected successfully");
    return channel;
  } catch (error) {
    logger.error("Failed to connect to RabbitMQ:", error);
    setTimeout(connectRabbitMq, 5000); // Retry after 5 seconds
  }
};

const getRabbitMqChannel = async () => {
  if (!channel) {
    await connectRabbitMq();
  }
  return channel;
};

const closeRabbitMq = async () => {
  if (connection) {
    await connection.close();
    logger.info("RabbitMQ connection closed");
  }
};

module.exports = {
  connectRabbitMq,
  getRabbitMqChannel,
  closeRabbitMq,
};
