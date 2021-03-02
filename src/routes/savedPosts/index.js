const express = require("express");
const Post = require("../../database").Post;
const Comment = require("../../database").Comment;
const SavedPost = require("../../database").SavedPost;
const User = require("../../database").User;

const router = express.Router();

router.post("/:userId/:postId", async (req, res) => {
    try {
        const savedpost = await SavedPost.findOne({ where: { userId: req.params.userId, postId: req.params.postId } })
        if (savedpost) {
            await SavedPost.destroy({ where: { userId: req.params.userId, postId: req.params.postId } })
        } else {
            const newSavedPost = await SavedPost.create({ userId: req.params.userId, postId: req.params.postId });
        }

        res.status(201).send('ok');
    } catch (error) {
        console.log(error);
        res.status(500).send("Something went bad!");
    }
});




router.get("/:userId/", async (req, res) => {
    try {

        const savedposts = await SavedPost.count({ where: { postId: req.params.postId } })
        const savedpost = await SavedPost.findOne({ where: { userId: req.params.userId, postId: req.params.postId } })
        const data = {
            total: savedposts
        }
        if (savedpost) {
            data.isSaved = true

        } else {
            data.isSaved = false
        }

        res.send(data);
    } catch (error) {
        console.log(error);
        res.status(500).send("Something went bad!");
    }
});

router.delete("/:id", async (req, res) => {
    try {
        await SavedPost.destroy({ where: { id: req.params.id } });
        res.send("savedpost removed");
    } catch (error) {
        console.log(error);
        res.status(500).send("Something went bad!");
    }
});




module.exports = router;