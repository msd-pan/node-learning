let io;

module.exports = {
  init: (httpServer) => {
    io = require("socket.io")(httpServer, {
      cors: {
        origin: "*", // Allow  cors requests from your frontend
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
      },
    });
    return io;
  },
  getIo: () => {
    if (!io) {
      throw new Error("Socket.io not initialized!");
    }
    return io;
  },
};
