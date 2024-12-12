require("dotenv").config(); // .env 파일 로드

module.exports = {
  apps: [
    {
      name: "server1",
      script: "./src/index.js",
      watch: true,
      env: {
        ...process.env, // 공통 환경 변수
        PORT: 9001, // 고유한 포트
      },
    },
    {
      name: "server2",
      script: "./src/index.js",
      watch: true,
      env: {
        ...process.env, // 공통 환경 변수
        PORT: 9002, // 고유한 포트
      },
    },
    {
      name: "server3",
      script: "./src/index.js",
      watch: true,
      env: {
        ...process.env, // 공통 환경 변수
        PORT: 9003, // 고유한 포트
      },
    },
    {
      name: "server4",
      script: "./src/index.js",
      watch: true,
      env: {
        ...process.env, // 공통 환경 변수
        PORT: 9004, // 고유한 포트
      },
    },
  ],
};
