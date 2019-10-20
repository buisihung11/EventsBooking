import React, { Component } from "react";

import Spinner from "../components/spinner/Spinner";
import EventList from "../components/events/EventList";
import Modal from "../components/modal/Modal";
import Backdrop from "../components/backdrop/Backdrop";
import AuthContext from "../context/auth-context";
import "./Event.css";

export class Event extends Component {
  state = {
    creating: false,
    events: [],
    isLoading: false,
    selectedEvent: null
  };
  static contextType = AuthContext;
  constructor(props) {
    super(props);
    this.titleElRef = React.createRef();
    this.priceElRef = React.createRef();
    this.dateElRef = React.createRef();
    this.descElRef = React.createRef();
  }

  componentDidMount() {
    this.fetchEvents();
  }

  startCreateEventHandler = () => {
    this.setState({ creating: true });
  };

  modalCancelHandler = () => {
    this.setState({ creating: false, selectedEvent: null });
  };

  modalConfirmHandler = () => {
    this.setState({ creating: false });
    const title = this.titleElRef.current.value;
    const price = +this.priceElRef.current.value;
    const date = this.dateElRef.current.value;
    const description = this.descElRef.current.value;

    if (
      title.trim().length === 0 ||
      price <= 0 ||
      date.trim().length === 0 ||
      description.trim().length === 0
    ) {
      return;
    }

    const event = { title, price, date, description };
    console.log(event);

    const requestBody = {
      query: `
      mutation {
        createEvent(eventInput: {title: "${title}" description: "${description}" price: ${price} date: "${date}"}){
          _id
          title
          description
          price
          date
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
        this.setState(prevState => {
          const updatesEvents = [...prevState.events];
          const newEvent = {
            ...res.data.createEvent,
            creator: {
              _id: this.context.userId
            }
          };
          updatesEvents.push(newEvent);
          return { events: updatesEvents };
        });
      })
      .catch(err => {
        console.log(err);
        throw err;
      });
  };

  fetchEvents = () => {
    this.setState({ isLoading: true });
    const requestBody = {
      query: `
        query {
          events {
            _id
            title
            description
            price
            date
            creator{
              _id
            }
          }
        }
      `
    };

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
        const events = res.data.events;
        this.setState({ events });
        this.setState({ isLoading: false });
      })
      .catch(err => {
        console.log(err);
        throw err;
        this.setState({ isLoading: false });
      });
  };

  viewDetailHandler = eventId => {
    this.setState(prevState => {
      const selectedEvent = prevState.events.find(e => e._id === eventId);
      return { selectedEvent: selectedEvent };
    });
  };

  bookEventHandler = () => {};

  render() {
    return (
      <React.Fragment>
        <h1>Event Pages 🌃</h1>

        {this.state.creating && (
          <React.Fragment>
            <Backdrop />
            <Modal
              title="Add envent"
              canCancel
              canConfirm
              onCancel={this.modalCancelHandler}
              onConfirm={this.modalConfirmHandler}
              confirmText="Confirm"
            >
              <form>
                <div className="form-control">
                  <label htmlFor="title">Title</label>
                  <input type="text" id="text" ref={this.titleElRef}></input>
                </div>
                <div className="form-control">
                  <label htmlFor="price">Price</label>
                  <input type="number" id="price" ref={this.priceElRef}></input>
                </div>
                <div className="form-control">
                  <label htmlFor="date">Date</label>
                  <input
                    type="datetime-local"
                    id="date"
                    ref={this.dateElRef}
                  ></input>
                </div>
                <div className="form-control">
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    rows="4"
                    ref={this.descElRef}
                  ></textarea>
                </div>
              </form>
            </Modal>
          </React.Fragment>
        )}
        {this.state.selectedEvent && (
          <React.Fragment>
            <Backdrop />
            <Modal
              title={this.state.selectedEvent.title}
              canCancel
              canConfirm
              onCancel={this.modalCancelHandler}
              onConfirm={this.bookEventHandler}
              confirmText="Book event"
            >
              <h1>{this.state.selectedEvent.title}</h1>
              <h2>
                ${this.state.selectedEvent.price} -{" "}
                {new Date(this.state.selectedEvent.date).toLocaleDateString()}
              </h2>
              <p>{this.state.selectedEvent.description}</p>
            </Modal>
          </React.Fragment>
        )}
        {this.context.token && (
          <div className="events-control">
            <p>Share your own events</p>
            <button className="btn" onClick={this.startCreateEventHandler}>
              Create Envent
            </button>
          </div>
        )}
        {this.state.isLoading ? (
          <Spinner />
        ) : (
          <EventList
            events={this.state.events}
            authUserId={this.context.userId}
            onViewDetail={this.viewDetailHandler}
          />
        )}
      </React.Fragment>
    );
  }
}

export default Event;
