import { WebSocket, WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });

interface Room {
  socket: WebSocket;
  roomId: string;
}

let rooms: Room[] = [];

wss.on("connection", function connection(ws) {
  ws.on("message", function message(data) {
    const paresedData = JSON.parse(data.toString());
    switch (paresedData.type) {
      case "join":
        rooms.push({
          socket: ws,
          roomId: paresedData.roomId,
        });

        break;
      case "chat":
        const currentUserRoom = rooms.find((x) => x.socket == ws)?.roomId;
        rooms.forEach((eachRoom) => {
          if (eachRoom.roomId == currentUserRoom && eachRoom.socket !== ws) {
            eachRoom.socket.send(paresedData.message);
          }
        });
    }
  });
});
