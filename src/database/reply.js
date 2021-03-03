/** @format */

module.exports = (sequelize, DataTypes) => {
  const Reply = sequelize.define(
    "reply",
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
    },
    { timestamps: true }
  );
  Reply.associate = (models) => {
    Reply.belongsTo(models.Comment);
    Reply.belongsTo(models.User);
    Reply.hasMany(models.CommentLike);
  };
  return Reply;
};
