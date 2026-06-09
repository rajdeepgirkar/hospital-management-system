import axios from "axios";

const doctorAPI = axios.create({
  baseURL: "http://localhost:8081/doctor",
});

// Request interceptor to add JWT token
doctorAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const getDoctorProfile = () => doctorAPI.get("/profile");

export const updateDoctorProfile = (data) => doctorAPI.put("/profile", data);

export const getDoctorAppointments = () => doctorAPI.get("/appointments");

export const updateAppointmentStatus = (appointmentId, status) =>
  doctorAPI.put(`/appointments/${appointmentId}/status`, null, { params: { status } });

export const prescribeTests = (appointmentId, testIds) =>
  doctorAPI.post(`/appointments/${appointmentId}/tests`, testIds);

export const getAvailableTests = () => doctorAPI.get("/tests");
