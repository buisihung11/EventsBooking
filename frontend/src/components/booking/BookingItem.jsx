import React from "react";
import "./BookingItem.css";

const bookingItem = props => {
  return (
    <li className="bookings__item">
      <div className="bookings__item-data">
        <p>{new Date(props.createdAt).toLocaleDateString()}</p>
        <p>{props.eventTitle}</p>
        <p>{props.userEmail}</p>
      </div>
      <div className="bookings__item-actions">
        <button
          className="btn"
          onClick={props.onCancle.bind(this, props.bookingId)}
        >
          Cancel
        </button>
      </div>
    </li>
  );
};
export default bookingItem;
