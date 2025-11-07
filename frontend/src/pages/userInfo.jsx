import { useContext, useState } from "react";
import { AuthContext } from "react-oauth2-code-pkce";
import { useEffect } from "react";
import axios from "axios";
import Navbar from "../components/navbar";
import { useForm } from "react-hook-form";

export default function UserInfo() {
  const { token, tokenData } = useContext(AuthContext);
  const userId = tokenData?.sub;
  const [Information, setInformation] = useState();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  useEffect(() => {
    if (Information) {
      reset({
        firstName: Information.firstName,
        lastName: Information.lastName,
        email: Information.email,
      });
    }
  }, [Information, reset]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8081/api/user/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setInformation(response.data);
        console.log(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    if (token) {
      fetchUser();
    }
  }, [token]);

  async function handleDelete(userId) {
    const confirmed = window.confirm(
      "Are you sure you want to delete your user account?"
    );
    if (confirmed) {
      try {
        const response = await axios.delete(
          `http://localhost:8081/api/user/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log(response);
      } catch (error) {
        console.log(error);
      }
    }
  }

  const handleEdit = async (data) => {
    if (window.confirm("Are you sure you want to save changes?")) {
      try {
        const payload = {
          ...data,
          userId: userId,
          enabled: true,
        };
        console.log(data);
        const response = await axios.put(
          `http://localhost:8081/api/user/${userId}`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setInformation(response.data);
        alert("User info updated successfully!");
      } catch (error) {
        console.error(error);
        alert("Failed to update user info.");
      }
    }
  };
  return (
    <>
      <Navbar />
      {Information ? (
        <form className="user-form">
          <h1>User Information</h1>

          <div className="form-group">
            <label>First Name</label>
            <input
              type="text"
              {...register("firstName", { required: "First name is required" })}
            />
            {errors.firstName && (
              <span className="error">{errors.firstName.message}</span>
            )}
          </div>

          <div className="form-group">
            <label>Last Name</label>
            <input
              type="text"
              {...register("lastName", { required: "Last name is required" })}
            />
            {errors.lastName && (
              <span className="error">{errors.lastName.message}</span>
            )}
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid email format",
                },
              })}
            />
            {errors.email && (
              <span className="error">{errors.email.message}</span>
            )}
          </div>

          <div className="userActions">
            <button type="button" onClick={handleSubmit(handleEdit)}>
              Update
            </button>

            <button onClick={() => handleDelete(userId)}>Delete</button>
          </div>
        </form>
      ) : (
        <p>Loading user info...</p>
      )}
    </>
  );
}
