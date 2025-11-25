import Navbar from "../components/navbar";
import "../App.css";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useContext } from "react";
import { AuthContext } from "react-oauth2-code-pkce";
import axios from "axios";

export default function Admin() {
  const { token, tokenData } = useContext(AuthContext);
  const [isBirthdays, setIsBirthdays] = useState(false);
  const [isUsers, setIsUsers] = useState(true);

  const [birthdayData, setBirthdayData] = useState([]);
  const [UserData, setUserData] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentEditPerson, setCurrentEditPerson] = useState(null);
  const [currentEditUser, setCurrentEditUser] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8081/api/admin/allUsers",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUserData(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchBirthdays = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8081/api/admin/allBirthdays",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log(response);
        setBirthdayData(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    if (isUsers) {
      fetchUsers();
    } else {
      fetchBirthdays();
    }
  }, [token, isBirthdays, isUsers]);

  function showBirthdays() {
    setIsEditing(false);
    setIsUsers(false);
    setIsBirthdays(true);
  }

  function showUsers() {
    setIsEditing(false);
    setIsUsers(true);
    setIsBirthdays(false);
  }

  async function handleDeleteBirthday(id) {
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

  async function handleDeleteUser(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this User?"
    );
    if (confirmed) {
      try {
        const response = await axios.delete(
          `http://localhost:8081/api/user/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUserData((prev) => prev.filter((user) => user.userId !== id));
        console.log(response);
      } catch (error) {
        console.log(error);
      }
    }
  }

  function editUser(user) {
    setIsEditing(true);
    setCurrentEditUser(user);
    reset({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    });
  }

  function editBirthday(person) {
    setIsEditing(true);
    setCurrentEditPerson(person);
    reset({
      firstName: person.firstName,
      lastName: person.lastName,
      birthDate: person.birthDate,
    });
  }

  async function handleEditBirthday(id, updatedData) {
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

  async function handleEditUser(UserId, updatedData) {
    const confirmed = window.confirm(
      "Are you sure you want to update this User?"
    );
    if (confirmed) {
      try {
        console.log(updatedData);
        const response = await axios.put(
          `http://localhost:8081/api/user/${UserId}`,
          updatedData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUserData((prev) =>
          prev.map((user) => (user.userId === UserId ? response.data : user))
        );

        setIsEditing(false);
        setCurrentEditUser(null);
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
      <div className="buttonCtn">
        {isBirthdays ? (
          ""
        ) : (
          <button className="allBirthdays" onClick={() => showBirthdays()}>
            Go To All Birthdays
          </button>
        )}
        {isUsers ? (
          ""
        ) : (
          <button className="allUsers" onClick={() => showUsers()}>
            Go To All Users
          </button>
        )}
      </div>

      {isBirthdays ? (
        <div className="adminHeader">
          {" "}
          <p>All Birthdays</p>
        </div>
      ) : (
        <div className="adminHeader">
          <p> All Users</p>
        </div>
      )}

      {isUsers && !isEditing ? (
        <div className="userContainer">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {UserData &&
                UserData.map((user) => {
                  return (
                    <tr key={user.userId}>
                      <td>{user.userId}</td>
                      <td>{user.firstName}</td>
                      <td>{user.lastName}</td>
                      <td>{user.email}</td>
                      <td>
                        {" "}
                        <img
                          src="editIcon.svg"
                          alt="edit icon"
                          id="editIcon"
                          onClick={() => editUser(user)}
                        />
                      </td>
                      <td>
                        {" "}
                        <img
                          src="deleteIcon.svg"
                          alt="delete icon"
                          id="deleteIcon"
                          onClick={() => handleDeleteUser(user.userId)}
                        />
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      ) : (
        ""
      )}

      {isBirthdays && !isEditing ? (
        <div className="birthdaysContainer">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Birth Date</th>
                <th>User Id</th>
                <th>User Name</th>
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
                      <td>{person.user.userId}</td>
                      <td>
                        {person.user.firstName} {person.user.lastName}
                      </td>
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
                          onClick={() => handleDeleteBirthday(person.id)}
                        />
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      ) : (
        ""
      )}

      {isEditing && isBirthdays && (
        <div>
          <form
            className="editBirthdayForm"
            onSubmit={handleSubmit((data) =>
              handleEditBirthday(currentEditPerson.id, data)
            )}
          >
            <h1> Edit Birthday </h1>
            <label>First Name: </label>
            <input
              {...register("firstName", {
                required: "first name is required",
              })}
            />
            {errors.firstName && <p>{errors.firstName.message}</p>}
            <label>Last Name: </label>
            <input
              {...register("lastName", { required: "Last name is required" })}
            />
            {errors.lastName && <p>{errors.lastName.message}</p>}
            <label>Birthday Date: </label>
            <input
              type="date"
              {...register("birthDate", {
                required: "Birth date is required",
                validate: (value) =>
                  new Date(value) < new Date() || "Date must be in the past",
              })}
            />
            {errors.birthDate && <p>{errors.birthDate.message}</p>}
            <button type="submit">Submit</button>
          </form>
        </div>
      )}

      {isEditing && isUsers && (
        <div>
          <form
            className="editUserForm"
            onSubmit={handleSubmit((data) =>
              handleEditUser(currentEditUser.userId, data)
            )}
          >
            <h1> Edit User </h1>
            <label>First Name: </label>
            <input
              {...register("firstName", {
                required: "first name is required",
              })}
            />
            {errors.firstName && <p>{errors.firstName.message}</p>}
            <label>Last Name: </label>
            <input
              {...register("lastName", { required: "Last name is required" })}
            />
            {errors.lastName && <p>{errors.lastName.message}</p>}
            <label>Email: </label>
            <input
              type="email"
              {...register("email", {
                required: "Email is required",
              })}
            />

            <button type="submit">Submit</button>
          </form>
        </div>
      )}
    </>
  );
}
