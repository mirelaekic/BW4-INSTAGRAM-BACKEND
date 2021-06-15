const express = require("express");
const endpoints = require("express-list-endpoints")
const cors = require("cors");
const path = require('path');
const passport = require("passport");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const servicesRouter = require("./routes");
const createSocketServer = require("./socket.js");
var socketio = require('socket.io')
const Pusher = require("pusher");

dotenv.config();
const expressStatusMonitor = require('express-status-monitor');
// const pass = require("./passport");
const database = require("./database");
const port = process.env.PORT || 9001;

const server = express();

//const http = require("http").createServer(server);
//const io = socketio(http)
// const io = require("socket.io")(httpServer);
// module.exports = io;
// io.on("connection", SocketManager);
server.use(cors({ 
  origin: [
    process.env.FRONT_URL,
    "https://instagram-mirelaekic.vercel.app/",
    "https://instagram-mirelaekic.vercel.app/login",
    "https://instagram-git-main-mirelaekic.vercel.app/",
    "http://localhost:3000",
    "http://localhost:3000/login"
  ],
  credentials:true,
  exposedHeaders: ["set-cookie"]
}))
server.use(express.static(path.join(__dirname, 'public')));

// io.on('connect',(socket) => {
//   console.log('connected socket!');

// });
const pusher = new Pusher({
  appId: "1219585",
  key: "f48d64e896fc6208be8e",
  secret: "ea101aa6e3f1b532bc73",
  cluster: "eu",
  useTLS: true
});

server.post('/message', (req, res) => {
  const payload = req.body;
  console.log(req.body,"THE PAYLOAD!!!")
  pusher.trigger('chat', 'message', payload);
  res.send(payload)
});
//createSocketServer(http)
server.set("trust proxy",1)
server.enable("trust proxy")
server.use(express.json());
server.use(cookieParser());

server.use("/insta", servicesRouter);
// server.use(expressStatusMonitor({
//   websocket: io,
//   port: port
// }));
console.log(endpoints(server));
database.sequelize.sync({ force: false }).then(() => {
  server.listen(port, () => {
    console.log("running on port" + port);
  });
});

