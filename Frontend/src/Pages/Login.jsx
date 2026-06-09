import {
  Box,
  Button,
  Container,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

import {
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../Services/authService";
import toast from "react-hot-toast";
import Navbar from "../Components/Navbar";

function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] =
    useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
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
      const response =
        await loginUser(formData);

      const { token, role } =
        response.data;

      localStorage.setItem(
        "token",
        token
      );

      localStorage.setItem(
        "role",
        role
      );

      toast.success(
        "Login Successful"
      );

      if (
        role === "ROLE_DOCTOR"
      ) {
        navigate(
          "/doctor/dashboard"
        );
      }

      if (
        role === "ROLE_PATIENT"
      ) {
        navigate(
          "/patient/dashboard"
        );
      }

      if (
        role === "ROLE_ADMIN"
      ) {
        navigate(
          "/admin/dashboard"
        );
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Invalid Credentials"
      );
    }
  };

  return (
    <>
      <Navbar />

      <Container
        maxWidth="sm"
        sx={{ mt: 5 }}
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
            mb={3}
          >
            Login
          </Typography>

          <Box
            component="form"
            onSubmit={
              handleSubmit
            }
          >
            <TextField
              fullWidth
              label="Email"
              name="email"
              margin="normal"
              onChange={
                handleChange
              }
            />

            <TextField
              fullWidth
              label="Password"
              name="password"
              margin="normal"
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              onChange={
                handleChange
              }
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() =>
                        setShowPassword(
                          !showPassword
                        )
                      }
                    >
                      {showPassword ? (
                        <VisibilityOff />
                      ) : (
                        <Visibility />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              fullWidth
              variant="contained"
              size="large"
              sx={{ mt: 3 }}
              type="submit"
            >
              Login
            </Button>

            <Typography
              align="center"
              mt={3}
            >
              Doctor?{" "}
              <Link
                to="/register-doctor"
              >
                Register
              </Link>
            </Typography>

            <Typography
              align="center"
              mt={1}
            >
              Patient?{" "}
              <Link
                to="/register-patient"
              >
                Register
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </>
  );
}

export default Login;