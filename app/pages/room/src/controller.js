import { constants } from "../../_shared/constants.js";

export default class RoomController {
  constructor({ roomInfo, socketBuilder, view }) {
    this.socketBuilder = socketBuilder;
    this.roomInfo = roomInfo;
    this.view = view;
    this.socket = {};
  }

  static async initialize(deps) {
    return new RoomController(deps)._initialize();
  }

  async _initialize() {
    this._setupViewEvents();
    this.socket = this._setupSocket();

    this.socket.emit(constants.events.JOIN_ROOM, this.roomInfo);
  }

  _setupViewEvents() {
    this.view.updateUserImage(this.roomInfo.user);
    this.view.updateRoomTopic(this.roomInfo.room);
  }

  _setupSocket() {
    return this.socketBuilder
      .setOnUserConnected(this.onUserConnected())
      .setOnUserDisconnected(this.onDisconnected())
      .setOnRoomUpdated(this.onRoomUpdated())
      .setOnUserProfileUpgrade(this.onUserProfileUpgrade())
      .build();
  }

  onUserProfileUpgrade() {
    return (user) => {
      console.log("onUserProfileUpgrade", user);

      if (user.isSpeaker) {
        this.view.addAttendeeOnGrid(user, true);
      }
    };
  }

  onRoomUpdated() {
    return (room) => {
      console.log("room list!", room);
      this.view.updateAttendeesOnGrid(room);
    };
  }

  onDisconnected() {
    return (user) => {
      console.log(`${user.username} disconnected!`);

      this.view.removeAttendeeFromGrid(user.id);
    };
  }

  onUserConnected() {
    return (user) => {
      console.log("user connected!", user);
      this.view.addAttendeeOnGrid(user);
    };
  }
}
