const express = require("express");
const cors = require("cors");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const servicesRouter = require("./routes");
dotenv.config();
// const pass = require("./passport");
const database = require("./database");
const http = require("http");

const port = process.env.PORT || 9001;

const server = express();

//socket
const httpServer = http.createServer(server);
const io = require("socket.io")(httpServer);
module.exports = io;
const SocketManager = require("./socket.js");
io.on("connection", SocketManager);
server.set("trust proxy",1)
server.enable("trust proxy")
server.use(express.json());

server.use(cors({
  origin: [
    process.env.FRONT_URL,
    "http://localhost:3000"
  ],
  credentials:true,
  exposedHeaders: ["set-cookie"]
}))
server.use(cookieParser());

server.use("/insta", servicesRouter);
console.log(database,"the data")
database.sequelize.sync({ force: false }).then(() => {
  httpServer.listen(port, () => {
    console.log("running on port" + port);
  });
});

