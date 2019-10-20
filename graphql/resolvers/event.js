const Event = require("../../models/event");
const User = require("../../models/user");
module.exports = {
  events: () => {
    //need return because this is async we need to wait to response
    //in event we populate the creator (becuz this is only return the _id which we want is the creator document to be returned)
    //then in the creator (User) we want to have the Event document so we populate again
    //ref: https://mongoosejs.com/docs/populate.html#deep-populate
    return Event.find()
      .populate({ path: "creator", populate: { path: "createdEvents" } })
      .then(events => {
        //overide _id because _id from mongo is an obj (old version)
        return events.map(event => ({
          ...event._doc,
          date: new Date(event.date).toISOString()
        }));
      })
      .catch(err => {
        console.log(err);
      });
  },

  createEvent: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Unauthenticated!");
    }
    const input = args.eventInput;
    const event = new Event({
      title: input.title,
      description: input.description,
      price: +input.price,
      date: new Date(input.date),
      creator: req.userId
    });
    let createdEvent;
    try {
      let savedEvent = await event.save();
      let user = await User.findById(req.userId);
      if (!user) {
        throw new Error("User not found");
      } else {
        //get the User document
        createdEvent = await savedEvent.populate("creator").execPopulate();
        console.log("CreateEvent");
        console.log(createdEvent);
        user.createdEvents.push(event);
        await user.save();
        return createdEvent;
      }
    } catch (err) {
      console.error(err);
    }
  }
};
