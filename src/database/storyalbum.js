/** @format */

module.exports = (sequelize, DataTypes) => {
  const StoryAlbum = sequelize.define(
    "storyalbum",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
    },
    { timestamps: true }
  );
  StoryAlbum.associate = (models) => {
    StoryAlbum.hasMany(models.Story);
    StoryAlbum.belongsTo(models.User);
  };
  return StoryAlbum;
};
