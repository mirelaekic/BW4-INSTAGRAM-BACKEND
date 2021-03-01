/** @format */

module.exports = (sequelize, DataTypes) => {
  const Tagged = sequelize.define(
    "tagged",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
    },
    { timestamps: true }
  );
  Tagged.associate = (models) => {
    Tagged.belongsTo(models.Post);
    Tagged.belongsTo(models.User);
  };
  return Tagged;
};
