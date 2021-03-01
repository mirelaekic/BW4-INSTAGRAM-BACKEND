/** @format */

const User = require("./database").User;
const jwt = require("jsonwebtoken");
const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.JWT_KEY, async (err, user) => {
      if (err) {
        res.sendStatus(403);
      }
      console.log("user", user);
      const profile = await User.findByPk(user.id);
      console.log(profile);
      req.profile = profile;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};
module.exports = authenticate;
