const express = require("express");
const cors = require("cors");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const userRouter = require('./routes/users')
dotenv.config();
// const pass = require("./passport");
const database = require("./database");


const port = process.env.PORT || 9001

const server = express();
server.use(cookieParser())
server.use(cors())

server.use(express.json())
server.use('/users', userRouter)
database.sequelize.sync({ force: true }).then(() => {
    server.listen(port, () => { console.log('running on port' + port) })
})
