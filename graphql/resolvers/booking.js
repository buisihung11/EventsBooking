const { getEventDocByID, getUserDocById } = require("./merge");
const Booking = require("../../models/booking");

module.exports = {
  bookings: async (args, req) => {
    // if (!req.isAuth) {
    //   throw new Error("Unauthenticated!");
    // }
    try {
      const bookings = await Booking.find();
      return bookings.map(booking => {
        return {
          ...booking._doc,
          event: getEventDocByID(booking.event),
          user: getUserDocById(booking.user)
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
      const user = await getUserDocById(event.creator);
      if (!user) throw new Error("Not find user");
      //for the mongoDB we only need asign the _id of event and user
      const booking = new Booking({
        event: event.id,
        user: user.id
      });
      await booking.save();
      return { ...booking._doc, event: event, user: user };
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
