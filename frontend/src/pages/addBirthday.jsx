import "../App.css";
import { useForm } from "react-hook-form";
import axios from "axios";
import Navbar from "../components/navbar";
import { useContext } from "react";
import { AuthContext } from "react-oauth2-code-pkce";
export default function AddBirthday() {
  const { token, tokenData } = useContext(AuthContext);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  async function recordBirthday(values) {
    console.log(values);
    try {
      const response = await axios.post(
        "http://localhost:8081/api/people",
        {
          firstName: values.firstName,
          lastName: values.lastName,
          birthDate: values.birthDate,
        },

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      reset();

      console.log(response);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <Navbar />
      <div>
        <form
          className="addBirthdayForm"
          onSubmit={handleSubmit(recordBirthday)}
        >
          <h1> Add Birthday </h1>
          <label>First Name: </label>
          <input
            {...register("firstName", { required: "First name is required" })}
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
    </>
  );
}
