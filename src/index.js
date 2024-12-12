const app = require("./app");
const config = require("./config/config");
const logger = require("./config/logger");
const { sequelize } = require("./models");
const redisClient = require("./config/database/redis");
const { createSchema } = require("./config/database/mysql");
const amqp = require("amqplib");
const { caverService } = require("./services");
const { startConsumers } = require("./config/rabbitmq/consumer");
const { sendMessageToQueue } = require("./config/rabbitmq/publisher");
const {
  connectRabbitMq,
  closeRabbitMq,
} = require("./config/rabbitmq/rabbitMq");
let server;
let rabbitMqConnection;
let rabbitMqChannel;

// RabbitMQ 초기화
// const initializeRabbitMq = async () => {
//   try {
//     // rabbitMqConnection = await amqp.connect({
//     //   hostname: config.rabbitMq.host,
//     //   username: config.rabbitMq.username,
//     //   password: config.rabbitMq.password,
//     //   port: config.rabbitMq.port,
//     // });

//     rabbitMqConnection = await amqp.connect(
//       "amqp://guest:guest@localhost:5672"
//     );
//     rabbitMqChannel = await rabbitMqConnection.createChannel();
//     logger.info("RabbitMQ connected successfully");

//     // 큐 선언
//     const queue = "testQueue";
//     await rabbitMqChannel.assertQueue(queue, { durable: false });

//     // Consumer 설정
//     rabbitMqChannel.consume(
//       queue,
//       (msg) => {
//         console.log("Received message:", msg.content.toString());
//       },
//       { noAck: true }
//     );
//   } catch (error) {
//     console.error("Failed to connect to RabbitMQ:", error);
//     setTimeout(initializeRabbitMq, 5000); // 5초 후 다시 연결 시도
//   }
// };

// // 메시지 전송 함수 (Producer)
// const sendMessageToQueue = async (message) => {
//   try {
//     const queue = "testQueue";
//     await rabbitMqChannel.assertQueue(queue, { durable: false });
//     rabbitMqChannel.sendToQueue(queue, Buffer.from(message));
//     console.log("Sent message:", message);
//   } catch (error) {
//     console.error("Failed to send message:", error);
//   }
// };

// Redis 테스트 함수
const testRedisConnection = async () => {
  try {
    await redisClient.set("testKey", "Hello, Redis!");
    const value = await redisClient.get("testKey");
    console.log("Redis testKey value:", value);
  } catch (error) {
    console.error("Redis error:", error);
  }
};

(async () => {
  try {
    await redisClient.connect();
    redisClient.on("error", (err) => console.error("Redis Error:", err));

    if (process.env.NODE_ENV == "production" && !(await redisClient.isOpen())) {
      console.log("Redis connection error");
      exitHandler();
    }

    // Redis 연결 후 테스트 값 설정 및 로그 출력
    await testRedisConnection();

    // Initialize RabbitMQ
    await connectRabbitMq();
    await startConsumers();

    await createSchema();
    sequelize
      .sync({ alter: true })
      .then(async () => {
        server = app.listen(config.port, () => {
          logger.info("Listening to port %d", config.port);
        });

        server.keepAliveTimeout = 61 * 1000;
        server.headersTimeout = 65 * 1000;
      })
      .catch((err) => {
        console.error(err);
      });
  } catch (e) {
    console.error(e);
    exitHandler();
  }
})();

// 서버 종료 핸들러
const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info("Server closed");
      if (rabbitMqConnection) {
        rabbitMqConnection.close();
      }
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);
process.on("SIGINT", exitHandler);
