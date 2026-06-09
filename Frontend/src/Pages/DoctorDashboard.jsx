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
  Checkbox,
  FormControlLabel,
  FormGroup,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

// Icons
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import ScienceIcon from "@mui/icons-material/Science";
import PersonIcon from "@mui/icons-material/Person";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import SearchIcon from "@mui/icons-material/Search";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CloseIcon from "@mui/icons-material/Close";
import BadgeIcon from "@mui/icons-material/Badge";

import DoctorSidebar from "../Components/DoctorSidebar";
import {
  getDoctorProfile,
  updateDoctorProfile,
  getDoctorAppointments,
  updateAppointmentStatus,
  prescribeTests,
  getAvailableTests,
} from "../Services/doctorService";

const MotionCard = motion(Card);

function DoctorDashboard() {
  const [currentTab, setCurrentTab] = useState(() => {
    return localStorage.getItem("doctor_active_tab") || "overview";
  });
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem("doctor_profile");
    return saved ? JSON.parse(saved) : null;
  });
  const [appointments, setAppointments] = useState(() => {
    const saved = localStorage.getItem("doctor_appointments");
    return saved ? JSON.parse(saved) : [];
  });
  const [availableTests, setAvailableTests] = useState(() => {
    const saved = localStorage.getItem("doctor_available_tests");
    return saved ? JSON.parse(saved) : [];
  });

  // States for Operations
  const [loading, setLoading] = useState(() => {
    return !(localStorage.getItem("doctor_profile") && localStorage.getItem("doctor_appointments"));
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [searchPatient, setSearchPatient] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Prescribing Tests Dialog States
  const [testDialogOpen, setTestDialogOpen] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const [selectedTestIds, setSelectedTestIds] = useState([]);
  const [testSearchQuery, setTestSearchQuery] = useState("");

  // Profile Form state
  const [profileForm, setProfileForm] = useState(() => {
    const saved = localStorage.getItem("doctor_profile");
    const parsed = saved ? JSON.parse(saved) : null;
    return {
      firstName: parsed?.firstName || "",
      lastName: parsed?.lastName || "",
      phone: parsed?.phone || "",
      dob: parsed?.dob || "",
      qualifications: parsed?.qualifications || "",
      speciality: parsed?.speciality || "",
      experienceInYears: parsed?.experienceInYears || 0,
      appointmentTime: parsed?.appointmentTime || 0,
      fees: parsed?.fees || 0,
    };
  });

  // Sync active tab to localStorage
  useEffect(() => {
    localStorage.setItem("doctor_active_tab", currentTab);
  }, [currentTab]);

  // Load essential dashboard details
  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    const hasCache = localStorage.getItem("doctor_profile") && localStorage.getItem("doctor_appointments");
    if (!hasCache) {
      setLoading(true);
    }
    try {
      const profileRes = await getDoctorProfile();
      setProfile(profileRes.data);
      localStorage.setItem("doctor_profile", JSON.stringify(profileRes.data));
      setProfileForm({
        firstName: profileRes.data.firstName || "",
        lastName: profileRes.data.lastName || "",
        phone: profileRes.data.phone || "",
        dob: profileRes.data.dob || "",
        qualifications: profileRes.data.qualifications || "",
        speciality: profileRes.data.speciality || "",
        experienceInYears: profileRes.data.experienceInYears || 0,
        appointmentTime: profileRes.data.appointmentTime || 0,
        fees: profileRes.data.fees || 0,
      });

      // Fetch appointments & available tests
      const [apptRes, testsRes] = await Promise.all([
        getDoctorAppointments(),
        getAvailableTests(),
      ]);

      setAppointments(apptRes.data);
      setAvailableTests(testsRes.data);
      localStorage.setItem("doctor_appointments", JSON.stringify(apptRes.data));
      localStorage.setItem("doctor_available_tests", JSON.stringify(testsRes.data));
    } catch (error) {
      console.error("Error fetching doctor dashboard data:", error);
      toast.error("Failed to load dashboard data. Please make sure you are logged in.");
    } finally {
      setLoading(false);
    }
  };

  const refreshAppointments = async () => {
    try {
      const apptRes = await getDoctorAppointments();
      setAppointments(apptRes.data);
      localStorage.setItem("doctor_appointments", JSON.stringify(apptRes.data));
    } catch (error) {
      console.error("Error refreshing appointments:", error);
    }
  };

  // Profile Update submit
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateDoctorProfile(profileForm);
      toast.success("Profile updated successfully!");
      setIsEditMode(false);
      // Refresh profile data
      const profileRes = await getDoctorProfile();
      setProfile(profileRes.data);
      localStorage.setItem("doctor_profile", JSON.stringify(profileRes.data));
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error.response?.data?.message || "Failed to update profile.");
    }
  };

  // Update Appointment Status (Complete/Cancel)
  const handleUpdateStatus = async (apptId, status) => {
    const actionText = status === "COMPLETED" ? "complete" : "cancel";
    if (window.confirm(`Are you sure you want to mark this appointment as ${actionText}?`)) {
      try {
        await updateAppointmentStatus(apptId, status);
        toast.success(`Appointment status updated to ${status}!`);
        refreshAppointments();
      } catch (error) {
        console.error("Error updating status:", error);
        toast.error(error.response?.data?.message || "Failed to update status.");
      }
    }
  };

  // Open Prescribe Tests Dialog
  const handleOpenPrescribeTests = (apptId, currentTests) => {
    setSelectedAppointmentId(apptId);
    setSelectedTestIds(currentTests.map((t) => t.id));
    setTestDialogOpen(true);
  };

  // Handle Checkbox Selection
  const handleTestCheckboxChange = (testId) => {
    setSelectedTestIds((prev) =>
      prev.includes(testId) ? prev.filter((id) => id !== testId) : [...prev, testId]
    );
  };

  // Save Prescribed Tests
  const handleSavePrescribedTests = async () => {
    try {
      await prescribeTests(selectedAppointmentId, selectedTestIds);
      toast.success("Prescribed tests updated successfully!");
      setTestDialogOpen(false);
      refreshAppointments();
    } catch (error) {
      console.error("Error prescribing tests:", error);
      toast.error(error.response?.data?.message || "Failed to prescribe tests.");
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

  // Calculate age from DOB
  const calculateAge = (dobString) => {
    if (!dobString) return "N/A";
    const today = new Date();
    const birthDate = new Date(dobString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Stats Calculations
  const getScheduledCount = () => appointments.filter((a) => a.status === "SCHEDULED").length;
  const getCompletedCount = () => appointments.filter((a) => a.status === "COMPLETED").length;
  const getEarnings = () => getCompletedCount() * (profile?.fees || 0);

  const getNextAppointment = () => {
    const upcoming = appointments.filter(
      (a) => a.status === "SCHEDULED" && new Date(a.startDateTime) > new Date()
    );
    if (upcoming.length === 0) return null;
    // Sort ascending by time
    upcoming.sort((a, b) => new Date(a.startDateTime) - new Date(b.startDateTime));
    return upcoming[0];
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", bgcolor: "#f8fafc" }}>
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  const nextApp = getNextAppointment();

  // Filtered Appointments list
  const filteredAppointments = appointments.filter((a) => {
    const patientName = `${a.patientFirstName} ${a.patientLastName}`.toLowerCase();
    const matchesSearch = patientName.includes(searchPatient.toLowerCase());
    const matchesFilter = statusFilter === "ALL" || a.status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f8fafc" }}>
      <DoctorSidebar currentTab={currentTab} setCurrentTab={setCurrentTab} profile={profile} />

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
                  background: "linear-gradient(135deg, #0e5a9c, #0284c7)",
                  borderRadius: 4,
                  p: 4,
                  color: "white",
                  mb: 4,
                  boxShadow: "0 10px 20px rgba(2, 132, 199, 0.2)",
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
                    Welcome Back, Dr. {profile?.firstName}!
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.85, maxWidth: 600 }}>
                    Monitor your clinical schedule, review upcoming patient consultations, manage medical records, and prescribe laboratory tests.
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
                    sx={{ borderRadius: 3, borderLeft: "6px solid #0284c7", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
                  >
                    <CardContent sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <Box>
                        <Typography color="textSecondary" variant="subtitle2" fontWeight="600" sx={{ textTransform: "uppercase" }}>
                          Scheduled Visits
                        </Typography>
                        <Typography variant="h3" fontWeight="bold" sx={{ mt: 1, color: "#1e293b" }}>
                          {getScheduledCount()}
                        </Typography>
                      </Box>
                      <Avatar sx={{ bgcolor: "#e0f2fe", color: "#0284c7", width: 56, height: 56 }}>
                        <EventAvailableIcon fontSize="large" />
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
                          Completed Consultations
                        </Typography>
                        <Typography variant="h3" fontWeight="bold" sx={{ mt: 1, color: "#1e293b" }}>
                          {getCompletedCount()}
                        </Typography>
                      </Box>
                      <Avatar sx={{ bgcolor: "#dcfce7", color: "#16a34a", width: 56, height: 56 }}>
                        <CheckCircleIcon fontSize="large" />
                      </Avatar>
                    </CardContent>
                  </MotionCard>
                </Grid>

                <Grid item xs={12} md={4}>
                  <MotionCard
                    whileHover={{ scale: 1.02 }}
                    sx={{ borderRadius: 3, borderLeft: "6px solid #ca8a04", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
                  >
                    <CardContent sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <Box>
                        <Typography color="textSecondary" variant="subtitle2" fontWeight="600" sx={{ textTransform: "uppercase" }}>
                          Total Revenue Earned
                        </Typography>
                        <Typography variant="h4" fontWeight="bold" sx={{ mt: 1.5, color: "#ca8a04" }}>
                          ₹{getEarnings()}
                        </Typography>
                      </Box>
                      <Avatar sx={{ bgcolor: "#fef9c3", color: "#ca8a04", width: 56, height: 56 }}>
                        <AttachMoneyIcon fontSize="large" />
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
                            <Avatar sx={{ bgcolor: "#0284c7", width: 60, height: 60, fontSize: "1.2rem", fontWeight: "bold" }}>
                              {nextApp.patientFirstName.charAt(0)}
                            </Avatar>
                            <Box>
                              <Typography variant="h6" fontWeight="bold" sx={{ color: "#1f2937" }}>
                                Patient: {nextApp.patientFirstName} {nextApp.patientLastName}
                              </Typography>
                              <Box sx={{ display: "flex", gap: 1, my: 0.5, flexWrap: "wrap" }}>
                                <Chip label={`Age: ${calculateAge(nextApp.patientDob)}`} size="small" variant="outlined" />
                                <Chip label={`Blood Group: ${nextApp.patientBloodGroup}`} size="small" color="secondary" />
                                <Chip label={`Phone: ${nextApp.patientPhone}`} size="small" variant="outlined" />
                              </Box>
                              <Typography variant="body2" color="textSecondary">
                                Scheduled Time: {formatDateTime(nextApp.startDateTime)}
                              </Typography>
                            </Box>
                          </Box>
                          <Box sx={{ display: "flex", gap: 1 }}>
                            <Button
                              variant="contained"
                              color="success"
                              startIcon={<CheckCircleIcon />}
                              onClick={() => handleUpdateStatus(nextApp.id, "COMPLETED")}
                            >
                              Mark Completed
                            </Button>
                            <Button
                              variant="outlined"
                              color="error"
                              startIcon={<CancelIcon />}
                              onClick={() => handleUpdateStatus(nextApp.id, "CANCELLED")}
                            >
                              Cancel Consultation
                            </Button>
                          </Box>
                        </Box>
                      ) : (
                        <Box sx={{ textAlign: "center", py: 5, color: "#64748b" }}>
                          <CheckCircleIcon sx={{ fontSize: 60, mb: 1, color: "#16a34a", opacity: 0.7 }} />
                          <Typography variant="h6" fontWeight="500">All caught up!</Typography>
                          <Typography variant="body2">You have no upcoming consultations scheduled in your calendar.</Typography>
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
              <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
                <Box>
                  <Typography variant="h4" fontWeight="bold" sx={{ fontFamily: "Poppins" }}>
                    Clinical Appointments
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    View list of diagnostic sessions, consultations, and test prescriptions.
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", width: { xs: "100%", sm: "auto" } }}>
                  <TextField
                    select
                    size="small"
                    label="Status Filter"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    sx={{ width: 150, bgcolor: "white", borderRadius: 2 }}
                  >
                    <MenuItem value="ALL">All Statuses</MenuItem>
                    <MenuItem value="SCHEDULED">Scheduled</MenuItem>
                    <MenuItem value="COMPLETED">Completed</MenuItem>
                    <MenuItem value="CANCELLED">Cancelled</MenuItem>
                  </TextField>
                  <TextField
                    size="small"
                    placeholder="Search by patient name..."
                    value={searchPatient}
                    onChange={(e) => setSearchPatient(e.target.value)}
                    InputProps={{
                      startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
                    }}
                    sx={{ width: { xs: "100%", sm: 260 }, bgcolor: "white", borderRadius: 2 }}
                  />
                </Box>
              </Box>

              {/* Appointments Grid/List */}
              <Grid container spacing={3}>
                {filteredAppointments.map((appt) => {
                  const patientName = `${appt.patientFirstName} ${appt.patientLastName}`;
                  const isScheduled = appt.status === "SCHEDULED";

                  return (
                    <Grid item xs={12} key={appt.id}>
                      <MotionCard
                        whileHover={{ scale: 1.005 }}
                        sx={{ borderRadius: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.04)" }}
                      >
                        <CardContent>
                          <Grid container spacing={2} alignItems="center">
                            {/* Patient Demographics & Date */}
                            <Grid item xs={12} md={7}>
                              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                                <Avatar sx={{ bgcolor: "#f0f9ff", color: "#0284c7", width: 50, height: 50, fontWeight: "bold" }}>
                                  {appt.patientFirstName.charAt(0)}
                                </Avatar>
                                <Box>
                                  <Box sx={{ display: "flex", gap: 1.5, alignItems: "center", flexWrap: "wrap" }}>
                                    <Typography variant="h6" fontWeight="bold">
                                      {patientName}
                                    </Typography>
                                    <Chip
                                      label={appt.status}
                                      size="small"
                                      color={
                                        appt.status === "COMPLETED"
                                          ? "success"
                                          : appt.status === "CANCELLED"
                                          ? "error"
                                          : "primary"
                                      }
                                      sx={{ fontWeight: "bold" }}
                                    />
                                  </Box>
                                  <Box sx={{ display: "flex", gap: 1, my: 0.5, flexWrap: "wrap", alignItems: "center" }}>
                                    <Typography variant="body2" color="textSecondary">
                                      Age: <strong>{calculateAge(appt.patientDob)}</strong>
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">|</Typography>
                                    <Typography variant="body2" color="textSecondary">
                                      Gender: <strong>{appt.patientGender}</strong>
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">|</Typography>
                                    <Typography variant="body2" color="textSecondary">
                                      Blood: <strong>{appt.patientBloodGroup}</strong>
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">|</Typography>
                                    <Typography variant="body2" color="textSecondary">
                                      Phone: <strong>{appt.patientPhone}</strong>
                                    </Typography>
                                  </Box>
                                  <Typography variant="body2" color="primary" fontWeight="600" sx={{ mt: 1 }}>
                                    Date & Time: {formatDateTime(appt.startDateTime)} - {new Date(appt.endDateTime).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true })}
                                  </Typography>
                                </Box>
                              </Box>
                            </Grid>

                            {/* Actions Column */}
                            <Grid item xs={12} md={5} sx={{ display: "flex", flexDirection: "column", alignItems: { md: "flex-end" }, gap: 1.5 }}>
                              {/* Tests Section */}
                              {appt.diagTests && appt.diagTests.size > 0 || appt.diagTests && appt.diagTests.length > 0 ? (
                                <Box sx={{ width: "100%", display: "flex", flexWrap: "wrap", gap: 0.5, justifyContent: { md: "flex-end" } }}>
                                  <Typography variant="caption" sx={{ display: "block", width: "100%", color: "#64748b", textAlign: { md: "right" }, mb: 0.5 }}>
                                    Prescribed Tests:
                                  </Typography>
                                  {Array.from(appt.diagTests).map((test) => (
                                    <Chip
                                      key={test.id}
                                      label={test.name}
                                      icon={<ScienceIcon fontSize="small" />}
                                      size="small"
                                      sx={{ bgcolor: "#ecfeff", color: "#0891b2", borderColor: "#cffafe", border: "1px solid" }}
                                    />
                                  ))}
                                </Box>
                              ) : (
                                !isScheduled && (
                                  <Typography variant="caption" color="textSecondary">
                                    No tests prescribed.
                                  </Typography>
                                )
                              )}

                              {/* Action Buttons */}
                              {isScheduled && (
                                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                                  <Button
                                    variant="outlined"
                                    color="info"
                                    size="small"
                                    startIcon={<ScienceIcon />}
                                    onClick={() => handleOpenPrescribeTests(appt.id, Array.from(appt.diagTests || []))}
                                  >
                                    Prescribe Tests
                                  </Button>
                                  <Button
                                    variant="contained"
                                    color="success"
                                    size="small"
                                    startIcon={<CheckCircleIcon />}
                                    onClick={() => handleUpdateStatus(appt.id, "COMPLETED")}
                                  >
                                    Complete
                                  </Button>
                                  <Button
                                    variant="outlined"
                                    color="error"
                                    size="small"
                                    startIcon={<CancelIcon />}
                                    onClick={() => handleUpdateStatus(appt.id, "CANCELLED")}
                                  >
                                    Cancel
                                  </Button>
                                </Box>
                              )}
                            </Grid>
                          </Grid>
                        </CardContent>
                      </MotionCard>
                    </Grid>
                  );
                })}

                {filteredAppointments.length === 0 && (
                  <Grid item xs={12}>
                    <Paper sx={{ p: 5, textAlign: "center", color: "#64748b", borderRadius: 3 }}>
                      <CalendarMonthIcon sx={{ fontSize: 60, mb: 1, opacity: 0.5 }} />
                      <Typography variant="h6">No Appointments Found</Typography>
                      <Typography variant="body2">There are no appointments matching your search or filters.</Typography>
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
                    Doctor Profile
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Manage your clinical specialties, appointment schedules, fees, and credentials.
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
                {/* Profile Form Details */}
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
                            <BadgeIcon color="primary" /> Clinical & Qualifications
                          </Typography>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Qualifications"
                            name="qualifications"
                            value={profileForm.qualifications}
                            onChange={(e) => setProfileForm({ ...profileForm, qualifications: e.target.value })}
                            disabled={!isEditMode}
                            required
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Speciality"
                            name="speciality"
                            value={profileForm.speciality}
                            onChange={(e) => setProfileForm({ ...profileForm, speciality: e.target.value })}
                            disabled={!isEditMode}
                            required
                          />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <TextField
                            fullWidth
                            type="number"
                            label="Experience (in Years)"
                            name="experienceInYears"
                            value={profileForm.experienceInYears}
                            onChange={(e) => setProfileForm({ ...profileForm, experienceInYears: parseInt(e.target.value) || 0 })}
                            disabled={!isEditMode}
                            required
                          />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <TextField
                            fullWidth
                            type="number"
                            label="Appointment Duration (Minutes)"
                            name="appointmentTime"
                            value={profileForm.appointmentTime}
                            onChange={(e) => setProfileForm({ ...profileForm, appointmentTime: parseInt(e.target.value) || 0 })}
                            disabled={!isEditMode}
                            required
                          />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <TextField
                            fullWidth
                            type="number"
                            label="Consultation Fee (₹)"
                            name="fees"
                            value={profileForm.fees}
                            onChange={(e) => setProfileForm({ ...profileForm, fees: parseInt(e.target.value) || 0 })}
                            disabled={!isEditMode}
                            required
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

                {/* Profile Meta Info Card */}
                <Grid item xs={12} md={4}>
                  <Paper sx={{ p: 4, borderRadius: 4, bgcolor: "#f8fafc", border: "1px solid #e2e8f0" }}>
                    <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                      Clinical Account Info
                    </Typography>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                      <Box>
                        <Typography variant="caption" color="textSecondary">
                          PRACTITIONER ID
                        </Typography>
                        <Typography variant="body1" fontWeight="bold">
                          DOC-{profile?.id || "N/A"}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="textSecondary">
                          LOGIN EMAIL ADDRESS
                        </Typography>
                        <Typography variant="body1" fontWeight="500">
                          {profile?.email}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="textSecondary">
                          SPECIALIZATION
                        </Typography>
                        <Typography variant="body1" fontWeight="bold" color="primary">
                          {profile?.speciality || "N/A"}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="textSecondary">
                          CONSULTATION FEE
                        </Typography>
                        <Typography variant="body1" fontWeight="bold" color="success.main">
                          ₹{profile?.fees || 0}
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

      {/* PRESCRIBE TESTS DIALOG */}
      <Dialog open={testDialogOpen} onClose={() => setTestDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #e2e8f0" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <ScienceIcon color="primary" />
            <Typography variant="h6" fontWeight="bold">Prescribe Diagnostic Tests</Typography>
          </Box>
          <IconButton onClick={() => setTestDialogOpen(false)} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search diagnostic tests by name..."
            value={testSearchQuery}
            onChange={(e) => setTestSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
            }}
            sx={{ my: 2 }}
          />

          <Typography variant="subtitle2" color="textSecondary" sx={{ mb: 1.5 }}>
            Select one or more laboratory screenings:
          </Typography>

          <Paper variant="outlined" sx={{ maxHeight: 300, overflow: "auto", p: 1, borderRadius: 2 }}>
            <FormGroup>
              {availableTests
                .filter((test) => test.name.toLowerCase().includes(testSearchQuery.toLowerCase()))
                .map((test) => {
                  const isChecked = selectedTestIds.includes(test.id);
                  return (
                    <Box key={test.id} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", py: 0.5, borderBottom: "1px solid #f1f5f9", "&:last-child": { borderBottom: 0 } }}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={isChecked}
                            onChange={() => handleTestCheckboxChange(test.id)}
                            color="primary"
                          />
                        }
                        label={
                          <Box>
                            <Typography variant="body1" fontWeight="600">{test.name}</Typography>
                            <Typography variant="caption" color="textSecondary">{test.description || "No description available"}</Typography>
                          </Box>
                        }
                      />
                      <Typography variant="body2" fontWeight="bold" color="primary" sx={{ pr: 2 }}>
                        ₹{test.cost}
                      </Typography>
                    </Box>
                  );
                })}
            </FormGroup>
          </Paper>
        </DialogContent>
        <DialogActions sx={{ p: 2.5, borderTop: "1px solid #e2e8f0" }}>
          <Button onClick={() => setTestDialogOpen(false)} variant="outlined" color="inherit">
            Cancel
          </Button>
          <Button onClick={handleSavePrescribedTests} variant="contained" color="success">
            Prescribe Selected Tests
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default DoctorDashboard;
