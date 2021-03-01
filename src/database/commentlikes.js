/** @format */

module.exports = (sequelize, DataTypes) => {
  const CommentLike = sequelize.define(
    "commentlike",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
    },
    { timestamps: true }
  );
  CommentLike.associate = (models) => {
    CommentLike.belongsTo(models.Comment);
    CommentLike.belongsTo(models.Reply);
    CommentLike.belongsTo(models.User);
  };
  return CommentLike;
};
