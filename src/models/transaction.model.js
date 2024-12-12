module.exports = (sequelize, DataTypes) => {
  const schema = {
    transaction_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    status: {
      type: DataTypes.TINYINT(1),
    },
    nonce: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    tx_data: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    tx_hash: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    send_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    success_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  };

  const modelOptions = {
    // hard delete mode
    // timestamps: false,
    // createdAt: false,
    // updatedAt: false,
    // paranoid : true,

    tableName: "transaction",
    indexes: [],
  };
  return sequelize.define("Transaction", schema, modelOptions);
};
