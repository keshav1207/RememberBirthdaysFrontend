import axios from "axios";
import { useEffect, useState, useContext } from "react";
import Navbar from "../components/navbar";
import { AuthContext } from "react-oauth2-code-pkce";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

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
  CircularProgress,
  Backdrop,
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

  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [pendingEditData, setPendingEditData] = useState<Birthday | null>(null);

  const [loadingInitial, setLoadingInitial] = useState(true);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [loadingSaveEdit, setLoadingSaveEdit] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  useEffect(() => {
    const fetchBirthdays = async () => {
      setLoadingInitial(true);
      try {
        const response = await axios.get("http://localhost:8081/api/people", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setBirthdayData(response.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoadingInitial(false);
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

    setLoadingDelete(true);

    try {
      await axios.delete(`http://localhost:8081/api/people/${deleteTargetId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Deleted Birthday successfully");
      setBirthdayData((prev) => prev.filter((p) => p.id !== deleteTargetId));
      setOpenDeleteDialog(false);
      setDeleteTargetId(null);
    } catch (error) {
      toast.error("Unable to delete Birthday. Please Try again");
      console.log(error);
    } finally {
      setLoadingDelete(false);
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

  function submitEditDialog(data: any) {
    if (!currentEditPerson) return;

    const updatedData: Birthday = {
      ...currentEditPerson,
      ...(data as Partial<Birthday>),
    };

    setPendingEditData(updatedData);
    setOpenEditDialog(true);
  }

  async function handleEditConfirmed() {
    if (!pendingEditData) return;

    setLoadingSaveEdit(true);

    try {
      const response = await axios.put(
        `http://localhost:8081/api/people/${pendingEditData.id}`,
        pendingEditData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Birthday Edited successfully");

      setBirthdayData((prev) =>
        prev.map((p) => (p.id === pendingEditData.id ? response.data : p))
      );

      setIsEditing(false);
      setCurrentEditPerson(null);
      reset();
      setOpenEditDialog(false);
      setPendingEditData(null);
    } catch (error) {
      toast.error("Unable to edit Birthday. Please Try again");
      console.log(error);
    } finally {
      setLoadingSaveEdit(false);
    }
  }

  return (
    <>
      <Navbar />

      <Backdrop open={loadingInitial} sx={{ zIndex: 9999 }}>
        <CircularProgress color="inherit" />
      </Backdrop>

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

          <Button
            variant="contained"
            color="error"
            onClick={handleDelete}
            disabled={loadingDelete}
            startIcon={
              loadingDelete ? (
                <CircularProgress size={20} color="inherit" />
              ) : null
            }
          >
            {loadingDelete ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Update Birthday?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to update this birthday?
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" onClick={() => setOpenEditDialog(false)}>
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleEditConfirmed}
            disabled={loadingSaveEdit}
            startIcon={
              loadingSaveEdit ? (
                <CircularProgress size={20} color="inherit" />
              ) : null
            }
          >
            {loadingSaveEdit ? "Saving..." : "Confirm"}
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
                onSubmit={handleSubmit(submitEditDialog)}
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

                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loadingSubmit}
                    startIcon={
                      loadingSubmit ? (
                        <CircularProgress size={20} color="inherit" />
                      ) : null
                    }
                  >
                    {loadingSubmit ? "Saving..." : "Submit"}
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
