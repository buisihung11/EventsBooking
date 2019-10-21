import React from "react";
import BookingItem from "./BookingItem";

import "./BookingList.css";

const bookingList = props => {
  const bookings = props.bookings.map(booking => {
    return (
      <BookingItem
        key={booking._id}
        bookingId={booking._id}
        createdAt={booking.createdAt}
        eventTitle={booking.event.title}
        userEmail={booking.user.email}
        onCancle={props.onCancle}
      />
    );
  });

  return <ul className="bookings__list">{bookings}</ul>;
};

export default bookingList;
