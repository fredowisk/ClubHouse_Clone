export const constants = {
  socketURL: "http://localhost:3000",
  sockerNamespaces: {
    room: "room",
    lobby: "lobby",
  },
  events: {
    USER_CONNECTED: "userConnection",
    USER_DISCONNECTED: "userDisconnection",

    JOIN_ROOM: "joinRoom",

    LOBBY_UPDATED: "lobbyUpated",
    UPGRADE_USER_PERMISSION: 'upgradeUserPermission',
  },
};
