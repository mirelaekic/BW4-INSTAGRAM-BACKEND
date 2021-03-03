/** @format */

const UserDB = require("./database").User;
const jwt = require("jsonwebtoken");

const authenticate = async (req, res, next) => {
  const accessToken = req.cookies.accessToken;

  if (accessToken) {
    jwt.verify(accessToken, process.env.JWT_KEY, async (err, decodedToken) => {
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

const verifyRefresh = (token) =>
  new Promise((res, rej) =>
    jwt.verify(token, process.env.JWT_REFRESH_KEY, (err, decodedToken) => {
      if (err) rej(err);
      res(decodedToken);
    })
  );

const refreshToken = async (oldToken) => {
  const decodedToken = await verifyRefresh(oldToken);

  const accessToken = await jwt.sign(
    { id: decodedToken.id },
    process.env.JWT_KEY,
    { expiresIn: "15m" }
  );
  const refreshToken = await jwt.sign(
    { id: decodedToken.id },
    process.env.JWT_REFRESH_KEY,
    { expiresIn: "1w" }
  );
  return { accessToken: accessToken, refreshToken: refreshToken };
};
module.exports = { authenticate, refreshToken };
