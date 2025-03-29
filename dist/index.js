"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const wss = new ws_1.WebSocketServer({ port: 8080 });
let rooms = [];
wss.on("connection", function connection(ws) {
    ws.on("message", function message(data) {
        var _a;
        const paresedData = JSON.parse(data.toString());
        switch (paresedData.type) {
            case "join":
                rooms.push({
                    socket: ws,
                    roomId: paresedData.roomId,
                });
                break;
            case "chat":
                const currentUserRoom = (_a = rooms.find((x) => x.socket == ws)) === null || _a === void 0 ? void 0 : _a.roomId;
                rooms.forEach((eachRoom) => {
                    if (eachRoom.roomId == currentUserRoom && eachRoom.socket !== ws) {
                        eachRoom.socket.send(paresedData.message);
                    }
                });
        }
    });
});
