/** @format */

const socketio = require("socket.io");
const {
  VERIFY_USER,
  USER_CONNECTED,
  USER_DISCONNECTED,
  LOGOUT,
  COMMUNITY_CHAT,
  MESSAGE_RECIEVED,
  MESSAGE_SENT,
  TYPING,
  PRIVATE_MESSAGE,
  NOTIFICATION,
  LIST,
} = require("./socket/Events");

const { createMessage, createUser, createChat } = require("./socket/Factories");
const { generateRoom, findRoom, addMessage } = require("./socket/chatrooms");

let connectedUsers = [];

const createSocketServer = (socket) => {
  const io = socketio(socket);
  io.on("connect", (socket) => {
    let sendMessageToChatFromUser;
    let sendTypingFromUser;
    console.log(`New socket connection --> ${socket.id}`);
    //Verify Username
     socket.on(VERIFY_USER, (nickname, callback) => {
         console.log(nickname,"====== VERIFIYING THE USER ========")
       if (isUser(connectedUsers, nickname)) {
         callback({ isUser: true, user: null });
       } else {
         callback({
           isUser: false,
           user: createUser({ userId: nickname, socketId: socket.id }),
         });
       }
     });

    socket.on(USER_CONNECTED, (user) => {
       user.socketId = socket.id;
       connectedUsers.push(user);
       socket.user = user;

       sendMessageToChatFromUser = sendMessageToChat(user.name);
       sendTypingFromUser = sendTypingToChat(user.name);

       io.emit(USER_CONNECTED, connectedUsers);
       console.log(connectedUsers);
     });

    //User logsout
     socket.on(LOGOUT, (data) => {
       connectedUsers = connectedUsers.filter(
         (user) => user.userId !== data.userId
       );

       io.emit(USER_DISCONNECTED, connectedUsers);
       console.log("Disconnect", connectedUsers);
     });

    // socket.on(MESSAGE_SENT, ({ chatId, message }) => {
    //   sendMessageToChatFromUser(chatId, message);
    // });

    // socket.on(TYPING, ({ chatId, isTyping }) => {
    //   sendTypingFromUser(chatId, isTyping);
    // });

     socket.on(PRIVATE_MESSAGE, async (data) => {
       const Room = await findRoom(data.reciever, data.sender);
       if (Room !== undefined) {
           console.log(Room.messages,"THE ROOM ------------------------->>>>>>>>>>>>------")
         await addMessage(
           Room.messages,
           data.message,
           data.reciever,
           data.sender
         );
       } else {
         await generateRoom(data.message, data.reciever, data.sender);
       }
       console.log("------------", data);
       console.log("/////////////////", connectedUsers);
       const index = connectedUsers.findIndex(
         (user) => user.userId === data.reciever
       );
       console.log(index);
       if (index !== -1) {
         console.log("SENDING TO USER!");
         const recieverSocket = connectedUsers[index].socketId;
         socket.to(recieverSocket).emit(PRIVATE_MESSAGE, data);
       }
     });

    // socket.on(NOTIFICATION, async (data) => {
    //   const user =
    //     connectedUsers[
    //       connectedUsers.indexOf((user) => user.userId === data.user)
    //     ];
    //   if (user) {
    //     socket.to(user).emit(NOTIFICATION, data);
    //   }
    // });
  });
};

module.exports = createSocketServer;
/*
 * Returns a function that will take a chat id and a boolean isTyping
 * and then emit a broadcast to the chat id that the sender is typing
 * @param sender {string} username of sender
 * @return function(chatId, message)
 */
function sendTypingToChat(user) {
  return (chatId, isTyping) => {
    socketio.emit(`${TYPING}-${chatId}`, { user, isTyping });
  };
}

/*
 * Returns a function that will take a chat id and message
 * and then emit a broadcast to the chat id.
 * @param sender {string} username of sender
 * @return function(chatId, message)
 */
function sendMessageToChat(sender) {
  return (chatId, message) => {
    socketio.emit(
      `${MESSAGE_RECIEVED}-${chatId}`,
      createMessage({ message, sender })
    );
  };
}

/*
 * Checks if the user is in list passed in.
 * @param userList {Object} Object with key value pairs of Users
 * @param username {String}
 * @return userList {Object} Object with key value pairs of Users
 */
function isUser(userList, username) {
  return username in userList;
}
