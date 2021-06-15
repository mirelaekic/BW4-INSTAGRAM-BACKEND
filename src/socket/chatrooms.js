const Room = require("../database").Room;
const Message = require("../database").Message
const generateRoom = async (message, reciever, sender) => {
  try {
      console.log(reciever,"THE RECEIVER OF THE MESSAGE =================== ")
    const messageToAdd = await stringifyMessages({
      text: message,
      createdAt: new Date(),
      sender: sender,
    });

    const newRoom = await Room.create({
      roomName: `user${reciever}&user${sender}`,
      messages: [messageToAdd],
      users: [reciever, sender],
    });
    console.log(newRoom,"THE NEW ROOOM :::::::::::::::::::::::::::::::::::::::")
    return newRoom;
  } catch (error) {
    console.log(error);
  }
};

const findRoom = async (reciever, sender) => {
  try {
    const roomA = await Room.findOne({
      where: { roomName: `user${reciever}&user${sender}` },
    });
    const roomB = await Room.findOne({
      where: { roomName: `user${sender}&user${reciever}` },
    });
    console.log(roomA,roomB,"ROOMS A AND B ::::::::: TRYING TO FIND THE ROOMSSSSSSSSSSSSSSS")
    console.log(reciever,sender,"*******************THE RECIVERE AND SENDER WHEN TRYING TO FIND A ROOM ******************************")
    if (roomA && !roomB) {
      return roomA;
    } else if (roomB && !roomA) {
      return roomB;
    } else {
      return undefined;
    }
  } catch (error) {
    console.log(error);
  }
};

const addMessage = async (messageArray, message, receiver, sender) => {
  try {
    const messageToAdd = await stringifyMessages({
      text: message,
      createdAt: new Date(),
      sender: sender,
    });
    console.log(messageArray,"THE MESSAGE ARRAY *!*!*!!**!*!**!*!!**!*!*!*!*!*!**!'''''''######")
    console.log(messageToAdd,"THE MESSAGE TO PUSH TO ARRAY")
    await messageArray.push(messageToAdd);
    const updatedRoom = await Room.update(
      { messages: messageArray },
      { where: { roomName: `user${receiver}&user${sender}` } }
    );
    return updatedRoom;
  } catch (error) {
    console.log(error);
  }
};

const getAllUserChats = async (userId) => {
  try {
    const allRooms = await Room.findAll({
        include:[Message]
    });

    const userRooms = await allRooms.filter((room) =>
      room.roomName.split("&").indexOf(`user${userId}` > 0)
    );
    console.log(userRooms,"ThE USER ROOMSSS");
    if (userRooms) {
      let allChats = [];
      await userRooms.forEach(async (room) => {
        const chat = {};
        let parsedMessages = await parseMessages(room.messages);
        room.roomName.split("&").forEach((user) => {
          if (user.split("user")[1] !== userId.toString()) {
            chat.withUserId = user.split("user")[1];
          }
        });
        chat.messageHistory = parsedMessages;
        allChats.push(chat);
        console.log("USERS MESSAGES !!!!!!!!!!", parsedMessages);
      });
      console.log(allChats," AASDALDKSALDKA ALL <<<<<<<<<<<<C###H###A###T##S>>>>>>>>>");
      return allChats;
    } else {
      return undefined;
    }
  } catch (error) {
    console.log(error);
  }
};

const stringifyMessages = async (messages) => {
  const messageString = await JSON.stringify(messages);
  return messageString;
};

const parseMessages = async (messages) => {
  console.log("STRING", messages);
  const messageArray = [];
  await messages.forEach(async (message) => {
    const messageObj = await JSON.parse(message);
    messageArray.push(messageObj);
  });
  console.log("OBJECT", messageArray);
  return messageArray;
};

module.exports = { generateRoom, findRoom, addMessage, getAllUserChats };