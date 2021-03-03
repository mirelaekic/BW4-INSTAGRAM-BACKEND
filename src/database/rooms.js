/** @format */

module.exports = (sequelize, DataTypes) => {
  const Rooms = sequelize.define(
    "room",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      roomName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    { timestamps: true }
  );
  Rooms.associate = (models) => {
    Rooms.belongsToMany(models.User, { through: "User_Room_Relations" });
  };
  return Rooms;
};
