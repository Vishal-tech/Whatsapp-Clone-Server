// server.js
import express from "express";
import "dotenv/config";

import { createServer } from "http";
import { Server } from "socket.io";
import { router } from "./src/routes/routes.js";
import { connectToMongoDB } from "./config/dbConfig.js";
import {
  verifyRequest,
  requestLogMiddleware,
} from "./src/middleware/middleware.js";
import cors from "cors";

// Connect to MongoDB
connectToMongoDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use(verifyRequest, requestLogMiddleware);
app.use("/api", router);

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  console.log("User connected");

  // Listen for chat messages
  socket.on("chatMessage", (message) => {
    io.emit("chatMessage", message);
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
