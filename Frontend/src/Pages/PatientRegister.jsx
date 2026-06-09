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
import { registerPatient } from "../Services/authService";

function PatientRegister() {
    const navigate = useNavigate();

    const [formData, setFormData] =
        useState({
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            phone: "",
            dob: "",

            bloodGroup: "",
            gender: "",
            familyHistory: "",
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
            await registerPatient(
                formData
            );

            toast.success(
                "Patient Registered Successfully"
            );

            navigate("/login");
        } catch (error) {
            console.log("Status:", error.response?.status);
            console.log("Response:", error.response?.data);
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
                        Patient Registration
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
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="First Name"
                                    name="firstName"
                                    onChange={handleChange}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Last Name"
                                    name="lastName"
                                    onChange={handleChange}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Email"
                                    name="email"
                                    onChange={handleChange}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    type="password"
                                    label="Password"
                                    name="password"
                                    onChange={handleChange}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Phone"
                                    name="phone"
                                    onChange={handleChange}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Date of Birth"
                                    type="date"
                                    name="dob"
                                    value={formData.dob}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    onChange={handleChange}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <Typography variant="h6">
                                    Medical Details
                                </Typography>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    select
                                    fullWidth
                                    label="Blood Group"
                                    name="bloodGroup"
                                    onChange={handleChange}
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

                            <Grid item xs={12} md={6}>
                                <TextField
                                    select
                                    fullWidth
                                    label="Gender"
                                    name="gender"
                                    onChange={handleChange}
                                >
                                    <MenuItem value="MALE">Male</MenuItem>
                                    <MenuItem value="FEMALE">Female</MenuItem>
                                </TextField>
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={4}
                                    label="Family History"
                                    name="familyHistory"
                                    onChange={handleChange}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <Button
                                    fullWidth
                                    size="large"
                                    variant="contained"
                                    type="submit"
                                >
                                    Register Patient
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                </Paper>
            </Container>
        </>
    );
}

export default PatientRegister;