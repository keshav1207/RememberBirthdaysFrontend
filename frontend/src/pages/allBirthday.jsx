import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";

export default function AllBirthday() {
  const [birthdayData, setBirthdayData] = useState();
  useEffect(() => {
    const fetchBirthdays = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/people");
        console.log(response);
        setBirthdayData(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchBirthdays();
  }, []);

  return (
    <>
      <div className="birthdaysContainer">
        <h1>All Birthdays</h1>;
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Birth Date</th>
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
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </>
  );
}
