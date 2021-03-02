/** @format */

const { Sequelize, DataTypes } = require("sequelize");
const bcrypt = require("bcrypt");
const User = require("./users");
const Post = require("./posts");
const Room = require("./rooms");
const Follow = require("./follow");
const Comment = require("./comments");
const Like = require("./likes");
const CommentLike = require("./commentlikes");
const Follower = require("./follower");
const Story = require("./stories");
const SavedPost = require("./savedposts");
const StoryAlbum = require("./storyalbum");
const Reply = require("./reply");
const Tagged = require("./tagged");
const Message = require("./message");
const sequelize = new Sequelize(
  process.env.PGDATABASE,
  process.env.PGUSER,
  process.env.PGPASSWORD,
  {
    host: process.env.PGHOST,
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  }
);

const models = {
  Room: Room(sequelize, DataTypes),
  User: User(sequelize, DataTypes),
  Post: Post(sequelize, DataTypes),
  Follow: Follow(sequelize, DataTypes),
  Follower: Follower(sequelize, DataTypes),
  Comment: Comment(sequelize, DataTypes),
  Like: Like(sequelize, DataTypes),
  Story: Story(sequelize, DataTypes),
  Reply: Reply(sequelize, DataTypes),
  Tagged: Tagged(sequelize, DataTypes),
  Message: Message(sequelize, DataTypes),
  SavedPost: SavedPost(sequelize, DataTypes),
  StoryAlbum: StoryAlbum(sequelize, DataTypes),
  CommentLike: CommentLike(sequelize, DataTypes),
};
Object.keys(models).forEach((modelName) => {
  if ("associate" in models[modelName]) {
    models[modelName].associate(models);
  }
});

models.User.prototype.validPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};
models.sequelize = sequelize;

module.exports = models;
