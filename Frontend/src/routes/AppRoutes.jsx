import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";

import Home from "../Pages/Home";
import Login from "../Pages/Login";
import DoctorRegister from "../Pages/DoctorRegister";
import PatientRegister from "../Pages/PatientRegister";
import PatientDashboard from "../Pages/PatientDashboard";
import DoctorDashboard from "../Pages/DoctorDashboard";

function AppRoutes() {

    return (
        <BrowserRouter>

            <Routes>

                <Route
                    path="/"
                    element={<Home />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register-doctor"
                    element={<DoctorRegister />}
                />

                <Route
                    path="/register-patient"
                    element={<PatientRegister />}
                />
                <Route
                    path="/patient/dashboard"
                    element={<PatientDashboard/>}
                />
                <Route
                    path="/doctor/dashboard"
                    element={<DoctorDashboard/>}
                />

            </Routes>

        </BrowserRouter>
    );
}

export default AppRoutes;