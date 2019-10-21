const { getEventDocByID, getUserDocById } = require("./merge");
const Booking = require("../../models/booking");

module.exports = {
  bookings: async (args, req) => {
    // if (!req.isAuth) {
    //   throw new Error("Unauthenticated!");
    // }
    try {
      const bookings = await Booking.find({ user: req.userId })
        .populate({ path: "user", populate: { path: "createdEvents" } })
        .populate({ path: "event", populate: { path: "creator" } })
        .exec();

      console.log(bookings);

      return bookings.map(booking => {
        return {
          ...booking._doc,
          createdAt: new Date(booking.createdAt).toISOString(),
          updatedAt: new Date(booking.updatedAt).toISOString()
        };
      });
    } catch (err) {
      throw err;
    }
  },
  bookEvent: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Unauthenticated!");
    }
    try {
      const event = await getEventDocByID(args.eventId);
      if (!event) throw new Error("Not find event");
      const user = await getUserDocById(req.userId);
      if (!user) throw new Error("Not find user");
      //for the mongoDB we only need asign the _id of event and user
      const booking = new Booking({
        event: event._id,
        user: user._id
      });
      return booking.save().then(savedBooking => {
        return savedBooking
          .populate("user")
          .populate("event")
          .execPopulate();
      });
    } catch (err) {
      throw err;
    }
  },
  cancelBooking: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Unauthenticated!");
    }
    try {
      const booking = await Booking.findById(args.bookingId);
      const event = getEventDocByID(booking.event);

      await Booking.deleteOne({ _id: args.bookingId });
      return event;
    } catch (err) {
      throw err;
    }
  }
};
