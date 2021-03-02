const express = require("express");
const Post = require("../../database").Post;
const User = require("../../database").User;
const Comment = require("../../database").Comment;
const Reply = require("../../database").Reply;
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
        const newReply = await Reply.create(req.body); 
        res.status(201).send(newReply);
    } catch (error) {
        console.log(error);
        res.status(500).send("Something went bad!");
    }
});

router.get("/", async (req, res) => {
    try {
        const allReply = await Reply.findAll({
            include: [Comment, Post, User],
        });
        res.send(allReply);
    } catch (error) {
        console.log(error);
        res.status(500).send("Something went bad!");
    }
});

router.get("/:id", async (req, res) => {
    try {
        const singleReply = await Reply.findByPk(req.params.id, {
            include: [Comment, Post, User],
        });
        res.send(singleReply);
    } catch (error) {
        console.log(error);
        res.status(500).send("Something went bad!");
    }
});

router.delete("/:id", async (req, res) => {
    try {
        await Reply.destroy({ where: { id: req.params.id } });
        res.send("reply destroyed");
    } catch (error) {
        console.log(error);
        res.status(500).send("Something went bad!");
    }
});

router.put("/:id", async (req, res) => {
    try {
        const alteredReply = await Reply.update(req.body, {
            where: { id: req.params.id },
            returning: true,
        });
        res.send(alteredReply);
    } catch (error) {
        console.log(error);
        res.status(500).send("Something went bad!");
    }
});

router.post(
    "/:id/upload",
    cloudinaryMulter.single("ReplyImage"),
    async (req, res) => {
        try {
            const alteredReply = await Reply.update(
                { imgurl: req.file.path },
                {
                    where: { id: req.params.id },
                    returning: true,
                }
            );
            res.send(alteredReply);
        } catch (error) {
            console.log(error);
            res.status(500).send("Something went bad!");
        }
    }
);

module.exports = router;