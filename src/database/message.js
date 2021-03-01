/** @format */

module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define(
    "message",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      text: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      imgurl: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
    },
    { timestamps: true }
  );
  Message.associate = (models) => {
    Message.belongsTo(models.User);
  };
  return Message;
};
