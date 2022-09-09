import React from "react";
import { useEffect, useState } from "react";

// Suggested initial states
const initialMessage = "";
const initialEmail = "";
const initialSteps = 0;
const initialIndex = 4; // the index the "B" is at

export default function AppFunctional(props) {
  // THE FOLLOWING HELPERS ARE JUST RECOMMENDATIONS.
  // You can delete them and build your own logic from scratch.
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [initialSteps, setInitialSteps] = useState(0);
  const [initialIndex, setInitialIndex] = useState(4);
  const [initialEmail, setInitialEmail] = useState("");
  const [initialMessage, setInitialMessage] = useState("");
  const [initialCoord, setInitialCoord] = useState("2.2");

  useEffect(() => {
    getXY();
  }, [initialIndex]);

  function getXY() {
    switch (initialIndex) {
      case 0:
        setInitialCoord("1.1");
        setX(1);
        setY(1);
        break;
      case 1:
        setInitialCoord("2.1");
        setX(2);
        setY(1);
        break;
      case 2:
        setInitialCoord("3,1");
        setX(3);
        setY(1);
        break;
      case 3:
        setInitialCoord("1,2");
        setX(1);
        setY(2);
        break;
      case 4:
        setInitialCoord("2,2");
        setX(2);
        setY(2);
        break;
      case 5:
        setInitialCoord("3,2");
        setX(3);
        setY(2);
        break;
      case 6:
        setInitialCoord("1,3");
        setX(1);
        setY(3);
        break;
      case 7:
        setInitialCoord("2,3");
        setX(2);
        setY(3);
        break;
      case 8:
        setInitialCoord("3,3");
        setX(3);
        setY(3);
        break;
    }
    // It it not necessary to have a state to track the coordinates.
    // It's enough to know what index the "B" is at, to be able to calculate them.
  }

  function getXYMessage() {
    // It it not necessary to have a state to track the "Coordinates (2, 2)" message for the user.
    // You can use the `getXY` helper above to obtain the coordinates, and then `getXYMessage`
    // returns the fully constructed string.
  }

  function reset(e) {
    setInitialSteps(0);
    setInitialIndex(4);
    setInitialEmail("");
    setInitialMessage("");
    setInitialCoord("2.2");

    // Use this helper to reset all states to their initial values.
  }

  function getNextIndex(direction) {
    switch (direction) {
      case "left":
        if (initialIndex === 0 || initialIndex === 3 || initialIndex === 6) {
          setInitialMessage("You can't go left");
        } else {
          setInitialMessage("");
          setInitialIndex(initialIndex - 1);
          setInitialSteps(initialSteps + 1);
        }
        break;
      case "up":
        if (initialIndex === 0 || initialIndex === 1 || initialIndex === 2) {
          setInitialMessage("You can't go up");
        } else {
          setInitialMessage("");
          setInitialIndex(initialIndex - 3);
          setInitialSteps(initialSteps + 1);
        }
        break;
      case "right":
        if (initialIndex === 2 || initialIndex === 5 || initialIndex === 8) {
          setInitialMessage("You can't go right");
        } else {
          setInitialMessage("");
          setInitialIndex(initialIndex + 1);
          setInitialSteps(initialSteps + 1);
        }
        break;
      case "down":
        if (initialIndex === 6 || initialIndex === 7 || initialIndex === 8) {
          setInitialMessage("You can't go down");
        } else {
          setInitialMessage("");
          setInitialIndex(initialIndex + 3);
          setInitialSteps(initialSteps + 1);
        }
        break;
    }
    // This helper takes a direction ("left", "up", etc) and calculates what the next index
    // of the "B" would be. If the move is impossible because we are at the edge of the grid,
    // this helper should return the current index unchanged.
  }

  function move(e) {
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
    getNextIndex(direction);
    // This event handler can use the helper above to obtain a new index for the "B",
    // and change any states accordingly.
  }

  function onChange(evt) {
    console.log(evt.target.value);
    setInitialEmail(evt.target.value);
    // You will need this to update the value of the input.
  }

  function onSubmit(e) {
    e.preventDefault();
    const URL = "http://localhost:9000/api/result";
    fetch(URL, {
      method: "POST",
      body: JSON.stringify({
        x: x,
        y: y,
        steps: initialSteps,
        email: initialEmail,
      }),
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setInitialMessage(data.message);
      })
      .catch((err) => console.log(err));

    setInitialEmail("");
    // Use a POST request to send a payload to the server.
  }

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">Coordinates ({initialCoord})</h3>
        <h3 id="steps">
          {initialSteps === 1
            ? `You moved ${initialSteps} time`
            : `You moved ${initialSteps} times`}
        </h3>
      </div>
      <div id="grid">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((idx) => (
          <div
            key={idx}
            className={`square${idx === initialIndex ? " active" : ""}`}
          >
            {idx === initialIndex ? "B" : null}
          </div>
        ))}
      </div>
      <div className="info">
        <h3 id="message">{initialMessage}</h3>
      </div>
      <div id="keypad">
        <button id="left" onClick={move}>
          LEFT
        </button>
        <button id="up" onClick={move}>
          UP
        </button>
        <button id="right" onClick={move}>
          RIGHT
        </button>
        <button id="down" onClick={move}>
          DOWN
        </button>
        <button id="reset" onClick={reset}>
          reset
        </button>
      </div>
      <form onSubmit={onSubmit}>
        <input
          value={initialEmail}
          onChange={onChange}
          id="email"
          type="email"
          placeholder="type email"
        ></input>
        <input id="submit" type="submit"></input>
      </form>
    </div>
  );
}
