const dotenv = require("dotenv");
const path = require("path");
const joi = require("joi");

dotenv.config({ path: path.join(__dirname, "../../.env") });

const envVarSchema = joi
  .object()
  .keys({
    NODE_ENV: joi
      .string()
      .valid("production", "development", "test")
      .required(),
    PORT: joi.number().default(1000),

    // serverIp 관련
    EXAMPLE_APP_SERVER_URL: joi.string().required(),

    // redis 관련
    REDIS_HOST: joi.string().required(),
    REDIS_PORT: joi.number().required(),

    // sql 관련
    SQL_HOST: joi.string().required(),
    SQL_PORT: joi.number().required(),
    SQL_DATABASE: joi.string().required(),
    SQL_USERNAME: joi.string().required(),
    SQL_PASSWORD: joi.string().required(),
    SQL_DIALECT: joi.string().required().valid("mysql", "postgres", "mssql"),

    // klaytn api service
    KLAYTN_CHIAN_ID: joi.number().required(),
    ADMIN_PRIVATE_KEY: joi.string().required(),
    ADMIN_ADDRESS: joi.string().required(),
    KLAYTN_NETWORK_URL: joi.string().required(),
  })
  .unknown();

const { value: envVars, error } = envVarSchema
  .prefs({ errors: { label: "key" } })
  .validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,

  // serverIp 관련
  exampleAppServerAddr: envVars.EXAMPLE_APP_SERVER_URL,

  // redis 관련
  redis: {
    url: "redis://" + envVars.REDIS_HOST + ":" + envVars.REDIS_PORT,
  },

  // sql 관련
  sequelize: {
    database: envVars.SQL_DATABASE,
    // +
    // (envVars.NODE_ENV === "development" || envVars.NODE_ENV === "test"
    //   ? "_dev"
    //   : ""),
    username: envVars.SQL_USERNAME,
    password: envVars.SQL_PASSWORD,
    host: envVars.SQL_HOST,
    port: envVars.SQL_PORT,
    dialect: envVars.SQL_DIALECT,
  },

  // jwt
  jwt: {
    publicKey: envVars.JWT_PUBLIC_KEY,
    privateKey: envVars.JWT_PRIVATE_KEY,
    accessTokenExpirationMinutes: envVars.ACCESS_TOKEN_EXPIRATION_MINUTES,
    refreshTokenExpirationHours: envVars.REFRESH_TOKEN_EXPIRATION_HOURS,
  },

  // rabbitmq
  rabbitMq: {
    host: envVars.RABBITMQ_HOST,
    port: envVars.RABBITMQ_PORT,
    username: envVars.RABBITMQ_USERNAME,
    password: envVars.RABBITMQ_PASSWORD,
  },

  // klaytn
  klaytn: {
    kasAccessKeyId: envVars.KAS_ACCESS_KEY_ID,
    kasSecretAccessKey: envVars.KAS_SECRET_ACCESS_KEY,
    klaytnChainId: envVars.KLAYTN_CHIAN_ID,
    adminPrivateKey: envVars.ADMIN_PRIVATE_KEY,
    adminWalletKey: envVars.ADMIN_PRIVATE_KEY + "0x00" + envVars.ADMIN_ADDRESS,
    adminAddress: envVars.ADMIN_ADDRESS,
    klaytnNetworkUrl: envVars.KLAYTN_NETWORK_URL,
    smartContractAddress: envVars.ERC20_SMART_CONTRACT_ADDRESS,
  },

  ether: {
    address: envVars.ADDRESS,
    privateKey: envVars.PRIVATE_KEY,
    smartContractAddress: envVars.SMART_CONTRACT_ADDRESS,
  },
};
