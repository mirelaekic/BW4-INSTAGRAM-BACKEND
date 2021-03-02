const express = require("express");
const Story = require("../../database").Story;
const User = require("../../database").User;
const multer = require("multer");
const cloudinary = require("../../cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "BW4",
    resource_type: "video",
  },
});
const cloudinaryMulter = multer({ storage: storage });

const router = express.Router();

router.post("/", cloudinaryMulter.single("PostImage"), async (req, res) => {
  try {
    const alteredStory = await Story.create({
      ...req.body,
      userId: req.user.dataValues.id,
      imgurl: req.file.path,
    });
    res.send(alteredStory);
  } catch (error) {
    console.log(error);
    res.status(500).send("Something went bad!");
  }
});

router.get("/", async (req, res) => {
  try {
    const allStory = await Story.findAll({
      include: [User],
    });
    res.send(allStory);
  } catch (error) {
    console.log(error);
    res.status(500).send("Something went bad!");
  }
});

router.get("/:id", async (req, res) => {
  try {
    const singleStory = await Story.findByPk(req.params.id, {
      include: [User],
    });
    res.send(singleStory);
  } catch (error) {
    console.log(error);
    res.status(500).send("Something went bad!");
  }
});

router.put("/:id", async (req, res) => {
  try {
    const StoryToEdit = await Story.findByPk(req.params.id);
    console.log(StoryToEdit.dataValues.userId);
    console.log(req.user.dataValues.id);
    if (StoryToEdit.userId === req.user.id) {
      const alteredPosts = await Story.update(req.body, {
        where: { id: req.params.id },
        returning: true,
      });
      res.send(alteredPosts);
    } else {
      res.status(401).send("Unauthorized: You can only edit your own stories!");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Something went bad!");
  }
});

module.exports = router;
