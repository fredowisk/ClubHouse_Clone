import { constants } from "../../_shared/constants.js";
import RoomController from "./controller.js";
import RoomSocketBuilder from "./util/roomSocket.js";
import View from "./view.js";

const urlParams = new URLSearchParams(window.location.search);
const keys = ["id", "topic"];

const urlData = keys.map((key) => [key, urlParams.get(key)]);

const user = {
  avatar:
    "https://cdn4.iconfinder.com/data/icons/avatars-xmas-giveaway/128/pilot_traveller_person_avatar-512.png",
  username: "Fredowisk",
};

const roomInfo = { room: { ...Object.fromEntries(urlData) }, user };

const socketBuilder = new RoomSocketBuilder({
  socketURL: constants.socketURL,
  namespace: constants.sockerNamespaces.room,
});

const dependencies = {
  view: View,
  socketBuilder,
  roomInfo,
};

RoomController.initialize(dependencies);
