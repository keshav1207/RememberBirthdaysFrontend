import { useForm } from "react-hook-form";
import axios from "axios";
import Navbar from "../components/navbar";
import { useContext, useState } from "react";
import { AuthContext } from "react-oauth2-code-pkce";
import { toast } from "react-toastify";

import {
  Container,
  Card,
  CardContent,
  Typography,
  TextField,
  Box,
  Button,
  CircularProgress,
} from "@mui/material";

export default function AddBirthday() {
  const { token } = useContext(AuthContext);

  const [loading, setLoading] = useState(false);

  interface BirthdayFormData {
    firstName: string;
    lastName: string;
    birthDate: string;
  }

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BirthdayFormData>();

  async function recordBirthday(values: BirthdayFormData) {
    setLoading(true);
    try {
      await axios.post(
        "http://localhost:8081/api/people",
        {
          firstName: values.firstName,
          lastName: values.lastName,
          birthDate: values.birthDate,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Added Birthday successfully");
      reset();
    } catch (error) {
      toast.error("Unable to add Birthday. Please Try again");
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar />

      <Container maxWidth="sm" sx={{ mt: 5 }}>
        <Card elevation={4}>
          <CardContent>
            <Typography variant="h4" gutterBottom>
              Add Birthday
            </Typography>

            <Box
              component="form"
              onSubmit={handleSubmit(recordBirthday)}
              sx={{ display: "flex", flexDirection: "column", gap: 2 }}
            >
              <TextField
                label="First Name"
                {...register("firstName", {
                  required: "First name is required",
                })}
                error={!!errors.firstName}
                helperText={errors.firstName?.message}
              />

              <TextField
                label="Last Name"
                {...register("lastName", { required: "Last name is required" })}
                error={!!errors.lastName}
                helperText={errors.lastName?.message}
              />

              <TextField
                type="date"
                label="Birth Date"
                InputLabelProps={{ shrink: true }}
                {...register("birthDate", {
                  required: "Birth date is required",
                  validate: (value) =>
                    new Date(value) < new Date() || "Date must be in the past",
                })}
                error={!!errors.birthDate}
                helperText={errors.birthDate?.message}
              />

              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                startIcon={
                  loading ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : null
                }
              >
                {loading ? "Submitting..." : "Submit"}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </>
  );
}
