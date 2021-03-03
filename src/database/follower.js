module.exports = (sequelize, DataTypes) => {
  const Follower = sequelize.define(
    "follower",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
    },
    { timestamps: true }
  );
  Follower.associate = (models) => {
    Follower.belongsTo(models.User, {
      as: "follower",
      foreignKey: "follower_id",
    });
  };
  return Follower;
};
