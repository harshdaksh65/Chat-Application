const { Server } = require("socket.io");

const userSocketMap = {};

let io;

function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: [process.env.FRONTEND_URL]
    },
  });

  io.on("connection", (socket) => {
    console.log("New client connected", socket.id);

    const userId = socket.handshake.query.userId;

    if(userId) {
      userSocketMap[userId] = socket.id;
    }

    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect",()=>{
        console.log("Client disconnected", socket.id);
        delete userSocketMap[userId];
        
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    })
  });
}

function getIO() {
  if (!io) {
    throw new Error("Socket.io not initialized! Call initSocket(server) first.");
  }
  return io;
}

function getReceiverSocket(userId) {
  return userSocketMap[userId];
}

module.exports = { getIO, initSocket, getReceiverSocket };
