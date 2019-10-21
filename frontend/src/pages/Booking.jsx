import React, { Component } from "react";
import AuthContext from "../context/auth-context";
import BookingList from "../components/booking/BookingList";
import Spinner from "../components/spinner/Spinner";
import BookingChart from "../components/booking/BookingChart";
import BookingControl from "../components/booking/BookingControl";

class Booking extends Component {
  state = {
    bookings: [],
    isLoading: false,
    outputType: "list"
  };
  static contextType = AuthContext;
  componentDidMount() {
    this.fetchBookings();
  }

  fetchBookings = () => {
    this.setState({ isLoading: true });
    const requestBody = {
      query: `
        query {
          bookings {
            _id
            createdAt
            event {
              title
              price
            }
            user {
              email
            }
          }
        }
      `
    };

    const token = this.context.token;
    fetch("http://localhost:8000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed!");
        }
        return res.json();
      })
      .then(res => {
        console.log(res);
        this.setState({ isLoading: false, bookings: res.data.bookings });
      })
      .catch(err => {
        console.log(err);
        throw err;
      });
  };

  cancleBookingHandler = bookingId => {
    const requestBody = {
      query: `
        mutation CancleBooking($id: ID!){
          cancelBooking(bookingId: $id){
            _id
          }
        }
      `,
      variables: {
        id: bookingId
      }
    };

    const token = this.context.token;
    fetch("http://localhost:8000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed!");
        }
        return res.json();
      })
      .then(res => {
        console.log(res);
        this.setState(prevState => {
          let updatedBooking = prevState.bookings.filter(
            booking => booking._id != bookingId
          );
          console.log(updatedBooking);
          return { bookings: updatedBooking };
        });
      })
      .catch(err => {
        console.log(err);
        throw err;
      });
  };

  changeOutputType = outputType => {
    if (outputType === "list") {
      this.setState({ outputType: "list" });
    } else {
      this.setState({ outputType: "chart" });
    }
  };

  render() {
    return (
      <div>
        <h1>Booking Pages ❤</h1>
        {this.state.isLoading ? (
          <Spinner />
        ) : (
          <div>
            <BookingControl onChangeOutput={this.changeOutputType} />
            <div>
              {this.state.outputType === "list" ? (
                <BookingList
                  bookings={this.state.bookings}
                  onCancle={this.cancleBookingHandler}
                />
              ) : (
                <BookingChart bookings={this.state.bookings} />
              )}
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default Booking;
