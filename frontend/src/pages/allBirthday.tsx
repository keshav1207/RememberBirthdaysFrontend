import axios from "axios";
import { useEffect, useState, useContext } from "react";
import Navbar from "../components/navbar";
import { AuthContext } from "react-oauth2-code-pkce";
import { useForm } from "react-hook-form";

import {
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  IconButton,
  Paper,
  TextField,
  Button,
  Container,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

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

  const { token } = useContext(AuthContext);

  const [birthdayData, setBirthdayData] = useState<Birthday[]>([]);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [currentEditPerson, setCurrentEditPerson] = useState<Birthday | null>(
    null
  );

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

  useEffect(() => {
    const fetchBirthdays = async () => {
      try {
        const response = await axios.get("http://localhost:8081/api/people", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBirthdayData(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    if (token) fetchBirthdays();
  }, [token]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  function confirmDelete(id: number) {
    setDeleteTargetId(id);
    setOpenDeleteDialog(true);
  }

  async function handleDelete() {
    if (deleteTargetId == null) return;
    try {
      await axios.delete(`http://localhost:8081/api/people/${deleteTargetId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setBirthdayData((prev) => prev.filter((p) => p.id !== deleteTargetId));
      setOpenDeleteDialog(false);
      setDeleteTargetId(null);
    } catch (error) {
      console.log(error);
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
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setBirthdayData((prev) =>
          prev.map((p) => (p.id === id ? response.data : p))
        );

        setIsEditing(false);
        setCurrentEditPerson(null);
        reset();
      } catch (error) {
        console.log(error);
      }
    }
  }

  return (
    <>
      <Navbar />

      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Delete Birthday?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this birthday? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={() => setOpenDeleteDialog(false)}>
            Cancel
          </Button>
          <Button variant="contained" color="error" onClick={handleDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {!isEditing && (
        <Container maxWidth="md" sx={{ mt: 5 }}>
          <Typography variant="h4" gutterBottom>
            All Birthdays
          </Typography>

          <Paper elevation={3}>
            <Table>
              <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>First Name</TableCell>
                  <TableCell>Last Name</TableCell>
                  <TableCell>Birth Date</TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {birthdayData?.map((person) => (
                  <TableRow key={person.id}>
                    <TableCell>{person.id}</TableCell>
                    <TableCell>{person.firstName}</TableCell>
                    <TableCell>{person.lastName}</TableCell>
                    <TableCell>{person.birthDate}</TableCell>

                    <TableCell>
                      <IconButton
                        color="primary"
                        onClick={() => editBirthday(person)}
                      >
                        <EditIcon />
                      </IconButton>
                    </TableCell>

                    <TableCell>
                      <IconButton
                        color="error"
                        onClick={() => confirmDelete(person.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Container>
      )}

      {isEditing && (
        <Container maxWidth="sm" sx={{ mt: 5 }}>
          <Card elevation={4}>
            <CardContent>
              <Typography variant="h4" gutterBottom>
                Edit Birthday
              </Typography>

              <Box
                component="form"
                onSubmit={handleSubmit((data) => {
                  if (!currentEditPerson) return;
                  const updatedData: Birthday = {
                    ...currentEditPerson,
                    ...(data as Partial<Birthday>),
                  };
                  handleEdit(currentEditPerson.id, updatedData);
                })}
                sx={{ display: "flex", flexDirection: "column", gap: 2 }}
              >
                <TextField
                  label="First Name"
                  {...register("firstName", {
                    required: "First name is required",
                  })}
                  error={!!errors.firstName}
                  helperText={errors.firstName?.message as string}
                />

                <TextField
                  label="Last Name"
                  {...register("lastName", {
                    required: "Last name is required",
                  })}
                  error={!!errors.lastName}
                  helperText={errors.lastName?.message as string}
                />

                <TextField
                  type="date"
                  label="Birth Date"
                  InputLabelProps={{ shrink: true }}
                  {...register("birthDate", {
                    required: "Birth date is required",
                    validate: (value) =>
                      new Date(value) < new Date() ||
                      "Date must be in the past",
                  })}
                  error={!!errors.birthDate}
                  helperText={errors.birthDate?.message as string}
                />

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mt: 2,
                  }}
                >
                  <Button type="submit" variant="contained">
                    Submit
                  </Button>

                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => {
                      setIsEditing(false);
                      setCurrentEditPerson(null);
                      reset();
                    }}
                  >
                    Cancel
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Container>
      )}
    </>
  );
}
