import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
    Container
} from "@mui/material";
import { Link } from "react-router-dom";

function Navbar() {
    return (
        <AppBar 
            position="static" 
            sx={{ 
                backgroundColor: "#ffffff", 
                color: "#0f172a", 
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                borderBottom: "1px solid #e2e8f0"
            }}
        >
            <Container maxWidth="lg">
                <Toolbar disableGutters sx={{ justifyContent: "space-between" }}>
                    <Typography
                        variant="h5"
                        fontWeight="bold"
                        component={Link}
                        to="/"
                        sx={{ 
                            color: "#0284c7", 
                            textDecoration: "none",
                            display: "flex",
                            alignItems: "center",
                            gap: 1
                        }}
                    >
                        🏥 HMS
                    </Typography>

                    <Box>
                        <Button
                            component={Link}
                            to="/"
                            sx={{ color: "#475569", marginRight: 2, fontWeight: 500 }}
                        >
                            Home
                        </Button>

                        <Button
                            variant="outlined"
                            component={Link}
                            to="/login"
                            sx={{ 
                                color: "#0284c7", 
                                borderColor: "#0284c7",
                                fontWeight: "bold",
                                "&:hover": {
                                    backgroundColor: "rgba(2, 132, 199, 0.05)",
                                    borderColor: "#0284c7"
                                }
                            }}
                        >
                            Login
                        </Button>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}

export default Navbar;