import Attendee from "./entities/attendee.js";
import getTemplate from "./templates/attendeeTemplate.js";

const userAvatar = document.getElementById("imgUser");
const roomTopic = document.getElementById("pTopic");
const gridAttendees = document.getElementById("gridAttendees");
const gridSpeakers = document.getElementById("gridSpeakers");

export default class View {
  static updateUserImage({ avatar, username }) {
    userAvatar.src = avatar;
    userAvatar.alt = username;
  }

  static updateRoomTopic({ topic }) {
    roomTopic.innerHTML = topic;
  }

  static updateAttendeesOnGrid(users) {
    users.forEach((item) => View.addAttendeeOnGrid(item));
  }

  static _getExistingAttendeeOnGrid({ id, baseElement = document }) {
    const existingItem = baseElement.querySelector(`[id="${id}"]`);
    return existingItem;
  }

  static removeAttendeeFromGrid(id) {
    const existingElement = View._getExistingAttendeeOnGrid({ id });
    existingElement?.remove();
  }

  static addAttendeeOnGrid(item, removeFirst = false) {
    const attendee = new Attendee(item);
    const id = attendee.id;
    const htmlTemplate = getTemplate(attendee);
    const baseElement = attendee.isSpeaker ? gridSpeakers : gridAttendees;

    if (removeFirst) {
      View.removeAttendeeFromGrid(id);
      baseElement.innerHTML += htmlTemplate;
    }

    const existingItem = View._getExistingAttendeeOnGrid({ id, baseElement });
    if (existingItem) {
      existingItem.innerHTML = htmlTemplate;
      return;
    }

    baseElement.innerHTML += htmlTemplate;
  }
}
