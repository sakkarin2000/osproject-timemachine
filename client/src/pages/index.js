import React from "react";
import '../App.css'; import { useState } from "react";
import Axios from 'axios';

const Home = () => {
  const [name, setName] = useState("");
  const [age, setAge] = useState(0);
  const [country, setCountry] = useState("");
  const [position, setPosition] = useState("");
  const [wage, setWage] = useState(0);
  // const displayInfo = () => {
  //   console.log(name + age + country + position + wage);
  // };
 
  


  const addEmployee = () => {
    Axios.post('http://localhost:3001/create', {  
        name: name,
        age: age, 
        country: country,
        position:position,
        wage:wage
      }).then(() => {console.log("success");});
  }
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
        
        <div className="information">
          
          <label>Name : </label>
          <input
            type="text"
            onChange={(event) => {
              setName(event.target.value);
            }}
          ></input>
          <label>Age: </label>
          <input
            type="number"
            onChange={(event) => {
              setAge(event.target.value);
            }}
          ></input>
          <label>Country : </label>
          <input
            type="text"
            onChange={(event) => {
              setCountry(event.target.value);
            }}
          ></input>
          <label>Position : </label>
          <input
            type="text"
            onChange={(event) => {
              setPosition(event.target.value);
            }}
          ></input>
          <label>Wage (year) : </label>
          <input
            type="number"
            onChange={(event) => {
              setWage(event.target.value);
            }}
          ></input>
          <button onClick={addEmployee}>Submit</button>
        </div>
        <button className="information">Show Employees</button>
      </div>
      
    </div>
  );
};

export default Home;
