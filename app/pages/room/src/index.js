import { constants } from "../../_shared/constants.js";
import RoomSocketBuilder from "./util/roomSocket.js";

const socketBuilder = new RoomSocketBuilder({
  socketURL: constants.socketURL,
  namespace: constants.sockerNamespaces.room,
});

const socket = socketBuilder
  .setOnUserConnected((user) => console.log("user connected!", user))
  .setOnUserDisconnected((user) => console.log("user disconnected!", user))
  .setOnRoomUpdated((room) => console.log("room list!", room))
  .build();

const room = {
  id: "0001",
  topic: "JS expert é nois",
};

const user = {
  avatar:
    "https://cdn4.iconfinder.com/data/icons/avatars-xmas-giveaway/128/pilot_traveller_person_avatar-512.png",
  username: "Fredowisk" + Date.now(),
};

socket.emit(constants.events.JOIN_ROOM, { user, room });
