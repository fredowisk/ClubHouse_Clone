import { constants } from "../../_shared/constants.js";

export default class RoomController {
  constructor({ roomInfo, socketBuilder, view, peerBuilder, roomService }) {
    this.socketBuilder = socketBuilder;
    this.peerBuilder = peerBuilder;
    this.roomInfo = roomInfo;
    this.view = view;
    this.roomService = roomService;

    this.socket = {};
  }

  static async initialize(deps) {
    return new RoomController(deps)._initialize();
  }

  async _initialize() {
    this._setupViewEvents();
    this.roomService.init();

    this.socket = this._setupSocket();
    this.roomService.setCurrentPeer(await this._setupWebRTC());
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

  async _setupWebRTC() {
    return this.peerBuilder
      .setOnError(this.onPeerError())
      .setOnConnectionOpened(this.onPeerConnectionOpened())
      .setOnCallReceived(this.onCallReceived())
      .setOnCallError(this.onCallError())
      .setOnCallClose(this.onCallClose())
      .setOnStreamReceived(this.onStreamReceived())
      .build();
  }

  onStreamReceived() {
    return (call, stream) => {
      const callerId = call.peer;
      console.log("onStreamReceived", call, stream);
      const { isCurrentId } = this.roomService.addReceivedPeer(call);
      this.view.renderAudioElement({
        callerId,
        stream,
        isCurrentId,
      });
    };
  }

  onCallClose() {
    return (call) => {
      console.log("onCallClose", call);
      const peerId = call.peer;
      this.roomService.disconnectPeer({ peerId });
    };
  }

  onCallError() {
    return (call, error) => {
      console.log("onCallError", call, error);
      const peerId = call.peer;
      this.roomService.disconnectPeer({ peerId });
    };
  }

  onCallReceived() {
    return async (call) => {
      const stream = await this.roomService.getCurrentStream();
      console.log("answering call", call);
      call.answer(stream);
    };
  }

  onPeerError() {
    return (error) => {
      console.error("deu ruim", error);
    };
  }

  onPeerConnectionOpened() {
    return (peer) => {
      console.log("peeeeeeer", peer);
      this.roomInfo.user.peerId = peer.id;
      this.socket.emit(constants.events.JOIN_ROOM, this.roomInfo);
    };
  }

  onUserProfileUpgrade() {
    return (user) => {
      console.log("onUserProfileUpgrade", user);

      this.roomService.upgradeUserPermission(user);

      if (user.isSpeaker) {
        this.view.addAttendeeOnGrid(user, true);
      }

      this.activateUserFeatures();
    };
  }

  onRoomUpdated() {
    return (room) => {
      console.log("room list!", room);
      this.roomService.updateCurrentUserProfile(room);
      this.view.updateAttendeesOnGrid(room);
      this.activateUserFeatures();
    };
  }

  onDisconnected() {
    return (user) => {
      console.log(`${user.username + user.id} disconnected!`);

      this.view.removeAttendeeFromGrid(user.id);

      this.roomService.disconnectPeer(user);
    };
  }

  onUserConnected() {
    return (user) => {
      console.log("user connected!", user);
      this.view.addAttendeeOnGrid(user);

      this.roomService.callNewUser(user);
    };
  }

  activateUserFeatures() {
    const currentUser = this.roomService.getCurrentUser();
    this.view.showUserFeatures(currentUser.isSpeaker);
  }
}
