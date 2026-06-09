import {
  Box,
  Button,
  Container,
  Grid,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import Navbar from "../Components/Navbar";
import { registerDoctor } from "../Services/authService";

function DoctorRegister() {
  const navigate = useNavigate();

  const [formData, setFormData] =
    useState({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      phone: "",
      dob: "",

      qualifications: "",
      speciality: "",
      experienceInYears: "",
      appointmentTime: "",
      fees: "",
    });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await registerDoctor(
        formData
      );

      toast.success(
        "Doctor Registered Successfully"
      );

      navigate("/login");
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Registration Failed"
      );
    }
  };

  return (
    <>
      <Navbar />

      <Container
        maxWidth="md"
        sx={{ mt: 4 }}
      >
        <Paper
          elevation={8}
          sx={{
            p: 4,
            borderRadius: 4,
          }}
        >
          <Typography
            variant="h4"
            align="center"
            mb={4}
          >
            Doctor Registration
          </Typography>

          <Box
            component="form"
            onSubmit={
              handleSubmit
            }
          >
            <Grid
              container
              spacing={2}
            >
              <Grid
                item
                xs={12}
                md={6}
              >
                <TextField
                  fullWidth
                  label="First Name"
                  name="firstName"
                  onChange={
                    handleChange
                  }
                />
              </Grid>

              <Grid
                item
                xs={12}
                md={6}
              >
                <TextField
                  fullWidth
                  label="Last Name"
                  name="lastName"
                  onChange={
                    handleChange
                  }
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  onChange={
                    handleChange
                  }
                />
              </Grid>

              <Grid
                item
                xs={12}
                md={6}
              >
                <TextField
                  fullWidth
                  type="password"
                  label="Password"
                  name="password"
                  onChange={
                    handleChange
                  }
                />
              </Grid>

              <Grid
                item
                xs={12}
                md={6}
              >
                <TextField
                  fullWidth
                  label="Phone"
                  name="phone"
                  onChange={
                    handleChange
                  }
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="date"
                  name="dob"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  onChange={
                    handleChange
                  }
                />
              </Grid>

              <Grid item xs={12}>
                <Typography
                  variant="h6"
                >
                  Professional
                  Details
                </Typography>
              </Grid>

              <Grid
                item
                xs={12}
                md={6}
              >
                <TextField
                  fullWidth
                  label="Qualification"
                  name="qualifications"
                  onChange={
                    handleChange
                  }
                />
              </Grid>

              <Grid
                item
                xs={12}
                md={6}
              >
                <TextField
                  select
                  fullWidth
                  label="Speciality"
                  name="speciality"
                  onChange={
                    handleChange
                  }
                >
                  <MenuItem value="CARDIOLOGY">
                    Cardiology
                  </MenuItem>

                  <MenuItem value="NEUROLOGY">
                    Neurology
                  </MenuItem>

                  <MenuItem value="ORTHOPEDICS">
                    Orthopedics
                  </MenuItem>

                  <MenuItem value="PEDIATRICS">
                    Pediatrics
                  </MenuItem>

                  <MenuItem value="DERMATOLOGY">
                    Dermatology
                  </MenuItem>
                </TextField>
              </Grid>

              <Grid
                item
                xs={12}
                md={4}
              >
                <TextField
                  fullWidth
                  label="Experience"
                  name="experienceInYears"
                  type="number"
                  onChange={
                    handleChange
                  }
                />
              </Grid>

              <Grid
                item
                xs={12}
                md={4}
              >
                <TextField
                  fullWidth
                  label="Appointment Time"
                  name="appointmentTime"
                  type="number"
                  onChange={
                    handleChange
                  }
                />
              </Grid>

              <Grid
                item
                xs={12}
                md={4}
              >
                <TextField
                  fullWidth
                  label="Consultation Fees"
                  name="fees"
                  type="number"
                  onChange={
                    handleChange
                  }
                />
              </Grid>

              <Grid item xs={12}>
                <Button
                  fullWidth
                  size="large"
                  variant="contained"
                  type="submit"
                >
                  Register Doctor
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Container>
    </>
  );
}

export default DoctorRegister;