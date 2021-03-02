/** @format */

module.exports = (sequelize, DataTypes) => {
  const Story = sequelize.define(
    "story",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
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
  Story.associate = (models) => {
    Story.belongsTo(models.User);
    Story.belongsTo(models.StoryAlbum);
  };
  return Story;
};
