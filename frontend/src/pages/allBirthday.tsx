import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import Navbar from "../components/navbar";
import { useContext } from "react";
import { AuthContext } from "react-oauth2-code-pkce";
import { useForm } from "react-hook-form";

export default function AllBirthday() {
  interface User {
    userId: number;
    firstName: string;
    lastName: string;
    email: string;
  }

  interface Birthday {
    id: number;
    firstName: string;
    lastName: string;
    birthDate: string;
    user: User;
  }

  const { token, tokenData } = useContext(AuthContext);
  const [birthdayData, setBirthdayData] = useState<Birthday[]>([]);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [currentEditPerson, setCurrentEditPerson] = useState<Birthday | null>(
    null
  );

  useEffect(() => {
    const fetchBirthdays = async () => {
      try {
        const response = await axios.get("http://localhost:8081/api/people", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBirthdayData(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    if (token) {
      console.log("Token available" + token);
      fetchBirthdays();
    }
  }, [token, tokenData]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  async function handleDelete(id: number) {
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

  function editBirthday(person: Birthday) {
    setIsEditing(true);
    setCurrentEditPerson(person);
    reset({
      firstName: person.firstName,
      lastName: person.lastName,
      birthDate: person.birthDate,
    });
  }

  async function handleEdit(id: number, updatedData: Birthday) {
    const confirmed = window.confirm(
      "Are you sure you want to update this birthday?"
    );
    if (confirmed) {
      try {
        const response = await axios.put(
          `http://localhost:8081/api/people/${id}`,
          updatedData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setBirthdayData((prev) =>
          prev.map((person) => (person.id === id ? response.data : person))
        );

        setIsEditing(false);
        setCurrentEditPerson(null);
        reset();
        console.log(response);
      } catch (error) {
        console.log(error);
      }
    }
  }

  return (
    <>
      <Navbar />
      {!isEditing && (
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
                        <img
                          src="editIcon.svg"
                          alt="edit icon"
                          id="editIcon"
                          onClick={() => editBirthday(person)}
                        />
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
      )}

      {isEditing && (
        <div>
          <form
            className="editBirthdayForm"
            onSubmit={handleSubmit((data) => {
              if (!currentEditPerson) return;
              const updatedData: Birthday = {
                ...currentEditPerson,
                ...(data as Partial<Birthday>),
              };
              handleEdit(currentEditPerson.id, updatedData);
            })}
          >
            <h1> Edit Birthday </h1>
            <label>First Name: </label>
            <input
              {...register("firstName", { required: "first name is required" })}
            />
            {errors.firstName && <p>{errors.firstName.message as any}</p>}
            <label>Last Name: </label>
            <input
              {...register("lastName", { required: "Last name is required" })}
            />
            {errors.lastName && <p>{errors.lastName.message as any}</p>}
            <label>Birthday Date: </label>
            <input
              type="date"
              {...register("birthDate", {
                required: "Birth date is required",
                validate: (value) =>
                  new Date(value) < new Date() || "Date must be in the past",
              })}
            />
            {errors.birthDate && <p>{errors.birthDate.message as any}</p>}
            <button type="submit">Submit</button>
          </form>
        </div>
      )}
    </>
  );
}
