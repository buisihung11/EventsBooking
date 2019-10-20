import React from "react";
import { NavLink } from "react-router-dom";

import AuthContext from "../../context/auth-context";
//this is tool that combine the css file to the final result
import "./Navigation.css";

const mainNavigation = props => (
  <AuthContext.Consumer>
    {context => {
      return (
        <header className="main-navigation">
          <div className="main-navigation__logo">
            <h1>Hung's React</h1>
          </div>
          <nav className="main-navigation__nav">
            <ul>
              {!context.token && (
                <li>
                  <NavLink to="/auth">Login</NavLink>
                </li>
              )}

              <li>
                <NavLink to="/events">Events</NavLink>
              </li>

              {context.token && (
                <React.Fragment>
                  <li>
                    <NavLink to="/bookings">Bookings</NavLink>
                  </li>
                  <li>
                    <button onClick={context.logout}>Log out</button>
                  </li>
                </React.Fragment>
              )}
            </ul>
          </nav>
        </header>
      );
    }}
  </AuthContext.Consumer>
);

export default mainNavigation;
