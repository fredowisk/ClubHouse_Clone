import { constants } from "../../_shared/constants.js";
import Media from "../../_shared/media.js";
import PeerBuilder from "../../_shared/peerBuilder.js";
import RoomController from "./controller.js";
import RoomService from "./service.js";
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

const peerBuilder = new PeerBuilder({ peerConfig: constants.peerConfig });

const socketBuilder = new RoomSocketBuilder({
  socketURL: constants.socketURL,
  namespace: constants.sockerNamespaces.room,
});

const roomService = new RoomService({
  media: Media,
});

const dependencies = {
  view: View,
  socketBuilder,
  roomInfo,
  peerBuilder,
  roomService,
};

RoomController.initialize(dependencies).catch((error) => {
  alert(error.message);
});
