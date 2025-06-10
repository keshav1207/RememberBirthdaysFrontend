import React from "react";
import { useState } from "react";
import axios from "axios";
export default function App() {
  const [formValues, setFormValues] = useState({
    firstName: "",
    lastName: "",
    birthDate: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  async function recordBirthday(e) {
    console.log(formValues);
    try {
      e.preventDefault();

      setFormValues({
        firstName: "",
        lastName: "",
        birthDate: "",
      });

      const response = await axios.post("http://localhost:8080/api/people", {
        firstName: formValues.firstName,
        lastName: formValues.lastName,
        birthDate: formValues.date,
      });

      console.log(response);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div>
      <form onSubmit={recordBirthday}>
        <h1> Birthday </h1>
        <label>First Name: </label>
        <input
          name="firstName"
          type="text"
          value={formValues.firstName}
          onChange={handleChange}
        />

        <label>Last Name: </label>
        <input
          name="lastName"
          type="text"
          value={formValues.lastName}
          onChange={handleChange}
        />

        <input
          name="date"
          type="date"
          value={formValues.date}
          onChange={handleChange}
        />

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
