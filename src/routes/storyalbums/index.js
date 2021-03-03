const express = require("express");
const Post = require("../../database").Post;
const Comment = require("../../database").Comment;
const SavedPost = require("../../database").SavedPost;
const User = require("../../database").User;

const router = express.Router();

router.post("/:postId", async (req, res) => {
  try {
    const savedpost = await SavedPost.findOne({
      where: { userId: req.user.dataValues.id, postId: req.params.postId },
    });
    if (savedpost) {
      await SavedPost.destroy({
        where: { userId: req.user.dataValues.id, postId: req.params.postId },
      });
      res.status(201).send("Post Removed from Saved Posts!");
    } else {
      await SavedPost.create({
        userId: req.user.dataValues.id,
        postId: req.params.postId,
      });
      res.status(201).send("Post Saved!");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Something went bad!");
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await SavedPost.destroy({
      where: { userId: req.user.dataValues.id, postId: req.params.postId },
    });
    res.send("savedpost removed");
  } catch (error) {
    console.log(error);
    res.status(500).send("Something went bad!");
  }
});

module.exports = router;
