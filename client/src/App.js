import React from "react";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { Box } from "@mui/material";
import Register from "./Pages/Auth/Register";
import Login from "./Pages/Auth/Login";
import MyFiles from "./Pages/MyFiles";
import SharedFiles from "./Pages/SharedFiles";
import Preview from "./Pages/Preview";
import { DialogProvider } from "./Context/DialogContext";
import UserManagement from "./Pages/UserManagement";
import UserFiles from "./Pages/UserFiles";

const AutoLogin = () => {
  if (localStorage.getItem("token")) {
    return <Navigate to="/dashboard/my" />;
  }
  return <Outlet />;
};

const AutoLogout = () => {
  if (!localStorage.getItem("token")) {
    return <Navigate to="/auth/login" />;
  }
  return <Outlet />;
};

const App = () => {
  return (
    <DialogProvider>
      <Box height="100vh" width="100%" bgcolor="grey.200">
        <Routes>
          <Route path="auth" element={<AutoLogin />}>
            <Route path="register" element={<Register />} />
            <Route path="login" element={<Login />} />
          </Route>
          <Route path="dashboard" element={<AutoLogout />}>
            <Route path="my" element={<MyFiles />} />
            <Route path="shared" element={<SharedFiles />} />
            <Route path="users" element={<UserManagement />} />
            <Route path=":userId" element={<UserFiles />} />
          </Route>
          <Route path="file/:id" element={<Preview />} />
          <Route path="*" element={<Navigate to="/dashboard/my" />} />
        </Routes>
      </Box>
    </DialogProvider>
  );
};

export default App;
