import Navbar from "../components/navbar";
import { useEffect, useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { AuthContext } from "react-oauth2-code-pkce";
import axios from "axios";

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

export default function Admin() {
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

  const [isBirthdays, setIsBirthdays] = useState(false);
  const [isUsers, setIsUsers] = useState(true);

  const [birthdayData, setBirthdayData] = useState<Birthday[]>([]);
  const [userData, setUserData] = useState<User[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentEditPerson, setCurrentEditPerson] = useState<Birthday | null>(
    null
  );
  const [currentEditUser, setCurrentEditUser] = useState<User | null>(null);

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [deleteType, setDeleteType] = useState<"user" | "birthday" | null>(
    null
  );

  const {
    register: registerBirthday,
    handleSubmit: handleSubmitBirthday,
    reset: resetBirthday,
    formState: { errors: birthdayErrors },
  } = useForm<Partial<Birthday>>();

  const {
    register: registerUser,
    handleSubmit: handleSubmitUser,
    reset: resetUser,
    formState: { errors: userErrors },
  } = useForm<Partial<User>>();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8081/api/admin/allUsers",
          {
            headers: { Authorization: `Bearer ${token}` },
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
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setBirthdayData(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    if (isUsers) fetchUsers();
    else fetchBirthdays();
  }, [token, isUsers, isBirthdays]);

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

  function confirmDelete(id: number, type: "user" | "birthday") {
    setDeleteTargetId(id);
    setDeleteType(type);
    setOpenDeleteDialog(true);
  }

  async function handleDelete() {
    if (deleteTargetId == null || deleteType == null) return;

    try {
      if (deleteType === "user") {
        await axios.delete(`http://localhost:8081/api/user/${deleteTargetId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData((prev) => prev.filter((u) => u.userId !== deleteTargetId));
      } else {
        await axios.delete(
          `http://localhost:8081/api/people/${deleteTargetId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setBirthdayData((prev) => prev.filter((p) => p.id !== deleteTargetId));
      }
      setOpenDeleteDialog(false);
      setDeleteTargetId(null);
      setDeleteType(null);
    } catch (error) {
      console.log(error);
    }
  }

  function editUser(user: User) {
    setIsEditing(true);
    setCurrentEditUser(user);
    resetUser({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    });
  }

  function editBirthday(person: Birthday) {
    setIsEditing(true);
    setCurrentEditPerson(person);
    resetBirthday({
      firstName: person.firstName,
      lastName: person.lastName,
      birthDate: person.birthDate,
    });
  }

  async function handleEditUser(userId: number, updatedData: User) {
    try {
      const response = await axios.put(
        `http://localhost:8081/api/user/${userId}`,
        updatedData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUserData((prev) =>
        prev.map((u) => (u.userId === userId ? response.data : u))
      );
      setIsEditing(false);
      setCurrentEditUser(null);
      resetUser();
    } catch (error) {
      console.log(error);
    }
  }

  async function handleEditBirthday(id: number, updatedData: Birthday) {
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
      resetBirthday();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <Navbar />

      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this{" "}
            {deleteType === "user" ? "user" : "birthday"}? This action cannot be
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

      <Box sx={{ display: "flex", gap: 2, m: 2 }}>
        {!isBirthdays && (
          <Button variant="contained" onClick={showBirthdays}>
            Go To All Birthdays
          </Button>
        )}
        {!isUsers && (
          <Button variant="contained" onClick={showUsers}>
            Go To All Users
          </Button>
        )}
      </Box>

      {isBirthdays ? (
        <Typography variant="h4" align="center" sx={{ mt: 3, mb: 2 }}>
          All Birthdays
        </Typography>
      ) : (
        <Typography variant="h4" align="center" sx={{ mt: 3, mb: 2 }}>
          All Users
        </Typography>
      )}

      {isUsers && !isEditing && (
        <Container maxWidth="lg" sx={{ mb: 4 }}>
          <Paper elevation={3}>
            <Table>
              <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>First Name</TableCell>
                  <TableCell>Last Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {userData.map((user) => (
                  <TableRow key={user.userId}>
                    <TableCell>{user.userId}</TableCell>
                    <TableCell>{user.firstName}</TableCell>
                    <TableCell>{user.lastName}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => editUser(user)}>
                        <EditIcon color="primary" />
                      </IconButton>
                    </TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => confirmDelete(user.userId, "user")}
                      >
                        <DeleteIcon color="error" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Container>
      )}

      {isBirthdays && !isEditing && (
        <Container maxWidth="lg" sx={{ mb: 4 }}>
          <Paper elevation={3}>
            <Table>
              <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>First Name</TableCell>
                  <TableCell>Last Name</TableCell>
                  <TableCell>Birth Date</TableCell>
                  <TableCell>User Id</TableCell>
                  <TableCell>User Name</TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {birthdayData.map((person) => (
                  <TableRow key={person.id}>
                    <TableCell>{person.id}</TableCell>
                    <TableCell>{person.firstName}</TableCell>
                    <TableCell>{person.lastName}</TableCell>
                    <TableCell>{person.birthDate}</TableCell>
                    <TableCell>{person.user.userId}</TableCell>
                    <TableCell>
                      {person.user.firstName} {person.user.lastName}
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={() => editBirthday(person)}>
                        <EditIcon color="primary" />
                      </IconButton>
                    </TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => confirmDelete(person.id, "birthday")}
                      >
                        <DeleteIcon color="error" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Container>
      )}

      {isEditing && isBirthdays && currentEditPerson && (
        <Container maxWidth="sm" sx={{ mt: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Edit Birthday
              </Typography>
              <Box
                component="form"
                onSubmit={handleSubmitBirthday((data) => {
                  const updatedData: Birthday = {
                    ...currentEditPerson,
                    ...(data as Partial<Birthday>),
                  };
                  handleEditBirthday(currentEditPerson.id, updatedData);
                })}
                sx={{ display: "flex", flexDirection: "column", gap: 2 }}
              >
                <TextField
                  label="First Name"
                  {...registerBirthday("firstName", { required: true })}
                  error={!!birthdayErrors.firstName}
                  helperText={birthdayErrors.firstName?.message as string}
                />
                <TextField
                  label="Last Name"
                  {...registerBirthday("lastName", { required: true })}
                  error={!!birthdayErrors.lastName}
                  helperText={birthdayErrors.lastName?.message as string}
                />
                <TextField
                  type="date"
                  label="Birth Date"
                  InputLabelProps={{ shrink: true }}
                  {...registerBirthday("birthDate", {
                    required: "Birth date is required",
                    validate: (value) =>
                      value && new Date(value) < new Date()
                        ? true
                        : "Date must be in the past",
                  })}
                  error={!!birthdayErrors.birthDate}
                  helperText={birthdayErrors.birthDate?.message as string}
                />
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Button type="submit" variant="contained">
                    Submit
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => {
                      setIsEditing(false);
                      setCurrentEditPerson(null);
                      resetBirthday();
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

      {isEditing && isUsers && currentEditUser && (
        <Container maxWidth="sm" sx={{ mt: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Edit User
              </Typography>
              <Box
                component="form"
                onSubmit={handleSubmitUser((data) => {
                  const updatedUser: User = {
                    ...currentEditUser,
                    ...(data as Partial<User>),
                  };
                  handleEditUser(currentEditUser.userId, updatedUser);
                })}
                sx={{ display: "flex", flexDirection: "column", gap: 2 }}
              >
                <TextField
                  label="First Name"
                  {...registerUser("firstName", { required: true })}
                  error={!!userErrors.firstName}
                  helperText={userErrors.firstName?.message as string}
                />
                <TextField
                  label="Last Name"
                  {...registerUser("lastName", { required: true })}
                  error={!!userErrors.lastName}
                  helperText={userErrors.lastName?.message as string}
                />
                <TextField
                  label="Email"
                  type="email"
                  {...registerUser("email", { required: true })}
                  error={!!userErrors.email}
                  helperText={userErrors.email?.message as string}
                />
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Button type="submit" variant="contained">
                    Submit
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => {
                      setIsEditing(false);
                      setCurrentEditUser(null);
                      resetUser();
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
