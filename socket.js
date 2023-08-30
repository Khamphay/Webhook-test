// var { Server } = require("socket.io");
// var io = new Server();

// function socketConn(http) {
//   io.attach(http);
//   io.on("connection", (socket) => (client = client));
//   io.on("error", (err) => console.error(err));
// }

// function socketEmit(data) {
//   client.emit("tst", data);
//   return socket;
// }

// module.exports = { socketConn, socketEmit };

// import { WebSocketServer } from "ws";
// const server = new WebSocketServer({ port: 80 });

// module.exports = {
//   socketConn: (data) => {
//     server.on("connection", (socket) => {
//       // send a message to the client
//       socket.emit(
//         "tst",
//         JSON.stringify({
//           type: "hello from server",
//           content: [1, "2"],
//         })
//       );
//     });
//   },
// };
