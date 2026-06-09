import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8081/auth"
});

export const loginUser = (data) =>
  API.post("/login", data);

export const registerDoctor = (data) =>
  API.post("/register/doctor", data);

export const registerPatient = (data) =>
  API.post("/register/patient", data);