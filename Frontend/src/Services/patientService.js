import axios from "axios";

const patientAPI = axios.create({
  baseURL: "http://localhost:8081/patient",
});

// Request interceptor to add JWT token
patientAPI.interceptors.request.use(
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

export const getPatientProfile = () => patientAPI.get("/profile");

export const updatePatientProfile = (data) => patientAPI.put("/profile", data);

export const getDoctors = (speciality) => {
  const params = speciality ? { speciality } : {};
  return patientAPI.get("/doctors", { params });
};

export const getSpecialities = () => patientAPI.get("/specialities");

export const bookAppointment = (data) => patientAPI.post("/appointments", data);

export const getAppointments = () => patientAPI.get("/appointments");

export const cancelAppointment = (appointmentId) =>
  patientAPI.put(`/appointments/${appointmentId}/cancel`);

export const getPrescribedTests = () => patientAPI.get("/tests");
