const Event = require("../../models/event");
const User = require("../../models/user");

const getEventDocByID = async eventId => {
  const event = await Event.findById(eventId).populate({
    path: "creator",
    populate: { path: "createdEvents" }
  });
  return event;
};

const getUserDocById = async userId => {
  const user = await User.findById(userId).populate({
    path: "createdEvents",
    populate: { path: "creator" }
  });
  console.log(user);
  return user;
};

exports.getEventDocByID = getEventDocByID;
exports.getUserDocById = getUserDocById;
