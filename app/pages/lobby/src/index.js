import { constants } from "../../_shared/constants.js";
import LobbyController from "./controller.js";
import LobbySocketBuilder from "./util/lobbySocketBuilder.js";
import View from "./view.js";

const user = {
  avatar: "https://cdn4.iconfinder.com/data/icons/avatars-xmas-giveaway/128/pilot_traveller_person_avatar-512.png",
  username: "Fredowisk",
};

const socketBuilder = new LobbySocketBuilder({
  socketURL: constants.socketURL,
  namespace: constants.sockerNamespaces.lobby,
});

const dependencies = {
  socketBuilder,
  user,
  view: View,
};

LobbyController.initialize(dependencies);
