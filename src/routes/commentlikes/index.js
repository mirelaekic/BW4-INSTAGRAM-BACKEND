const express = require("express");
const CommentLike = require("../../database").CommentLike;
const router = express.Router();

router.post("/:userId/:commentId", async (req, res) => {
  try {
    const like = await CommentLike.findOne({
      where: { userId: req.params.userId, commentId: req.params.commentId },
    });
    if (like) {
      await CommentLike.destroy({
        where: { userId: req.params.userId, commentId: req.params.commentId },
      });
    } else {
      const newLike = await CommentLike.create({
        userId: req.params.userId,
        commentId: req.params.commentId,
      });
    }
    console.log(like);
    res.status(201).send("ok");
  } catch (error) {
    console.log(error);
    res.status(500).send("Something went bad!");
  }
});

router.get("/:userId/:commentId/commentlikes", async (req, res) => {
  try {
    const likes = await CommentLike.count({
      where: { commentId: req.params.commentId },
    });
    const like = await CommentLike.findOne({
      where: { userId: req.params.userId, commentId: req.params.commentId },
    });
    const data = {
      total: likes,
    };
    if (like) {
      data.isLiked = true;
    } else {
      data.isLiked = false;
    }

    res.send(data);
  } catch (error) {
    console.log(error);
    res.status(500).send("Something went bad!");
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await CommentLike.destroy({ where: { id: req.params.id } });
    res.send("like removed");
  } catch (error) {
    console.log(error);
    res.status(500).send("Something went bad!");
  }
});

module.exports = router;
