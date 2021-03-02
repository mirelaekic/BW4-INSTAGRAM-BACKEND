/** @format */

module.exports = (sequelize, DataTypes) => {
  const Rooms = sequelize.define(
    "post",
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
    Rooms.hasMany(models.User);
  };
  return Rooms;
};
