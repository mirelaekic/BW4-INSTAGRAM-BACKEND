const express = require("express");
const authenticate = require("../authenticate");
const router = express.Router();
const userRoute = require("./user");
const postRoute = require("./posts");
const expRoute = require("./exp");
const commentRoute = require("./comments");
const likeRoute = require("./like");
const followRoute = require("./follow");
const commentLikeRoute = require("./commentlikes");

router.use("/user", userRoute);
router.use("/posts", authenticate, postRoute);
router.use("/exp", authenticate, expRoute);
router.use("/comments", authenticate, commentRoute);
router.use("/like", authenticate, likeRoute);
router.use("/follow", authenticate, followRoute);
router.use("/commentlike", authenticate, commentLikeRoute);
module.exports = router;
