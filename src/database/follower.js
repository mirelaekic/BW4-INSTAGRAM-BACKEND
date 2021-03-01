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
    Follower.belongsTo(models.User);
  };
  return Follower;
};
