const express = require("express");
const Follow = require("../../database").Follow;
const User = require("../../database").User;


const router = express.Router();

router.post("/:userId/", async (req, res) => {
    try {
        const follow = await Follow.findOne({ where: { userId: req.params.userId } })
        if (follow) {
            await Follow.destroy({ where: { userId: req.params.userId } })
        } else {
            const newFollow = await Follow.create({ userId: req.params.userId });
        }

        res.status(201).send('ok');
    } catch (error) {
        console.log(error);
        res.status(500).send("Something went bad!");
    }
});



router.get("/:userId/:followId", async (req, res) => {
    try {

        const follows = await Follow.count({ where: { followId: req.params.followId } })
        const follow = await Follow.findOne({ where: { userId: req.params.userId, followId: req.params.followId } })
        const data = {
            total: follows
        }
        if (follow) {
            data.isFollowed = true

        } else {
            data.isFollowed = false
        }

        res.send(data);
    } catch (error) {
        console.log(error);
        res.status(500).send("Something went bad!");
    }
});

router.delete("/:id", async (req, res) => {
    try {
        await Follow.destroy({ where: { id: req.params.id } });
        res.send("follow removed");
    } catch (error) {
        console.log(error);
        res.status(500).send("Something went bad!");
    }
});




module.exports = router;