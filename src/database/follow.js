module.exports = (sequelize, DataTypes) => {
  const Follow = sequelize.define(
    "follow",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
    },
    { timestamps: true }
  );
  Follow.associate = (models) => {
    Follow.belongsTo(models.User, {
      as: "following",
      foreignKey: "following_id",
    });
  };
  return Follow;
};
