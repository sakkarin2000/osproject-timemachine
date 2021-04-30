import React from "react";
import '../App.css'; import {useState} from "react"; 
const Home = () => {
  const [name, setName] = useState("");
  const [age, setAge] = useState(0);
  const [country, setCountry] = useState("");
  const [position, setPosition] = useState("");
  const [wage, setWage] = useState(0);
  const displayInfo = () => {
    console.log(name + age + country + position + wage);
  };
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "Right",
        alignItems: "Right",
        height: "100vh",
      }}
    >
      <div className="App">
        {" "}
        <div className="information">
          {" "}
          <label>Name : </label>{" "}
          <input
            type="text"
            onChange={(event) => {
              setName(event.target.value);
            }}
          ></input>{" "}
          <label>Age: </label>{" "}
          <input
            type="number"
            onChange={(event) => {
              setAge(event.target.value);
            }}
          ></input>{" "}
          <label>Country : </label>{" "}
          <input
            type="text"
            onChange={(event) => {
              setCountry(event.target.value);
            }}
          ></input>{" "}
          <label>Position : </label>{" "}
          <input
            type="text"
            onChange={(event) => {
              setPosition(event.target.value);
            }}
          ></input>{" "}
          <label>Wage (year) : </label>{" "}
          <input
            type="number"
            onChange={(event) => {
              setWage(event.target.value);
            }}
          ></input>{" "}
          <button onClick={displayInfo}>Submit</button>{" "}
        </div>{" "}
      </div>
      <h1>Welcome to GeeksforGeeks</h1>
    </div>
  );
};

export default Home;
