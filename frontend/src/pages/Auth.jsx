import React, { Component } from "react";

import "./Auth.css";

import AuthContext from "../context/auth-context";

export class AuthPage extends Component {
  state = {
    isLogin: true
  };
  //extract the property from the provider context
  static contextType = AuthContext;

  constructor(prop) {
    super(prop);
    this.emailEl = React.createRef();
    this.passwordEl = React.createRef();
  }

  switchModeHandler = () => {
    this.setState(preState => {
      return { isLogin: !preState.isLogin };
    });
    console.log("IsLogin: " + this.state.isLogin);
  };

  submitHandler = event => {
    event.preventDefault();
    const email = this.emailEl.current.value;
    const password = this.passwordEl.current.value;

    if (email.trim().length === "" || password.trim().length === "") {
      return;
    }

    let requestBody = {
      query: `
        query Login($email: String!,$password: String!){
          login(email: $email password: $password){
            userId
            token
            tokenExpiration
          }
        }
      `,
      variables: {
        email,
        password
      }
    };
    if (!this.state.isLogin) {
      requestBody = {
        query: `
        mutation SignUp($email : String!, $password: String!){
          createUser(userInput: {email: $email, password: $password}) {
            _id
            email
          }
        }
          `,
        variables: {
          email,
          password
        }
      };
    }

    fetch("http://localhost:8000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed!");
        }
        return res.json();
      })
      .then(res => {
        if (this.state.isLogin) {
          if (res.data.login.token) {
            this.context.login(
              res.data.login.token,
              res.data.login.userId,
              res.data.login.tokenExpiration
            );
          }
        } else {
          //If this is the sign up and when succeed we redirect to login
          if (res.data.createUser) {
            this.setState({ isLogin: true });
          }
        }
      })
      .catch(err => {
        console.log(err);
        throw err;
      });
  };
  render() {
    return (
      <form className="auth-form" onSubmit={this.submitHandler}>
        <div className="form-control">
          <label htmlFor="email">E-Mail</label>
          <input type="email" id="email" ref={this.emailEl} />
        </div>
        <div className="form-control">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" ref={this.passwordEl} />
        </div>
        <div className="form-actions">
          <button type="submit">Submit</button>
          <button type="button" onClick={this.switchModeHandler}>
            Switch to {this.state.isLogin ? "Signup" : "Login"}
          </button>
        </div>
      </form>
    );
  }
}

export default AuthPage;
