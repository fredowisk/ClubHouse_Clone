import Event from "events";

import SocketServer from "./util/socket.js";
import RoomsController from "./controllers/roomsController.js";
import { constants } from "./util/constants.js";
import LobbyController from "./controllers/lobbyController.js";

const port = process.env.port || 3000;
const socketServer = new SocketServer({ port });
const server = await socketServer.start();

const roomsPubSub = new Event();

const roomsController = new RoomsController();
const lobbyController = new LobbyController({
  activeRooms: roomsController.rooms,
  roomsListener: roomsPubSub,
});

const namespaces = {
  room: { controller: roomsController, eventEmitter: new Event() },
  lobby: { controller: lobbyController, eventEmitter: roomsPubSub },
};

const routeConfig = Object.entries(namespaces).map(
  ([namespace, { controller, eventEmitter }]) => {
    const controllerEvents = controller.getEvents();
    eventEmitter.on(
      constants.events.USER_CONNECTED,
      controller.onNewConnection.bind(controller)
    );

    return {
      [namespace]: {
        events: controllerEvents,
        eventEmitter,
      },
    };
  }
);

socketServer.attachEvents({ routeConfig });

console.log("socket server is running at ", server.address().port);
