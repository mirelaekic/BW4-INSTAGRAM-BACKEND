const User = require("../../database").User;
const Post = require("../../database").Post;
const Follow = require("../../database").Follow;
const Follower = require("../../database").Follower;
const Story = require("../../database").Story;
const StoryAlbum = require("../../database").StoryAlbum;
const Tagged = require("../../database").Tagged;
const SavedPost = require("../../database").SavedPost;
const Message = require("../../database").Message;

const jwt = require("jsonwebtoken");
const authenticate = require("../../authenticate");
const router = require("express").Router();

router.route("/register").post(async (req, res, next) => {
  try {
    const newUser = await User.create(req.body);
    res.send(newUser);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.route("/login").post(async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username } });
    if (user) {
      const isMatch = user.validPassword(password);
      if (isMatch) {
        const accessToken = await jwt.sign(
          { id: user.id },
          process.env.JWT_KEY,
          { expiresIn: "15m" }
        );
        const refreshToken = await jwt.sign(
          { id: user.id },
          process.env.JWT_REFRESH_KEY,
          { expiresIn: "1w" }
        );
        res.send({ accessToken, refreshToken });
      } else {
        res.status(401).send("Incorret Username or Password");
      }
    } else {
      res.status(401).send("Incorret Username or Password");
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.get("/", authenticate, async (req, res) => {
  try {
    const allUser = await User.findAll({
      include: [Post, Follow, Follower, Story, StoryAlbum, Tagged],
    }); //.findAll RETURNS ALL OF THE ArticleS. include:[] IS AN ARRAY THAT CONNECTS MODELS WITH THE REQUEST. THIS IS DONE SO AUTHORID CAN GET THE CORRESPONDING AUTHOR OBJECT
    res.send(allUser);
  } catch (error) {
    console.log(error);
    res.status(500).send("Something went wrong!");
  }
});

router.get("/:id", authenticate, async (req, res) => {
  try {
    if (req.user.dataValues.id.toString() === req.params.id) {
      const singleUser = await User.findByPk(req.params.id, {
        include: [
          Post,
          Follow,
          Follower,
          Story,
          StoryAlbum,
          Tagged,
          SavedPost,
          Message,
        ],
      });
      res.send(singleUser);
    } else {
      const singleUser = await User.findByPk(req.params.id, {
        include: [Post, Follow, Follower, Story, StoryAlbum, Tagged],
      });
      if (singleUser) {
        res.send(singleUser);
      } else {
        res.status(404).send("User not found within database");
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Something went wrong!");
  }
});

router.put("/:id", authenticate, async (req, res) => {
  try {
    if (req.user.dataValues.id.toString() === req.params.id) {
      const alteredUser = await User.update(req.body, {
        where: { id: req.params.id },
        include: [
          Post,
          Follow,
          Follower,
          Story,
          StoryAlbum,
          Tagged,
          SavedPost,
          Message,
        ],
        returning: true,
      });
      res.send(alteredUser);
    } else {
      res.status(401).send("Unauthorized: This is not your account!");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Something went wrong!");
  }
});

module.exports = router;
