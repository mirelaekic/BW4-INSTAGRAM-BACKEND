/** @format */

const UserDB = require("./database").User;
const jwt = require("jsonwebtoken");
const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.JWT_KEY, async (err, decodedToken) => {
      if (err) {
        res.sendStatus(403);
      } else {
        console.log("user", decodedToken);
        const user = await UserDB.findByPk(decodedToken.id);
        console.log(user);
        req.user = user;
        next();
      }
    });
  } else {
    res.sendStatus(401);
  }
};
module.exports = authenticate;
