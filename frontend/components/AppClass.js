import React from "react";

// Suggested initial states
const initialMessage = "";
const initialEmail = "";
const initialSteps = 0;
const initialIndex = 4;
const xCoord = 2;
const yCoord = 2; // the index the "B" is at

const initialState = {
  x: xCoord,
  y: yCoord,
  message: initialMessage,
  email: initialEmail,
  index: initialIndex,
  steps: initialSteps,
};

export default class AppClass extends React.Component {
  // THE FOLLOWING HELPERS ARE JUST RECOMMENDATIONS.
  // You can delete them and build your own logic from scratch.

  state = initialState;

  componentDidUpdate(prevProps, prevState) {
    if (prevState.index != this.state.index) {
      this.getXY();
    }
  }

  getXY = () => {
    switch (this.state.index) {
      case 0:
        this.setState({ ...this.state, x: 1, y: 1 });
        break;
      case 1:
        this.setState({ ...this.state, x: 2, y: 1 });
        break;
      case 2:
        this.setState({ ...this.state, x: 3, y: 1 });
        break;
      case 3:
        this.setState({ ...this.state, x: 1, y: 2 });
        break;
      case 4:
        this.setState({ ...this.state, x: 2, y: 2 });
        break;
      case 5:
        this.setState({ ...this.state, x: 3, y: 2 });
        break;
      case 6:
        this.setState({ ...this.state, x: 1, y: 3 });
        break;
      case 7:
        this.setState({ ...this.state, x: 2, y: 3 });
        break;
      case 8:
        this.setState({ ...this.state, x: 3, y: 3 });
        break;
    }
    // It it not necessary to have a state to track the coordinates.
    // It's enough to know what index the "B" is at, to be able to calculate them.
  };

  getXYMessage = () => {
    // It it not necessary to have a state to track the "Coordinates (2, 2)" message for the user.
    // You can use the `getXY` helper above to obtain the coordinates, and then `getXYMessage`
    // returns the fully constructed string.
  };

  reset = () => {
    this.setState(initialState);
    // Use this helper to reset all states to their initial values.
  };

  getNextIndex = (direction) => {
    // This helper takes a direction ("left", "up", etc) and calculates what the next index
    // of the "B" would be. If the move is impossible because we are at the edge of the grid,
    // this helper should return the current index unchanged.
    switch (direction) {
      case "left":
        if (
          this.state.index === 0 ||
          this.state.index === 3 ||
          this.state.index === 6
        ) {
          this.setState({ ...this.state, message: "You can't go left" });
        } else {
          this.setState({
            ...this.state,
            message: "",
            index: this.state.index - 1,
            steps: this.state.steps + 1,
          });
        }
        break;
      case "up":
        if (
          this.state.index === 0 ||
          this.state.index === 1 ||
          this.state.index === 2
        ) {
          this.setState({ ...this.state, message: "You can't go up" });
        } else {
          this.setState({
            ...this.state,
            message: "",
            index: this.state.index - 3,
            steps: this.state.steps + 1,
          });
        }
        break;
      case "right":
        if (
          this.state.index === 2 ||
          this.state.index === 5 ||
          this.state.index === 8
        ) {
          this.setState({
            ...this.state,
            message: "You can't go right",
          });
        } else {
          this.setState({
            ...this.state,
            index: this.state.index + 1,
            steps: this.state.steps + 1,
          });
        }
        break;
      case "down":
        if (
          this.state.index === 6 ||
          this.state.index === 7 ||
          this.state.index === 8
        ) {
          this.setState({ ...this.state, message: "You can't go down" });
        } else {
          this.setState({
            ...this.state,
            index: this.state.index + 3,
            steps: this.state.steps + 1,
          });
        }
        break;
    }
  };

  move = (e) => {
    // This event handler can use the helper above to obtain a new index for the "B",
    // and change any states accordingly.
    let direction = "";
    switch (e.target.textContent) {
      case "LEFT":
        direction = "left";
        break;
      case "UP":
        direction = "up";
        break;
      case "RIGHT":
        direction = "right";
        break;
      case "DOWN":
        direction = "down";
        break;
    }
    this.getNextIndex(direction);
  };

  onChange = (evt) => {
    // You will need this to update the value of the input.
    evt.preventDefault();
    this.setState({ ...this.state, email: evt.target.value });
  };

  onSubmit = (evt) => {
    // Use a POST request to send a payload to the server.
    evt.preventDefault();
    const URL = "http://localhost:9000/api/result";
    fetch(URL, {
      method: "POST",
      body: JSON.stringify({
        x: this.state.x,
        y: this.state.y,
        steps: this.state.steps,
        email: this.state.email,
      }),
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        this.setState({ ...this.state, message: data.message, email: "" });
      })
      .catch((err) => console.log(err));
  };

  render() {
    const { className } = this.props;

    return (
      <div id="wrapper" className={className}>
        <div className="info">
          <h3 id="coordinates">
            Coordinates ({this.state.x},{this.state.y})
          </h3>
          <h3 id="steps">
            {this.state.steps === 1
              ? `You moved ${this.state.steps} time`
              : `You moved ${this.state.steps} times`}
          </h3>
        </div>
        <div id="grid">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((idx) => (
            <div
              key={idx}
              className={`square${idx === this.state.index ? " active" : ""}`}
            >
              {idx === this.state.index ? "B" : null}
            </div>
          ))}
        </div>
        <div className="info">
          <h3 id="message">{this.state.message}</h3>
        </div>
        <div id="keypad">
          <button id="left" onClick={this.move}>
            LEFT
          </button>
          <button id="up" onClick={this.move}>
            UP
          </button>
          <button id="right" onClick={this.move}>
            RIGHT
          </button>
          <button id="down" onClick={this.move}>
            DOWN
          </button>
          <button id="reset" onClick={this.reset}>
            reset
          </button>
        </div>
        <form onSubmit={this.onSubmit}>
          <input
            id="email"
            value={this.state.email}
            onChange={this.onChange}
            type="email"
            placeholder="type email"
          ></input>
          <input id="submit" type="submit"></input>
        </form>
      </div>
    );
  }
}
