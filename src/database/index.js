/** @format */

const { Sequelize, DataTypes } = require("sequelize");
const bcrypt = require("bcrypt");
const User = require("./users");
const Post = require("./posts");
const Follow = require("./follow");
const Comment = require("./comments");
const Like = require("./likes");
const CommentLike = require("./commentlikes");
const sequelize = new Sequelize(
    process.env.PGDATABASE,
    process.env.PGUSER,
    process.env.PGPASSWORD,
    {
        host: process.env.PGHOST,
        dialect: "postgres",
        // dialectOptions: {
        //     ssl: {
        //         require: true,
        //         rejectUnauthorized: false,
        //     },
        // },
    }
);

const models = {
    User: User(sequelize, DataTypes),
    Post: Post(sequelize, DataTypes),
    Follow: Follow(sequelize, DataTypes),
    Comment: Comment(sequelize, DataTypes),
    Like: Like(sequelize, DataTypes),
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
