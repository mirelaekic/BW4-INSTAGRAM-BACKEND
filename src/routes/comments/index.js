const express = require("express");
const Post = require("../../database").Post;
const Profile = require("../../database").Profile;
const Comment = require("../../database").Comment;
const multer = require("multer");
const cloudinary = require("../../cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "samples",
    },
});
const cloudinaryMulter = multer({ storage: storage });

const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const newComment = await Comment.create(req.body); //.create IS A SEQUELIZE METHOD DOR MODELS, IT CREATES A NEW ROW IN THE TABLE
        res.status(201).send(newComment);
    } catch (error) {
        console.log(error);
        res.status(500).send("Something went bad!");
    }
});

router.get("/", async (req, res) => {
    try {
        const allComments = await Comment.findAll({
            include: [Post, Profile],
        });
        res.send(allComments);
    } catch (error) {
        console.log(error);
        res.status(500).send("Something went bad!");
    }
});

router.get("/:id", async (req, res) => {
    try {
        const singleComment = await Comment.findByPk(req.params.id, {
            include: [Post, Profile],
        });
        res.send(singleComment);
    } catch (error) {
        console.log(error);
        res.status(500).send("Something went bad!");
    }
});

router.delete("/:id", async (req, res) => {
    try {
        await Comment.destroy({ where: { id: req.params.id } });
        res.send("comment destroyed");
    } catch (error) {
        console.log(error);
        res.status(500).send("Something went bad!");
    }
});

router.put("/:id", async (req, res) => {
    try {
        const alteredComment = await Comment.update(req.body, {
            where: { id: req.params.id },
            returning: true,
        });
        res.send(alteredComment);
    } catch (error) {
        console.log(error);
        res.status(500).send("Something went bad!");
    }
});

router.post(
    "/:id/upload",
    cloudinaryMulter.single("CommentImage"),
    async (req, res) => {
        try {
            const alteredComment = await Comment.update(
                { imgurl: req.file.path },
                {
                    where: { id: req.params.id },
                    returning: true,
                }
            );
            res.send(alteredComment);
        } catch (error) {
            console.log(error);
            res.status(500).send("Something went bad!");
        }
    }
);

module.exports = router;