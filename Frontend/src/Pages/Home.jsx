import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  Paper,
  Stack
} from "@mui/material";
import { Link } from "react-router-dom";

// Icons
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import LoginIcon from "@mui/icons-material/Login";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import SecurityIcon from "@mui/icons-material/Security";
import AssignmentIcon from "@mui/icons-material/Assignment";

import Navbar from "../Components/Navbar";

function Home() {
  return (
    <Box className="clean-bg" sx={{ minHeight: "100vh" }}>
      <Navbar />

      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Grid container spacing={6} alignItems="center">
          {/* Left Side: Hero Text & Features */}
          <Grid item xs={12} md={7}>
            <Typography
              variant="h3"
              fontWeight="bold"
              color="#0f172a"
              sx={{
                lineHeight: 1.2,
                fontSize: { xs: "2.4rem", md: "3.5rem" }
              }}
            >
              Healthcare <br />
              <span style={{ color: "#0284c7" }}>Management System</span>
            </Typography>

            <Typography
              variant="body1"
              sx={{
                color: "#475569",
                fontSize: "1.1rem",
                mt: 3,
                maxWidth: "540px",
                lineHeight: 1.6
              }}
            >
              A simple and easy-to-use portal for patients and doctors. Book appointments, 
              manage medical schedules, and view diagnostic test reports.
            </Typography>

            {/* Features Row */}
            <Box sx={{ mt: 5 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Box sx={{ p: 1, borderRadius: "8px", background: "rgba(2, 132, 199, 0.08)", color: "#0284c7", display: "flex" }}>
                      <CalendarMonthIcon fontSize="small" />
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="#0f172a" fontWeight="bold">Appointments</Typography>
                      <Typography variant="caption" color="#64748b">Instant booking</Typography>
                    </Box>
                  </Stack>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Box sx={{ p: 1, borderRadius: "8px", background: "rgba(2, 132, 199, 0.08)", color: "#0284c7", display: "flex" }}>
                      <SecurityIcon fontSize="small" />
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="#0f172a" fontWeight="bold">Secure Portal</Typography>
                      <Typography variant="caption" color="#64748b">Safe and private</Typography>
                    </Box>
                  </Stack>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Box sx={{ p: 1, borderRadius: "8px", background: "rgba(2, 132, 199, 0.08)", color: "#0284c7", display: "flex" }}>
                      <AssignmentIcon fontSize="small" />
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" color="#0f172a" fontWeight="bold">Lab Reports</Typography>
                      <Typography variant="caption" color="#64748b">Diagnostic history</Typography>
                    </Box>
                  </Stack>
                </Grid>
              </Grid>
            </Box>
          </Grid>

          {/* Right Side: Clean Access Card */}
          <Grid item xs={12} md={5}>
            <Paper
              elevation={3}
              sx={{
                p: { xs: 4, md: 5 },
                borderRadius: "16px",
                border: "1px solid #e2e8f0",
                backgroundColor: "#ffffff"
              }}
            >
              <Typography
                variant="h4"
                fontWeight="bold"
                color="#0f172a"
                align="center"
                mb={1}
              >
                Get Started
              </Typography>
              <Typography
                variant="body2"
                color="#64748b"
                align="center"
                mb={4}
              >
                Choose an option to log in or register
              </Typography>

              <Stack spacing={2.5}>
                <Button
                  fullWidth
                  size="large"
                  variant="contained"
                  component={Link}
                  to="/register-patient"
                  startIcon={<PersonAddIcon />}
                  sx={{
                    backgroundColor: "#0284c7",
                    py: 1.5,
                    borderRadius: "8px",
                    fontWeight: "bold",
                    textTransform: "none",
                    "&:hover": {
                      backgroundColor: "#0369a1"
                    }
                  }}
                >
                  Register as Patient
                </Button>

                <Button
                  fullWidth
                  size="large"
                  variant="outlined"
                  component={Link}
                  to="/register-doctor"
                  startIcon={<LocalHospitalIcon />}
                  sx={{
                    color: "#0284c7",
                    borderColor: "#0284c7",
                    py: 1.5,
                    borderRadius: "8px",
                    fontWeight: "bold",
                    textTransform: "none",
                    "&:hover": {
                      borderColor: "#0369a1",
                      backgroundColor: "rgba(2, 132, 199, 0.05)"
                    }
                  }}
                >
                  Register as Doctor
                </Button>

                <Box sx={{ display: "flex", alignItems: "center", py: 1 }}>
                  <Box sx={{ flex: 1, height: "1px", background: "#cbd5e1" }} />
                  <Typography variant="caption" sx={{ px: 2, color: "#94a3b8", fontWeight: "bold" }}>OR</Typography>
                  <Box sx={{ flex: 1, height: "1px", background: "#cbd5e1" }} />
                </Box>

                <Button
                  fullWidth
                  size="large"
                  variant="contained"
                  color="success"
                  component={Link}
                  to="/login"
                  startIcon={<LoginIcon />}
                  sx={{
                    py: 1.5,
                    borderRadius: "8px",
                    fontWeight: "bold",
                    textTransform: "none"
                  }}
                >
                  Login to Portal
                </Button>
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default Home;