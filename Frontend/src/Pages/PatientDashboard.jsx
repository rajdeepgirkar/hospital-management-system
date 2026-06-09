import React, { useState, useEffect } from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Grid,
  MenuItem,
  Paper,
  TextField,
  Typography,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

// Icons
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import HistoryIcon from "@mui/icons-material/History";
import ScienceIcon from "@mui/icons-material/Science";
import PersonIcon from "@mui/icons-material/Person";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import InfoIcon from "@mui/icons-material/Info";

import PatientSidebar from "../Components/PatientSidebar";
import {
  getPatientProfile,
  updatePatientProfile,
  getSpecialities,
  getDoctors,
  bookAppointment,
  getAppointments,
  cancelAppointment,
  getPrescribedTests,
} from "../Services/patientService";

const MotionCard = motion(Card);

function PatientDashboard() {
  const [currentTab, setCurrentTab] = useState(() => {
    return localStorage.getItem("patient_active_tab") || "overview";
  });
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem("patient_profile");
    return saved ? JSON.parse(saved) : null;
  });
  const [appointments, setAppointments] = useState(() => {
    const saved = localStorage.getItem("patient_appointments");
    return saved ? JSON.parse(saved) : [];
  });
  const [tests, setTests] = useState(() => {
    const saved = localStorage.getItem("patient_tests");
    return saved ? JSON.parse(saved) : [];
  });
  const [specialities, setSpecialities] = useState(() => {
    const saved = localStorage.getItem("patient_specialities");
    return saved ? JSON.parse(saved) : [];
  });
  const [doctors, setDoctors] = useState([]);

  // Filters & State variables
  const [selectedSpeciality, setSelectedSpeciality] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [bookingDateTime, setBookingDateTime] = useState("");
  const [testSearch, setTestSearch] = useState("");
  const [loading, setLoading] = useState(() => {
    return !(localStorage.getItem("patient_profile") && localStorage.getItem("patient_appointments"));
  });
  const [isEditMode, setIsEditMode] = useState(false);

  // Profile Form state
  const [profileForm, setProfileForm] = useState(() => {
    const saved = localStorage.getItem("patient_profile");
    const parsed = saved ? JSON.parse(saved) : null;
    return {
      firstName: parsed?.firstName || "",
      lastName: parsed?.lastName || "",
      phone: parsed?.phone || "",
      dob: parsed?.dob || "",
      bloodGroup: parsed?.bloodGroup || "",
      gender: parsed?.gender || "",
      familyHistory: parsed?.familyHistory || "",
    };
  });

  // Sync active tab to localStorage
  useEffect(() => {
    localStorage.setItem("patient_active_tab", currentTab);
  }, [currentTab]);

  // Load essential dashboard details
  useEffect(() => {
    fetchInitialData();
  }, []);

  // Fetch doctors when speciality filter changes
  useEffect(() => {
    fetchDoctorsData();
  }, [selectedSpeciality]);

  const fetchInitialData = async () => {
    const hasCache = localStorage.getItem("patient_profile") && localStorage.getItem("patient_appointments");
    if (!hasCache) {
      setLoading(true);
    }
    try {
      const profileRes = await getPatientProfile();
      setProfile(profileRes.data);
      localStorage.setItem("patient_profile", JSON.stringify(profileRes.data));
      setProfileForm({
        firstName: profileRes.data.firstName || "",
        lastName: profileRes.data.lastName || "",
        phone: profileRes.data.phone || "",
        dob: profileRes.data.dob || "",
        bloodGroup: profileRes.data.bloodGroup || "",
        gender: profileRes.data.gender || "",
        familyHistory: profileRes.data.familyHistory || "",
      });

      // Fetch appointments & tests
      const [apptRes, testsRes, specRes] = await Promise.all([
        getAppointments(),
        getPrescribedTests(),
        getSpecialities(),
      ]);

      setAppointments(apptRes.data);
      setTests(testsRes.data);
      setSpecialities(specRes.data);
      localStorage.setItem("patient_appointments", JSON.stringify(apptRes.data));
      localStorage.setItem("patient_tests", JSON.stringify(testsRes.data));
      localStorage.setItem("patient_specialities", JSON.stringify(specRes.data));
    } catch (error) {
      console.error("Error fetching patient dashboard data:", error);
      toast.error("Failed to load dashboard data. Please make sure you are logged in.");
    } finally {
      setLoading(false);
    }
  };

  const fetchDoctorsData = async () => {
    try {
      const docRes = await getDoctors(selectedSpeciality);
      setDoctors(docRes.data);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };

  const refreshAppointments = async () => {
    try {
      const apptRes = await getAppointments();
      setAppointments(apptRes.data);
      localStorage.setItem("patient_appointments", JSON.stringify(apptRes.data));
    } catch (error) {
      console.error("Error refreshing appointments:", error);
    }
  };

  // Profile Update submit
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      await updatePatientProfile(profileForm);
      toast.success("Profile updated successfully!");
      setIsEditMode(false);
      // Refresh profile data
      const profileRes = await getPatientProfile();
      setProfile(profileRes.data);
      localStorage.setItem("patient_profile", JSON.stringify(profileRes.data));
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error.response?.data?.message || "Failed to update profile.");
    }
  };

  // Appointment Booking submit
  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDoctor) {
      toast.error("Please select a doctor.");
      return;
    }
    if (!bookingDateTime) {
      toast.error("Please select date and time.");
      return;
    }

    // Format local time to standard ISO LocalDateTime for Spring Boot
    const localDateTime = new Date(bookingDateTime);
    if (localDateTime <= new Date()) {
      toast.error("Appointment must be scheduled for a future time.");
      return;
    }

    try {
      const formattedDateTime = bookingDateTime.replace(" ", "T");
      await bookAppointment({
        doctorId: selectedDoctor.id,
        startDateTime: formattedDateTime,
      });

      toast.success("Appointment booked successfully!");
      setSelectedDoctor(null);
      setBookingDateTime("");
      refreshAppointments();
      // Switch back to "My Appointments"
      const tabLink = document.getElementById("my-appointments-btn");
      if (tabLink) tabLink.click();
    } catch (error) {
      console.error("Error booking appointment:", error);
      toast.error(error.response?.data?.message || "Failed to book appointment.");
    }
  };

  // Appointment Cancellation submit
  const handleCancelAppointment = async (apptId) => {
    if (window.confirm("Are you sure you want to cancel this appointment?")) {
      try {
        await cancelAppointment(apptId);
        toast.success("Appointment cancelled successfully!");
        refreshAppointments();
      } catch (error) {
        console.error("Error cancelling appointment:", error);
        toast.error(error.response?.data?.message || "Failed to cancel appointment.");
      }
    }
  };

  // Helper: Format Date strings
  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return "";
    const date = new Date(dateTimeString);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getNextAppointment = () => {
    const upcoming = appointments.filter(
      (app) => app.status === "SCHEDULED" && new Date(app.startDateTime) > new Date()
    );
    if (upcoming.length === 0) return null;
    // Sort ascending by time
    upcoming.sort((a, b) => new Date(a.startDateTime) - new Date(b.startDateTime));
    return upcoming[0];
  };

  const getUpcomingCount = () => {
    return appointments.filter(
      (app) => app.status === "SCHEDULED" && new Date(app.startDateTime) > new Date()
    ).length;
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", bgcolor: "#f8fafc" }}>
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  // Next Appointment details
  const nextApp = getNextAppointment();

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f8fafc" }}>
      <PatientSidebar currentTab={currentTab} setCurrentTab={setCurrentTab} profile={profile} />

      <Box sx={{ flexGrow: 1, p: { xs: 2, md: 4 }, overflow: "auto" }}>
        <AnimatePresence mode="wait">
          {/* OVERVIEW TAB */}
          {currentTab === "overview" && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              {/* Header Greeting Banner */}
              <Box
                sx={{
                  background: "linear-gradient(135deg, #1e3a8a, #3b82f6)",
                  borderRadius: 4,
                  p: 4,
                  color: "white",
                  mb: 4,
                  boxShadow: "0 10px 20px rgba(59, 130, 246, 0.2)",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 2,
                }}
              >
                <Box>
                  <Typography variant="h4" fontWeight="bold" sx={{ mb: 1, fontFamily: "Poppins" }}>
                    Welcome Back, {profile?.firstName}!
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.85, maxWidth: 600 }}>
                    Access your medical profile, manage your upcoming clinical appointments, and view your diagnostic reports in one unified portal.
                  </Typography>
                </Box>
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    fontSize: "2rem",
                    bgcolor: "rgba(255, 255, 255, 0.25)",
                    border: "3px solid white",
                    fontWeight: "bold",
                  }}
                >
                  {profile?.firstName?.charAt(0)}
                </Avatar>
              </Box>

              {/* Statistical Metrics */}
              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={4}>
                  <MotionCard
                    whileHover={{ scale: 1.02 }}
                    sx={{ borderRadius: 3, borderLeft: "6px solid #2563eb", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
                  >
                    <CardContent sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <Box>
                        <Typography color="textSecondary" variant="subtitle2" fontWeight="600" sx={{ textTransform: "uppercase" }}>
                          Scheduled Visits
                        </Typography>
                        <Typography variant="h3" fontWeight="bold" sx={{ mt: 1, color: "#1e293b" }}>
                          {getUpcomingCount()}
                        </Typography>
                      </Box>
                      <Avatar sx={{ bgcolor: "#eff6ff", color: "#2563eb", width: 56, height: 56 }}>
                        <EventAvailableIcon fontSize="large" />
                      </Avatar>
                    </CardContent>
                  </MotionCard>
                </Grid>

                <Grid item xs={12} md={4}>
                  <MotionCard
                    whileHover={{ scale: 1.02 }}
                    sx={{ borderRadius: 3, borderLeft: "6px solid #0891b2", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
                  >
                    <CardContent sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <Box>
                        <Typography color="textSecondary" variant="subtitle2" fontWeight="600" sx={{ textTransform: "uppercase" }}>
                          Laboratory Tests
                        </Typography>
                        <Typography variant="h3" fontWeight="bold" sx={{ mt: 1, color: "#1e293b" }}>
                          {tests.length}
                        </Typography>
                      </Box>
                      <Avatar sx={{ bgcolor: "#ecfeff", color: "#0891b2", width: 56, height: 56 }}>
                        <ScienceIcon fontSize="large" />
                      </Avatar>
                    </CardContent>
                  </MotionCard>
                </Grid>

                <Grid item xs={12} md={4}>
                  <MotionCard
                    whileHover={{ scale: 1.02 }}
                    sx={{ borderRadius: 3, borderLeft: "6px solid #16a34a", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
                  >
                    <CardContent sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <Box>
                        <Typography color="textSecondary" variant="subtitle2" fontWeight="600" sx={{ textTransform: "uppercase" }}>
                          Copay & Fees Paid
                        </Typography>
                        <Typography variant="h4" fontWeight="bold" sx={{ mt: 1.5, color: "#16a34a" }}>
                          ₹{profile?.regAmount || 0}
                        </Typography>
                      </Box>
                      <Avatar sx={{ bgcolor: "#f0fdf4", color: "#16a34a", width: 56, height: 56 }}>
                        <CheckCircleIcon fontSize="large" />
                      </Avatar>
                    </CardContent>
                  </MotionCard>
                </Grid>
              </Grid>

              {/* Next Appointment Section */}
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Card sx={{ borderRadius: 4, boxShadow: "0 4px 15px rgba(0,0,0,0.05)", p: 1 }}>
                    <CardContent>
                      <Typography variant="h5" fontWeight="bold" sx={{ mb: 3, fontFamily: "Poppins", display: "flex", alignItems: "center", gap: 1 }}>
                        <CalendarMonthIcon color="primary" /> Upcoming Consultation
                      </Typography>

                      {nextApp ? (
                        <Box sx={{ p: 3, bgcolor: "#f1f5f9", borderRadius: 3, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 3 }}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                            <Avatar sx={{ bgcolor: "#2563eb", width: 60, height: 60, fontSize: "1.2rem", fontWeight: "bold" }}>
                              Dr
                            </Avatar>
                            <Box>
                              <Typography variant="h6" fontWeight="bold" sx={{ color: "#1f2937" }}>
                                Dr. {nextApp.doctorFirstName} {nextApp.doctorLastName}
                              </Typography>
                              <Chip label={nextApp.doctorSpeciality} size="small" color="primary" sx={{ my: 0.5 }} />
                              <Typography variant="body2" color="textSecondary">
                                Scheduled Date: {formatDateTime(nextApp.startDateTime)}
                              </Typography>
                            </Box>
                          </Box>
                          <Box sx={{ display: "flex", gap: 1 }}>
                            <Button
                              variant="outlined"
                              color="error"
                              startIcon={<CancelIcon />}
                              onClick={() => handleCancelAppointment(nextApp.id)}
                            >
                              Cancel Consultation
                            </Button>
                          </Box>
                        </Box>
                      ) : (
                        <Box sx={{ textAlign: "center", py: 5, color: "#64748b" }}>
                          <LocalHospitalIcon sx={{ fontSize: 60, mb: 1, opacity: 0.5 }} />
                          <Typography variant="h6" fontWeight="500">No Scheduled Consultations</Typography>
                          <Typography variant="body2" sx={{ mb: 3 }}>You have no future doctor appointments scheduled at this moment.</Typography>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => setCurrentTab("appointments")}
                          >
                            Schedule Now
                          </Button>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </motion.div>
          )}

          {/* APPOINTMENTS TAB */}
          {currentTab === "appointments" && (
            <motion.div
              key="appointments"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <Box sx={{ mb: 3 }}>
                <Typography variant="h4" fontWeight="bold" sx={{ fontFamily: "Poppins" }}>
                  Clinical Appointments
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Schedule new consultations or review history of past visits.
                </Typography>
              </Box>

              {/* Sub-navigation inside Appointments */}
              <AppointmentContainer
                appointments={appointments}
                doctors={doctors}
                specialities={specialities}
                selectedSpeciality={selectedSpeciality}
                setSelectedSpeciality={setSelectedSpeciality}
                selectedDoctor={selectedDoctor}
                setSelectedDoctor={setSelectedDoctor}
                bookingDateTime={bookingDateTime}
                setBookingDateTime={setBookingDateTime}
                handleBookingSubmit={handleBookingSubmit}
                handleCancelAppointment={handleCancelAppointment}
                formatDateTime={formatDateTime}
              />
            </motion.div>
          )}

          {/* PRESCRIBED TESTS TAB */}
          {currentTab === "tests" && (
            <motion.div
              key="tests"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
                <Box>
                  <Typography variant="h4" fontWeight="bold" sx={{ fontFamily: "Poppins" }}>
                    Laboratory & Prescribed Tests
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    View laboratory diagnostics and clinical screening tests prescribed by your practitioners.
                  </Typography>
                </Box>
                <TextField
                  size="small"
                  placeholder="Search prescribed tests..."
                  value={testSearch}
                  onChange={(e) => setTestSearch(e.target.value)}
                  InputProps={{
                    startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
                  }}
                  sx={{ width: { xs: "100%", sm: 260 }, bgcolor: "white", borderRadius: 2 }}
                />
              </Box>

              {/* Tests Grid */}
              <Grid container spacing={3}>
                {tests
                  .filter((test) =>
                    test.testName.toLowerCase().includes(testSearch.toLowerCase()) ||
                    `${test.doctorFirstName} ${test.doctorLastName}`.toLowerCase().includes(testSearch.toLowerCase())
                  )
                  .map((test) => (
                    <Grid item xs={12} md={6} key={test.testId}>
                      <MotionCard
                        whileHover={{ scale: 1.01 }}
                        sx={{ borderRadius: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.04)" }}
                      >
                        <CardContent>
                          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                            <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
                              <Avatar sx={{ bgcolor: "#ecfeff", color: "#0891b2" }}>
                                <ScienceIcon />
                              </Avatar>
                              <Box>
                                <Typography variant="h6" fontWeight="bold">
                                  {test.testName}
                                </Typography>
                                <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                                  Prescribed by: Dr. {test.doctorFirstName} {test.doctorLastName}
                                </Typography>
                              </Box>
                            </Box>
                            <Typography variant="h6" fontWeight="bold" color="primary">
                              ₹{test.cost}
                            </Typography>
                          </Box>
                          <Typography variant="body2" sx={{ bgcolor: "#f8fafc", p: 1.5, borderRadius: 2, my: 1.5, borderLeft: "3px solid #0891b2" }}>
                            {test.description || "No specific instructions provided."}
                          </Typography>
                          <Typography variant="caption" color="textSecondary" sx={{ display: "block", textAlign: "right" }}>
                            Prescribed Date: {formatDateTime(test.datePrescribed)}
                          </Typography>
                        </CardContent>
                      </MotionCard>
                    </Grid>
                  ))}

                {tests.length === 0 && (
                  <Grid item xs={12}>
                    <Paper sx={{ p: 5, textAlign: "center", color: "#64748b", borderRadius: 3 }}>
                      <ScienceIcon sx={{ fontSize: 60, mb: 1, opacity: 0.5 }} />
                      <Typography variant="h6">No Diagnostic Tests Found</Typography>
                      <Typography variant="body2">There are currently no laboratory/diagnostic tests prescribed in your records.</Typography>
                    </Paper>
                  </Grid>
                )}
              </Grid>
            </motion.div>
          )}

          {/* MY PROFILE TAB */}
          {currentTab === "profile" && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box>
                  <Typography variant="h4" fontWeight="bold" sx={{ fontFamily: "Poppins" }}>
                    Patient Profile
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Manage your personal records, contact information, and medical background.
                  </Typography>
                </Box>
                <Button
                  variant={isEditMode ? "outlined" : "contained"}
                  color={isEditMode ? "error" : "primary"}
                  startIcon={isEditMode ? <CancelIcon /> : <EditIcon />}
                  onClick={() => setIsEditMode(!isEditMode)}
                >
                  {isEditMode ? "Cancel Editing" : "Edit Profile"}
                </Button>
              </Box>

              <Grid container spacing={4}>
                <Grid item xs={12} md={8}>
                  <Paper sx={{ p: 4, borderRadius: 4, boxShadow: "0 4px 15px rgba(0,0,0,0.05)" }}>
                    <Box component="form" onSubmit={handleProfileSubmit}>
                      <Typography variant="h6" fontWeight="bold" sx={{ mb: 3, display: "flex", alignItems: "center", gap: 1 }}>
                        <PersonIcon color="primary" /> Demographic Information
                      </Typography>

                      <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="First Name"
                            name="firstName"
                            value={profileForm.firstName}
                            onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
                            disabled={!isEditMode}
                            required
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Last Name"
                            name="lastName"
                            value={profileForm.lastName}
                            onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
                            disabled={!isEditMode}
                            required
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Contact Phone"
                            name="phone"
                            value={profileForm.phone}
                            onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                            disabled={!isEditMode}
                            required
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Date of Birth"
                            type="date"
                            name="dob"
                            value={profileForm.dob}
                            onChange={(e) => setProfileForm({ ...profileForm, dob: e.target.value })}
                            disabled={!isEditMode}
                            InputLabelProps={{ shrink: true }}
                            required
                          />
                        </Grid>

                        <Grid item xs={12}>
                          <Typography variant="h6" fontWeight="bold" sx={{ mt: 2, mb: 1, display: "flex", alignItems: "center", gap: 1 }}>
                            <LocalHospitalIcon color="primary" /> Clinical Details
                          </Typography>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                          <TextField
                            select
                            fullWidth
                            label="Blood Group"
                            name="bloodGroup"
                            value={profileForm.bloodGroup}
                            onChange={(e) => setProfileForm({ ...profileForm, bloodGroup: e.target.value })}
                            disabled={!isEditMode}
                          >
                            <MenuItem value="A_POSITIVE">A+</MenuItem>
                            <MenuItem value="B_POSITIVE">B+</MenuItem>
                            <MenuItem value="AB_POSITIVE">AB+</MenuItem>
                            <MenuItem value="O_POSITIVE">O+</MenuItem>
                            <MenuItem value="A_NEGATIVE">A-</MenuItem>
                            <MenuItem value="B_NEGATIVE">B-</MenuItem>
                            <MenuItem value="AB_NEGATIVE">AB-</MenuItem>
                            <MenuItem value="O_NEGATIVE">O-</MenuItem>
                          </TextField>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            select
                            fullWidth
                            label="Gender"
                            name="gender"
                            value={profileForm.gender}
                            onChange={(e) => setProfileForm({ ...profileForm, gender: e.target.value })}
                            disabled={!isEditMode}
                          >
                            <MenuItem value="MALE">Male</MenuItem>
                            <MenuItem value="FEMALE">Female</MenuItem>
                          </TextField>
                        </Grid>

                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            multiline
                            rows={3}
                            label="Family Medical History"
                            name="familyHistory"
                            value={profileForm.familyHistory}
                            onChange={(e) => setProfileForm({ ...profileForm, familyHistory: e.target.value })}
                            disabled={!isEditMode}
                            placeholder="Detail any hereditary medical conditions, e.g. Hypertension, Diabetes, Asthma"
                          />
                        </Grid>

                        {isEditMode && (
                          <Grid item xs={12}>
                            <Button
                              type="submit"
                              variant="contained"
                              color="success"
                              size="large"
                              startIcon={<SaveIcon />}
                              sx={{ mt: 1 }}
                            >
                              Save Profile Updates
                            </Button>
                          </Grid>
                        )}
                      </Grid>
                    </Box>
                  </Paper>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Paper sx={{ p: 4, borderRadius: 4, bgcolor: "#f8fafc", border: "1px solid #e2e8f0" }}>
                    <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                      Registration Details
                    </Typography>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                      <Box>
                        <Typography variant="caption" color="textSecondary">
                          MEMBER ID
                        </Typography>
                        <Typography variant="body1" fontWeight="bold">
                          PAT-{profile?.id || "N/A"}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="textSecondary">
                          EMAIL ADDRESS
                        </Typography>
                        <Typography variant="body1" fontWeight="500">
                          {profile?.email}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="textSecondary">
                          REGISTRATION FEE PAID
                        </Typography>
                        <Typography variant="body1" fontWeight="bold" color="success.main">
                          ₹{profile?.regAmount || 0}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="textSecondary">
                          REGISTERED ON
                        </Typography>
                        <Typography variant="body1" fontWeight="500">
                          {profile?.createdOn ? new Date(profile.createdOn).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          }) : "N/A"}
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                </Grid>
              </Grid>
            </motion.div>
          )}
        </AnimatePresence>
      </Box>
    </Box>
  );
}

// Internal component for tab rendering inside Appointments to avoid nesting issues
function AppointmentContainer({
  appointments,
  doctors,
  specialities,
  selectedSpeciality,
  setSelectedSpeciality,
  selectedDoctor,
  setSelectedDoctor,
  bookingDateTime,
  setBookingDateTime,
  handleBookingSubmit,
  handleCancelAppointment,
  formatDateTime,
}) {
  const [subTab, setSubTab] = useState("my-appts");

  return (
    <Box>
      <Box sx={{ display: "flex", gap: 2, mb: 3, borderBottom: "1px solid #e2e8f0", pb: 1 }}>
        <Button
          id="my-appointments-btn"
          onClick={() => setSubTab("my-appts")}
          sx={{
            fontWeight: 600,
            color: subTab === "my-appts" ? "#2563eb" : "#64748b",
            borderBottom: subTab === "my-appts" ? "2px solid #2563eb" : "none",
            borderRadius: 0,
            px: 2,
            pb: 1,
          }}
        >
          My Appointments ({appointments.length})
        </Button>
        <Button
          id="book-appointment-btn"
          onClick={() => setSubTab("book-appt")}
          sx={{
            fontWeight: 600,
            color: subTab === "book-appt" ? "#2563eb" : "#64748b",
            borderBottom: subTab === "book-appt" ? "2px solid #2563eb" : "none",
            borderRadius: 0,
            px: 2,
            pb: 1,
          }}
        >
          Book Consultation
        </Button>
      </Box>

      {subTab === "my-appts" && (
        <Grid container spacing={3}>
          {appointments.map((appt) => {
            const isFuture = new Date(appt.startDateTime) > new Date();
            const isScheduled = appt.status === "SCHEDULED";
            const canCancel = isFuture && isScheduled;

            let badgeColor = "default";
            if (appt.status === "SCHEDULED") badgeColor = "primary";
            else if (appt.status === "CANCELLED") badgeColor = "error";
            else if (appt.status === "COMPLETED") badgeColor = "success";

            return (
              <Grid item xs={12} key={appt.id}>
                <Card sx={{ borderRadius: 3, boxShadow: "0 4px 10px rgba(0,0,0,0.03)" }}>
                  <CardContent sx={{ p: 3 }}>
                    <Grid container sx={{ alignItems: "center" }} spacing={2}>
                      <Grid item xs={12} md={4}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                          <Avatar sx={{ bgcolor: appt.status === "SCHEDULED" ? "#3b82f6" : "#94a3b8" }}>
                            Dr
                          </Avatar>
                          <Box>
                            <Typography variant="h6" fontWeight="bold">
                              Dr. {appt.doctorFirstName} {appt.doctorLastName}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              {appt.doctorSpeciality}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <Typography variant="body2" color="textSecondary">
                          Time Slot
                        </Typography>
                        <Typography variant="body1" fontWeight="600">
                          {formatDateTime(appt.startDateTime)}
                        </Typography>
                      </Grid>
                      <Grid item xs={6} sm={3} md={2}>
                        <Typography variant="body2" color="textSecondary" sx={{ mb: 0.5 }}>
                          Status
                        </Typography>
                        <Chip label={appt.status} color={badgeColor} size="small" />
                      </Grid>
                      <Grid item xs={6} sm={3} md={2} sx={{ textAlign: "right" }}>
                        {canCancel && (
                          <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            onClick={() => handleCancelAppointment(appt.id)}
                          >
                            Cancel
                          </Button>
                        )}
                      </Grid>

                      {/* Diagnostic Tests Prescribed for this appointment if any */}
                      {appt.diagTests && appt.diagTests.length > 0 && (
                        <Grid item xs={12}>
                          <Box sx={{ mt: 2, p: 2, bgcolor: "#f8fafc", borderRadius: 2, borderLeft: "4px solid #3b82f6" }}>
                            <Typography variant="subtitle2" fontWeight="600" color="primary" sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 1 }}>
                              <ScienceIcon fontSize="small" /> Prescribed Screenings & Diagnostics
                            </Typography>
                            <Grid container spacing={1}>
                              {Array.from(appt.diagTests).map((test) => (
                                <Grid item xs={12} sm={6} key={test.id}>
                                  <Box sx={{ display: "flex", justifyContent: "space-between", p: 1, bgcolor: "white", borderRadius: 1.5, border: "1px solid #e2e8f0" }}>
                                    <Box>
                                      <Typography variant="body2" fontWeight="bold">{test.name}</Typography>
                                      <Typography variant="caption" color="textSecondary">{test.description}</Typography>
                                    </Box>
                                    <Typography variant="body2" fontWeight="bold">₹{test.cost}</Typography>
                                  </Box>
                                </Grid>
                              ))}
                            </Grid>
                          </Box>
                        </Grid>
                      )}
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}

          {appointments.length === 0 && (
            <Grid item xs={12}>
              <Paper sx={{ p: 5, textAlign: "center", color: "#64748b", borderRadius: 3 }}>
                <CalendarMonthIcon sx={{ fontSize: 60, mb: 1, opacity: 0.5 }} />
                <Typography variant="h6">No Appointments Found</Typography>
                <Typography variant="body2">You have no appointments booked yet.</Typography>
              </Paper>
            </Grid>
          )}
        </Grid>
      )}

      {subTab === "book-appt" && (
        <Paper sx={{ p: 4, borderRadius: 4, boxShadow: "0 4px 15px rgba(0,0,0,0.05)" }}>
          <Grid container spacing={4}>
            {/* Filter & Selector */}
            <Grid item xs={12} md={5}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
                1. Select Speciality & Doctor
              </Typography>
              <TextField
                select
                fullWidth
                label="Filter by Medical Speciality"
                value={selectedSpeciality}
                onChange={(e) => {
                  setSelectedSpeciality(e.target.value);
                  setSelectedDoctor(null);
                }}
                sx={{ mb: 3 }}
                InputProps={{
                  startAdornment: <FilterListIcon color="action" sx={{ mr: 1 }} />,
                }}
              >
                <MenuItem value="">Show All Specialists</MenuItem>
                {specialities.map((spec) => (
                  <MenuItem key={spec} value={spec}>
                    {spec.charAt(0) + spec.slice(1).toLowerCase()}
                  </MenuItem>
                ))}
              </TextField>

              {/* Doctor Selection Grid */}
              <Box sx={{ maxHeight: 400, overflowY: "auto", pr: 1 }}>
                {doctors.map((doc) => {
                  const isSelected = selectedDoctor?.id === doc.id;
                  return (
                    <Card
                      key={doc.id}
                      onClick={() => setSelectedDoctor(doc)}
                      sx={{
                        mb: 2,
                        cursor: "pointer",
                        border: isSelected ? "2px solid #2563eb" : "1px solid #e2e8f0",
                        bgcolor: isSelected ? "#eff6ff" : "white",
                        transition: "all 0.2s ease",
                        "&:hover": { borderColor: "#2563eb", transform: "translateY(-2px)" },
                      }}
                    >
                      <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                          <Avatar sx={{ bgcolor: isSelected ? "#2563eb" : "#94a3b8" }}>
                            Dr
                          </Avatar>
                          <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="subtitle1" fontWeight="bold">
                              Dr. {doc.firstName} {doc.lastName}
                            </Typography>
                            <Typography variant="caption" color="primary" sx={{ fontWeight: 600, display: "block" }}>
                              {doc.speciality}
                            </Typography>
                            <Typography variant="caption" color="textSecondary" sx={{ display: "block" }}>
                              Exp: {doc.experienceInYears} Yrs | Fees: ₹{doc.fees}
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  );
                })}

                {doctors.length === 0 && (
                  <Box sx={{ textAlign: "center", py: 4, color: "#64748b" }}>
                    <Typography variant="body2">No doctors found for the selected speciality.</Typography>
                  </Box>
                )}
              </Box>
            </Grid>

            {/* DateTime Selector & Submit */}
            <Grid item xs={12} md={7}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
                2. Appointment Schedule
              </Typography>

              {selectedDoctor ? (
                <Box component="form" onSubmit={handleBookingSubmit} sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  <Paper sx={{ p: 3, bgcolor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 3 }}>
                    <Typography variant="subtitle2" color="textSecondary">Selected Practitioner</Typography>
                    <Typography variant="h6" fontWeight="bold">Dr. {selectedDoctor.firstName} {selectedDoctor.lastName}</Typography>
                    <Typography variant="body2" color="primary" sx={{ fontWeight: 600, mb: 1 }}>{selectedDoctor.speciality}</Typography>
                    <Typography variant="body2" color="textSecondary">Qualifications: {selectedDoctor.qualifications}</Typography>
                    <Typography variant="body2" color="textSecondary">Experience: {selectedDoctor.experienceInYears} Years</Typography>
                    <Typography variant="body2" color="textSecondary">Consultation Fees: ₹{selectedDoctor.fees}</Typography>
                    <Typography variant="body2" color="textSecondary">Average Consultation Time: {selectedDoctor.appointmentTime} Mins</Typography>
                  </Paper>

                  <TextField
                    fullWidth
                    label="Desired Date and Time"
                    type="datetime-local"
                    value={bookingDateTime}
                    onChange={(e) => setBookingDateTime(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    required
                  />

                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large"
                    startIcon={<CheckCircleIcon />}
                    sx={{ py: 1.5, fontSize: "1rem" }}
                  >
                    Confirm Booking Schedule
                  </Button>
                </Box>
              ) : (
                <Box sx={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", py: 5, color: "#64748b" }}>
                  <InfoIcon sx={{ fontSize: 40, mb: 1, opacity: 0.5 }} />
                  <Typography variant="body1">Select a Doctor from the left panel to complete your scheduling</Typography>
                </Box>
              )}
            </Grid>
          </Grid>
        </Paper>
      )}
    </Box>
  );
}

export default PatientDashboard;