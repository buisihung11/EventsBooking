const Event = require("../../models/event");
const User = require("../../models/user");

const getEventDocByID = async eventId => {
  const event = await Event.findById(eventId);
  console.log("Event: ");
  console.log(event);
  return { ...event._doc };
};

const getUserDocById = async userId => {
  const user = await User.findById(userId);
  console.log("User: ");
  console.log(user);
  return { ...user._doc };
};

exports.getEventDocByID = getEventDocByID;
exports.getUserDocById = getUserDocById;
