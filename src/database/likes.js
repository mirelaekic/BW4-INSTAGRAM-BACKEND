/** @format */

module.exports = (sequelize, DataTypes) => {
  const Like = sequelize.define(
    "like",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
    },
    { timestamps: true }
  );
  Like.associate = (models) => {
    Like.belongsTo(models.Post);
    Like.belongsTo(models.User);
  };
  return Like;
};
