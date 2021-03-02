/** @format */

module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define(
    "post",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      imgurl: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
    },
    { timestamps: true }
  );
  Post.associate = (models) => {
    Post.belongsTo(models.User);
    Post.hasMany(models.Comment);
    Post.hasMany(models.Like);
    Post.hasMany(models.Tagged);
    Post.hasMany(models.SavedPost);
  };
  return Post;
};
