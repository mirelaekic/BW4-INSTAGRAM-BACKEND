const User = require("../../database").User;
const Post = require("../../database").Post;
const Follow = require("../../database").Follow;
const Follower = require("../../database").Follower;
const Story = require("../../database").Story;
const StoryAlbum = require("../../database").StoryAlbum;
const Tagged = require("../../database").Tagged;
const Message = require("../../database").Message;
const SavedPost = require("../../database").SavedPost;
const multer = require("multer");
const cloudinary = require("../../cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const {deleteCookies} = require("./auth")
const Pusher = require("pusher");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "BW4",
  },
});
const {FRONT_URL} = process.env
const cloudinaryMulter = multer({ storage: storage });
const jwt = require("jsonwebtoken");
const { authenticate, refreshToken } = require("../../authenticate");
const router = require("express").Router();
const { getAllUserChats } = require("../../socket/chatrooms");
router.route("/register").post(async (req, res, next) => {
  try {
    const newUser = await User.create({
      ...req.body,
      imgurl:
        "https://res.cloudinary.com/dhmw620tl/image/upload/v1611844643/benchmark3/i91vqe984yfdir5xp8xh.png",
    });
    res.send(newUser);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.get("/logout", async (req, res, next) => {
  try {
    await deleteCookies(res);
    //return res.redirect(`${FRONT_URL}/login`);
    return res.redirect("http://localhost:3000/login")
  } catch (err) {
    console.log(err);
    const error = new Error("Something went wrong");
    error.code = 401;
    next(error);
  }
})

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
          { expiresIn: "30m" }
        );
        const refreshToken = await jwt.sign(
          { id: user.id },
          process.env.JWT_REFRESH_KEY,
          { expiresIn: "1w" }
        );
        res.cookie("accessToken", accessToken,  {
        httpOnly: true,
         secure:true,
         sameSite:"none"
      });
        res.cookie("refreshToken", refreshToken,  {
        httpOnly: true,
         secure:true,
         sameSite:"none"
      });
       res.send(user)
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
// router.get("/me", authenticate,async (req,res,next) => {
//   try {
//     res.send(req.user.dataValues)
//   } catch (error) {
//     res.send(401).send("fuk")
//   }
// })
router.get("/", authenticate, async (req, res) => {
  try {
    const allUser = await User.findAll({
      include: [
        Post,
        { model: Follow, include: [{ model: User, as: "following" }] },
        { model: Follower, include: [{ model: User, as: "follower" }] },
        Story,
        StoryAlbum,
        Tagged,
      ],
    }); //.findAll RETURNS ALL OF THE ArticleS. include:[] IS AN ARRAY THAT CONNECTS MODELS WITH THE REQUEST. THIS IS DONE SO AUTHORID CAN GET THE CORRESPONDING AUTHOR OBJECT
    res.send(allUser);
  } catch (error) {
    console.log(error);
    res.status(500).send("Something went wrong!");
  }
});
router.get("/me",authenticate,async (req,res) => {
  try {
      const singleUser = await User.findByPk(req.user.dataValues.id, {
        include: [
          Post,
          { model: Follow, include: [{ model: User, as: "following" }] },
          { model: Follower, include: [{ model: User, as: "follower" }] },
          Story,
          StoryAlbum, 
          Tagged,
          Message,
          SavedPost,
        ],
      });
      res.send(singleUser)
  } catch (error) {
    console.log(error);
    res.status(500).send("Something went wrong!");
  }
})
router.get("/:id", authenticate, async (req, res) => {
  try {
    if (req.user.dataValues.id.toString() === req.params.id) {
      console.log("The user MACHES")
      const singleUser = await User.findByPk(req.params.id, {
        include: [
          Post,
          { model: Follow, include: [{ model: User, as: "following" }] },
          { model: Follower, include: [{ model: User, as: "follower" }] },
          Story,
          StoryAlbum, 
          Tagged,
          Message,
          SavedPost,
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
router.delete("/:id", authenticate, async (req,res) => {
  try {
    if(req.user.dataValues.id.toString() === req.params.id){
       await User.destroy({
        where: {id: req.user.dataValues.id}
      })
      res.send("user deleted")
    }
  } catch (error) {
    console.log(error)
    res.status(500).send("Something went wrong")
  }
})
router.put("/:id", authenticate, async (req, res) => {
  try {
    if (req.user.dataValues.id.toString() === req.params.id) {
      const alteredUser = await User.update(req.body, {
        where: { id: req.params.id },
        include: [Post, Follow, Follower, Story, StoryAlbum, Tagged, Message],
        returning: true,
      });
      console.log(alteredUser,"THE UPDATED USER ---------")
      res.send(alteredUser);
    } else {
      res.status(401).send("Unauthorized: This is not your account!");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Something went wrong!");
  }
});
router.put(
  "/:id/upload",
  authenticate,
  cloudinaryMulter.single("ProfilePic"),
  async (req, res) => {
    try {
      if (req.user.dataValues.id.toString() === req.params.id) {
        const alteredIMG = await User.update(
          { ...req.body, imgurl: req.file.path },
          {
            where: { id: req.params.id },
            returning: true,
          }
        );
        res.send(alteredIMG);
      } else {
        res.status(401).send("Unauthorized: This is not your account!");
      }
    } catch (error) {
      console.log(error);
      res.status(500).send("Something went bad!");
    }
  }
  );
router.route("/refresh/token").post(async (req, res, next) => {
  try {
    const ref = req.cookies.refreshToken;
    const newTokens = await refreshToken(ref);
    console.log(newTokens);
    res.cookie("accessToken", newTokens.accessToken,{
        httpOnly: true,
         secure:true,
        sameSite:"none"
      });
    res.cookie("refreshToken", newTokens.refreshToken, {
        httpOnly: true,
        secure:true,
        sameSite:"none"
      });
    res.send("Tokens Regenrated!");
  } catch (error) {
    console.log(error);
    next(error);
  }
});
router.get("/give/me/those/chats", authenticate, async (req, res) => {
  try {
    const allChats = await getAllUserChats(req.user.dataValues.id);
    res.send(allChats);
    console.log(allChats,"ALL CHATS")
  } catch (error) {
    console.log(error);
    res.status(500).send("aw fuck");
  }
});


module.exports = router;
