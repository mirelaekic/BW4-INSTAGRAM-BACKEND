const express = require("express");
const cors = require("cors");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const servicesRouter = require("./routes");
dotenv.config();
// const pass = require("./passport");
const database = require("./database");

const port = process.env.PORT || 9001;

const server = express();
server.use(cookieParser());
server.use(cors());

server.use(express.json());
server.use("/insta", servicesRouter);
database.sequelize.sync({ force: false }).then(() => {
  server.listen(port, () => {
    console.log("running on port" + port);
  });
});
