import React from "react";

const bookingControl = props => {
  return (
    <div>
      <button className="btn" onClick={props.onChangeOutput.bind(this, "list")}>
        List
      </button>
      <button
        className="btn"
        onClick={props.onChangeOutput.bind(this, "chart")}
      >
        Chart
      </button>
    </div>
  );
};

export default bookingControl;
