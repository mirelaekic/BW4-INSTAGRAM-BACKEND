/** @format */

const bcrypt = require("bcrypt");

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "user",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phonenumber: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      imgurl: {
        type: DataTypes.STRING(500),
        allowNull: false,
      },
      gender: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      hooks: {
        // triggered before you creating new row in db (User.create())
        beforeCreate: async function (user) {
          const salt = await bcrypt.genSalt(12);
          user.password = await bcrypt.hash(user.password, salt);
        },
        beforeBulkUpdate: async function (user) {
          console.log(user);
          if (user.attributes.password) {
            const salt = await bcrypt.genSalt(12);
            user.attributes.password = await bcrypt.hash(
              user.attributes.password,
              salt
            );
          }
        },
      },
    }
  );

  User.associate = (models) => {
    User.hasMany(models.Post);
    User.hasMany(models.Comment);
    User.hasMany(models.Reply);
    User.hasMany(models.Like);
    User.hasMany(models.Follow);
    User.hasMany(models.Follower);
    User.hasMany(models.Story);
    User.hasMany(models.StoryAlbum);
    User.hasMany(models.Tagged);
    User.hasMany(models.SavedPost);
    User.hasMany(models.Message);
  };
  return User;
};
