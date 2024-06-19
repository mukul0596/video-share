import React from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Link,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import useAxios from "../../hooks/useAxios";
import { isLoading, isSuccess } from "../../utils/statusHelpers";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = React.useState({
    username: "",
    password: "",
  });
  const [{ data, status }, submitRequest] = useAxios(
    {
      method: "POST",
      url: "/auth/login",
    },
    { manual: true }
  );
  React.useEffect(() => {
    if (isSuccess(status)) {
      localStorage.setItem("token", data?.token);
      navigate("/dashboard/my");
    }
  }, [status]);
  const regiterUser = (e) => {
    e.preventDefault();
    submitRequest({ data: formData });
  };
  return (
    <Box
      height="100%"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <form onSubmit={regiterUser}>
        <Paper sx={{ p: 4, minWidth: 400 }}>
          <Stack spacing={3}>
            <Typography variant="h5" align="center">
              Login
            </Typography>
            <TextField
              label="Username"
              value={formData.username}
              onChange={(e) =>
                setFormData((prevData) => ({
                  ...prevData,
                  username: e.target.value,
                }))
              }
              size="small"
              fullWidth
              required
            />
            <TextField
              type="password"
              label="Password"
              value={formData.password}
              onChange={(e) =>
                setFormData((prevData) => ({
                  ...prevData,
                  password: e.target.value,
                }))
              }
              size="small"
              fullWidth
              required
            />
            <Button
              type="submit"
              variant="contained"
              disabled={isLoading(status)}
            >
              {isLoading(status) ? "Login..." : "Login"}
            </Button>
            <Typography variant="body2" align="center">
              Don&#39;t have an account?&nbsp;
              <Link component={RouterLink} to="/auth/register">
                Register
              </Link>
            </Typography>
          </Stack>
        </Paper>
      </form>
    </Box>
  );
};

export default Register;
