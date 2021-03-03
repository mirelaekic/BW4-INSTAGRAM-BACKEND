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
const whitelist = ["http://localhost:3000","http://localhost:3000/login","http://localhost:9001"];
const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};
server.use(cors(corsOptions));
server.use(cookieParser());
server.use(express.json());

server.use("/insta", servicesRouter);
database.sequelize.sync({ force: false }).then(() => {
  server.listen(port, () => {
    console.log("running on port" + port);
  });
});
