const express = require("express");
const Post = require("../../database").Post;
const User = require("../../database").User;
const Reply = require("../../database").Reply;
const Comment = require("../../database").Comment;
const CommentLike = require("../../database").CommentLike;

const router = express.Router();

router.post("/:postID", async (req, res) => {
  try {
    const newComment = await Comment.create({
      ...req.body,
      userId: req.user.dataValues.id,
      postId: req.params.postID,
    }); //.create IS A SEQUELIZE METHOD DOR MODELS, IT CREATES A NEW ROW IN THE TABLE
    res.status(201).send(newComment);
  } catch (error) {
    console.log(error);
    res.status(500).send("Something went bad!");
  }
});

router.get("/", async (req, res) => {
  try {
    const allUserComments = await Comment.findAll({
      include: [Post, User, CommentLike, Reply],
      where: { userId: req.user.dataValues.id },
    });
    if (allUserComments) {
      res.send(allUserComments);
    } else {
      res.status(404).send("You have no comments! Get chatting!");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Something went bad!");
  }
});

router.get("/:id", async (req, res) => {
  try {
    const singleComment = await Comment.findByPk(req.params.id, {
      include: [Post, User, Reply],
    });
    res.send(singleComment);
  } catch (error) {
    console.log(error);
    res.status(500).send("Something went bad!");
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const commentToDelete = await Comment.findByPk(req.params.id);
    if (commentToDelete.dataValues.userId === req.user.dataValues.id) {
      await Comment.destroy({ where: { id: req.params.id } });
      res.send("comment destroyed");
    } else {
      res
        .status(401)
        .send("Unauthorized: Don't try to delete other peoples comments!");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Something went bad!");
  }
});

router.put("/:id", async (req, res) => {
  try {
    const commentToUpdate = await Comment.findByPk(req.params.id);
    if (commentToUpdate.dataValues.userId === req.user.dataValues.id) {
      const alteredComment = await Comment.update(req.body, {
        where: { id: req.params.id },
        returning: true,
      });
      res.send(alteredComment);
    } else {
      res.status(401).send("Unauthorized: This is not your comment!");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Something went bad!");
  }
});

module.exports = router;
