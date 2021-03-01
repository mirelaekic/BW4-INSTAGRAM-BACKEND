/** @format */

module.exports = (sequelize, DataTypes) => {
  const SavedPost = sequelize.define(
    "savedpost",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
    },
    { timestamps: true }
  );
  SavedPost.associate = (models) => {
    SavedPost.belongsTo(models.Post);
    SavedPost.belongsTo(models.User);
  };
  return SavedPost;
};
