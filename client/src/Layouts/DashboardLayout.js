import React from "react";
import { Box, Stack } from "@mui/material";
import Header from "../Components/Header";

const DashboardLayout = ({ children }) => {
  return (
    <Stack>
      <Header />
      <Box sx={{ p: { xs: 2, md: 4 } }}>{children}</Box>
    </Stack>
  );
};

export default DashboardLayout;
