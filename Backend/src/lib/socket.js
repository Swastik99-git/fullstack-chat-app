import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});

export function getReceiverSocketId(userId) {
  return userSocketMap[userId]; // returns the socketId of the user
}

// use to store online users
const userSocketMap = {}; // { userId: socketId }

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) {
    userSocketMap[userId] = socket.id;
  }

  // io.emit() is used to send a message to all connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap)); // send online users to all clients

  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);
    delete userSocketMap[userId]; // remove user from online users list
    io.emit("getOnlineUsers", Object.keys(userSocketMap)); // update online users list for all clients
  });
});

export { io, app, server };
