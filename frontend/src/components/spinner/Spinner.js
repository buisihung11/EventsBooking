import React from "react";

import "./Spinner.css";

const spinner = () => (
  <div className="spinner">
    <div className="lds-ring">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  </div>
);
export default spinner;
