import { useEffect, useRef, useState } from "react";
import "./App.css";
import CounterValue from "./CounterValue";
import Loader from "./Loader";
import axios from "axios";

function App() {
  const [counter, setCounter] = useState(1);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const maxValue = process.env.REACT_APP_MAX_VALUE
    ? process.env.REACT_APP_MAX_VALUE
    : 1000;

  const setCounterValue = (value) => {
    setCounter(value);
    setLoading(true);

    axios
      .post(
        "https://interview-8e4c5-default-rtdb.firebaseio.com/front-end.json",
        {
          7318019088: counter,
        }
      )
      .then(function (response) {
        setLoading(false);
        console.log(response);
      })
      .catch(function (error) {
        setLoading(false);
        console.log(error);
      });
  };

  const onInputChange = (event) => {
    const target = event.nativeEvent.target;
    const value = target.value;

    if (isNaN(value) || +value > maxValue) return;

    event.nativeEvent.target.setAttribute(
      "size",
      value.length !== 0 ? value.length : 1
    );

    if (value === "") setCounterValue(0);
    else setCounterValue(value);
  };

  const onDecrement = () => {
    const currentCounter = +counter;

    if (currentCounter - 1 > maxValue) return;
    if (inputRef.current)
      inputRef.current.setAttribute(
        "size",
        (currentCounter - 1).toString().length
      );
    setCounterValue(currentCounter - 1);
  };

  const onIncrement = () => {
    const currentCounter = +counter;

    if (currentCounter + 1 > maxValue) return;
    if (inputRef.current)
      inputRef.current.setAttribute(
        "size",
        (currentCounter + 1).toString().length
      );
    setCounterValue(currentCounter + 1);
  };

  useEffect(() => {
    axios
      .get(
        "https://interview-8e4c5-default-rtdb.firebaseio.com/front-end/7318019088.json"
      )
      .then(function (response) {
        const data = response.data;

        if (data && data < maxValue) setCounter(data);
        else setCounter(1);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  return (
    <div className="screenContainer">
      <div className="container">
        {loading && (
          <div className="loaderContainer">
            <Loader />
            <span className="loaderText">Saving counter value</span>
          </div>
        )}
        <div className="counterContainer">
          <div className="minus" onClick={onDecrement}>
            -
          </div>
          <div className="counter">
            <input
              className="counterInput"
              ref={inputRef}
              value={counter}
              onChange={onInputChange}
              size="1"
            />
          </div>
          <div className="plus" onClick={onIncrement}>
            +
          </div>
        </div>
        <CounterValue value={counter} />
      </div>
    </div>
  );
}

export default App;