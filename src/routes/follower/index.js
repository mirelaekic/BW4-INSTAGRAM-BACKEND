const express = require("express");
const Follow = require("../../database").Follow;
const Follower = require("../../database").Follower;
const User = require("../../database").User;

const router = express.Router();

router.post("/:userId/", async (req, res) => {
  try {
    const follower = await Follower.findOne({
      where: {
        userId: req.user.dataValues.id,
        follower_id: req.params.userId,
      },
    });
    if (follower) {
      await Follower.destroy({
        where: {
          userId: req.user.dataValues.id,
          follower_id: req.params.userId,
        },
      });
      await Follow.destroy({
        where: {
          userId: req.params.userId,
          following_id: req.user.dataValues.id,
        },
      });
      res.status(201).send("Follower removed!");
    } else {
      await Follower.create({
        userId: req.user.dataValues.id,
        follower_id: req.params.userId,
      });
      await Follow.create({
        userId: req.params.userId,
        following_id: req.user.dataValues.id,
      });
      res.status(201).send("Follower created!");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Something went bad!");
  }
});

router.delete("/:id", async (req, res) => {
  try {
    res.send("follow removed");
  } catch (error) {
    console.log(error);
    res.status(500).send("Something went bad!");
  }
});

module.exports = router;
