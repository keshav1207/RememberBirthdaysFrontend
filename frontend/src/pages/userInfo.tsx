import { useContext, useState, useEffect } from "react";
import { User } from "../types/shared";
import { AuthContext } from "react-oauth2-code-pkce";
import api from "../services/api";
import Navbar from "../components/navbar";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Stack,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
  Backdrop,
} from "@mui/material";

export default function UserInfo() {
  const { token, tokenData, logOut } = useContext(AuthContext);
  const userId = tokenData?.sub;

  const [Information, setInformation] = useState<User>();

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);

  const [pendingEditData, setPendingEditData] = useState<any>(null);

  const [loadingInitial, setLoadingInitial] = useState(true);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [loadingEditConfirm, setLoadingEditConfirm] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const navigate = useNavigate();

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
      setLoadingInitial(true);
      try {
        const response = await api.get(`/api/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setInformation(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingInitial(false);
      }
    };

    if (token) fetchUser();
  }, [token]);

  function openDeleteConfirmDialog() {
    setOpenDeleteDialog(true);
  }

  async function handleDeleteConfirmed() {
    setLoadingDelete(true);

    try {
      await api.delete(`/api/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Your Account was deleted successfully");
      setOpenDeleteDialog(false);
      logOut();
      navigate("/");
    } catch (error) {
      toast.error("Unable to delete your account. Please Try again");
      console.error(error);
    } finally {
      setLoadingDelete(false);
    }
  }

  function submitEditForm(data: any) {
    setLoadingSubmit(true);

    setPendingEditData({
      ...data,
      userId,
      enabled: true,
    });

    setLoadingSubmit(false);
    setOpenEditDialog(true);
  }

  async function handleEditConfirmed() {
    if (!pendingEditData) return;

    setLoadingEditConfirm(true);

    try {
      const response = await api.put(`/api/user/${userId}`, pendingEditData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setInformation(response.data);
      toast.success("Your Account was edited successfully");

      setOpenEditDialog(false);
      setPendingEditData(null);
    } catch (error) {
      console.error(error);
      toast.error("Unable to edit your account. Please Try again");
    } finally {
      setLoadingEditConfirm(false);
    }
  }

  return (
    <>
      <Navbar />

      <Backdrop open={loadingInitial} sx={{ zIndex: 2000 }}>
        <CircularProgress color="inherit" />
      </Backdrop>

      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Delete Account?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete your account? This action cannot be
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
            onClick={handleDeleteConfirmed}
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
        <DialogTitle>Update Account?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to save these changes to your account?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={() => setOpenEditDialog(false)}>
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleEditConfirmed}
            disabled={loadingEditConfirm}
            startIcon={
              loadingEditConfirm ? (
                <CircularProgress size={20} color="inherit" />
              ) : null
            }
          >
            {loadingEditConfirm ? "Saving..." : "Confirm"}
          </Button>
        </DialogActions>
      </Dialog>

      {Information ? (
        <Box display="flex" justifyContent="center" mt={5}>
          <Paper elevation={4} sx={{ p: 4, width: "100%", maxWidth: 500 }}>
            <Typography variant="h5" fontWeight="bold" mb={2}>
              User Information
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <form onSubmit={handleSubmit(submitEditForm)}>
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
                    disabled={loadingSubmit}
                    startIcon={
                      loadingSubmit ? (
                        <CircularProgress size={20} color="inherit" />
                      ) : null
                    }
                  >
                    {loadingSubmit ? "Saving..." : "Update"}
                  </Button>

                  <Button
                    variant="outlined"
                    color="error"
                    fullWidth
                    onClick={openDeleteConfirmDialog}
                  >
                    Delete
                  </Button>
                </Stack>
              </Stack>
            </form>
          </Paper>
        </Box>
      ) : (
        <Typography textAlign="center" mt={5}></Typography>
      )}
    </>
  );
}
