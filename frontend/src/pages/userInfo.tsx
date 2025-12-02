import { useContext, useState, useEffect } from "react";
import { AuthContext } from "react-oauth2-code-pkce";
import axios from "axios";
import Navbar from "../components/navbar";
import { useForm } from "react-hook-form";

import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Stack,
  Divider,
} from "@mui/material";

export default function UserInfo() {
  interface User {
    userId: number;
    firstName: string;
    lastName: string;
    email: string;
  }

  const { token, tokenData } = useContext(AuthContext);
  const userId = tokenData?.sub;

  const [Information, setInformation] = useState<User>();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
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
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setInformation(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    if (token) fetchUser();
  }, [token]);

  async function handleDelete(userId: number) {
    const confirmed = window.confirm(
      "Are you sure you want to delete your user account?"
    );
    if (!confirmed) return;

    try {
      await axios.delete(`http://localhost:8081/api/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Your account has been deleted.");
      // You may want to log out or redirect here
    } catch (error) {
      console.error(error);
    }
  }

  const handleEdit = async (data: any) => {
    if (!window.confirm("Save changes?")) return;

    try {
      const payload = {
        ...data,
        userId,
        enabled: true,
      };

      const response = await axios.put(
        `http://localhost:8081/api/user/${userId}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setInformation(response.data);
      alert("User info updated!");
    } catch (error) {
      console.error(error);
      alert("Failed to update user info.");
    }
  };

  return (
    <>
      <Navbar />

      {Information ? (
        <Box display="flex" justifyContent="center" mt={5}>
          <Paper elevation={4} sx={{ p: 4, width: "100%", maxWidth: 500 }}>
            <Typography variant="h5" fontWeight="bold" mb={2}>
              User Information
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <form onSubmit={handleSubmit(handleEdit)}>
              <Stack spacing={3}>
                <TextField
                  label="First Name"
                  variant="outlined"
                  fullWidth
                  {...register("firstName", {
                    required: "First name is required",
                  })}
                  error={!!errors.firstName}
                  helperText={errors.firstName?.message as string}
                />

                <TextField
                  label="Last Name"
                  variant="outlined"
                  fullWidth
                  {...register("lastName", {
                    required: "Last name is required",
                  })}
                  error={!!errors.lastName}
                  helperText={errors.lastName?.message as string}
                />

                <TextField
                  label="Email"
                  variant="outlined"
                  fullWidth
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Invalid email format",
                    },
                  })}
                  error={!!errors.email}
                  helperText={errors.email?.message as string}
                />

                <Stack
                  direction="row"
                  spacing={2}
                  justifyContent="space-between"
                >
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                  >
                    Update
                  </Button>

                  <Button
                    variant="outlined"
                    color="error"
                    fullWidth
                    onClick={() => handleDelete(Number(userId))}
                  >
                    Delete
                  </Button>
                </Stack>
              </Stack>
            </form>
          </Paper>
        </Box>
      ) : (
        <Typography textAlign="center" mt={5}>
          Loading user info...
        </Typography>
      )}
    </>
  );
}
