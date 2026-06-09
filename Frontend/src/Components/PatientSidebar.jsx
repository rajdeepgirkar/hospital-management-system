import {
  Avatar,
  Box,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  Typography,
} from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import ScienceIcon from "@mui/icons-material/Science";

import { useNavigate } from "react-router-dom";

function PatientSidebar({ currentTab, setCurrentTab, profile }) {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const getInitials = () => {
    if (!profile) return "P";
    const first = profile.firstName ? profile.firstName.charAt(0) : "";
    const last = profile.lastName ? profile.lastName.charAt(0) : "";
    return (first + last).toUpperCase() || "P";
  };

  const menuItems = [
    { id: "overview", label: "Overview", icon: <DashboardIcon /> },
    { id: "appointments", label: "Appointments", icon: <CalendarMonthIcon /> },
    { id: "tests", label: "Prescribed Tests", icon: <ScienceIcon /> },
    { id: "profile", label: "My Profile", icon: <PersonIcon /> },
  ];

  return (
    <Box
      sx={{
        width: 280,
        height: "100vh",
        background: "linear-gradient(180deg, #0f172a, #1e293b)",
        color: "#f8fafc",
        display: "flex",
        flexDirection: "column",
        boxShadow: "4px 0 10px rgba(0,0,0,0.15)",
        position: "sticky",
        top: 0,
      }}
    >
      {/* Header */}
      <Box sx={{ p: 3, display: "flex", alignItems: "center", gap: 1.5 }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 800,
            background: "linear-gradient(90deg, #38bdf8, #0ea5e9)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: "0.5px",
            fontFamily: "Poppins",
          }}
        >
          🏥 Kharghar HMS
        </Typography>
      </Box>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.08)" }} />

      {/* Profile summary */}
      <Box sx={{ p: 3, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
        <Avatar
          sx={{
            width: 70,
            height: 70,
            fontSize: "1.5rem",
            fontWeight: "bold",
            background: "linear-gradient(135deg, #0ea5e9, #2563eb)",
            color: "white",
            boxShadow: "0 4px 12px rgba(14, 165, 233, 0.3)",
            mb: 1.5,
          }}
        >
          {getInitials()}
        </Avatar>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "#f8fafc", fontFamily: "Poppins" }}>
          {profile ? `${profile.firstName} ${profile.lastName}` : "Patient"}
        </Typography>
        <Typography variant="body2" sx={{ color: "#94a3b8", fontSize: "0.8rem" }}>
          {profile ? profile.email : "Loading..."}
        </Typography>
      </Box>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.08)", mb: 2 }} />

      {/* Navigation List */}
      <List sx={{ px: 2, flexGrow: 1 }}>
        {menuItems.map((item) => {
          const isActive = currentTab === item.id;
          return (
            <ListItemButton
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              sx={{
                borderRadius: 2,
                mb: 1,
                py: 1.25,
                px: 2,
                color: isActive ? "#ffffff" : "#94a3b8",
                background: isActive
                  ? "linear-gradient(90deg, #0ea5e9, #0284c7)"
                  : "transparent",
                boxShadow: isActive ? "0 4px 12px rgba(14, 165, 233, 0.25)" : "none",
                "&:hover": {
                  background: isActive
                    ? "linear-gradient(90deg, #0ea5e9, #0284c7)"
                    : "rgba(255, 255, 255, 0.05)",
                  color: "#ffffff",
                  transform: "translateX(4px)",
                },
                transition: "all 0.2s ease",
              }}
            >
              <ListItemIcon
                sx={{
                  color: "inherit",
                  minWidth: 40,
                  "& svg": { fontSize: "1.3rem" },
                }}
              >
                {item.icon}
              </ListItemIcon>
              <Typography
                sx={{
                  fontWeight: isActive ? 600 : 500,
                  fontSize: "0.95rem",
                  fontFamily: "Inter",
                }}
              >
                {item.label}
              </Typography>
            </ListItemButton>
          );
        })}
      </List>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.08)" }} />

      {/* Logout */}
      <Box sx={{ p: 2 }}>
        <ListItemButton
          onClick={logout}
          sx={{
            borderRadius: 2,
            py: 1.25,
            px: 2,
            color: "#ef4444",
            "&:hover": {
              background: "rgba(239, 68, 68, 0.1)",
              transform: "translateX(4px)",
            },
            transition: "all 0.2s ease",
          }}
        >
          <ListItemIcon sx={{ color: "inherit", minWidth: 40 }}>
            <LogoutIcon sx={{ fontSize: "1.3rem" }} />
          </ListItemIcon>
          <Typography
            sx={{
              fontWeight: 600,
              fontSize: "0.95rem",
              fontFamily: "Inter",
            }}
          >
            Logout
          </Typography>
        </ListItemButton>
      </Box>
    </Box>
  );
}

export default PatientSidebar;