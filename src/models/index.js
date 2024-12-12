const Sequelize = require("sequelize");
const config = require("../config/config");

let sequelize;

sequelize = new Sequelize(
  config.sequelize.database,
  config.sequelize.username,
  config.sequelize.password,
  {
    host: config.sequelize.host,
    port: config.sequelize.port,
    dialect: config.sequelize.dialect,
    timezone: "+09:00",
    pool: {
      max: 20,
      min: 0,
    },
    logging: false,
    define: {
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
    },
  }
);

const Transaction = require("./transaction.model")(sequelize, Sequelize);

module.exports = {
  sequelize,
  Transaction,
};
