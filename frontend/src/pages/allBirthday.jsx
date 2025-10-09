import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import Navbar from "../components/navbar";
import { useContext } from "react";
import { AuthContext } from "react-oauth2-code-pkce";

export default function AllBirthday() {
  const { token, tokenData, logIn, logOut, isAuthenticated } =
    useContext(AuthContext);

  const [birthdayData, setBirthdayData] = useState();
  useEffect(() => {
    const fetchBirthdays = async () => {
      try {
        const response = await axios.get("http://localhost:8081/api/people", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response);
        setBirthdayData(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    if (token) {
      console.log("Token available" + token);
      fetchBirthdays();
    }
  }, [token]);

  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this birthday?"
    );
    if (confirmed) {
      try {
        const response = await axios.delete(
          `http://localhost:8081/api/people/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setBirthdayData((prev) => prev.filter((person) => person.id !== id));
        console.log(response);
      } catch (error) {
        console.log(error);
      }
    }
  }

  return (
    <>
      <Navbar />
      <div className="birthdaysContainer">
        <h1>All Birthdays</h1>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Birth Date</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {birthdayData &&
              birthdayData.map((person) => {
                return (
                  <tr key={person.id}>
                    <td>{person.id}</td>
                    <td>{person.firstName}</td>
                    <td>{person.lastName}</td>
                    <td>{person.birthDate}</td>
                    <td>
                      {" "}
                      <img src="editIcon.svg" alt="edit icon" id="editIcon" />
                    </td>
                    <td>
                      {" "}
                      <img
                        src="deleteIcon.svg"
                        alt="delete icon"
                        id="deleteIcon"
                        onClick={() => handleDelete(person.id)}
                      />
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </>
  );
}
