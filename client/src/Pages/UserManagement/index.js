import React from "react";
import {
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import DashboardLayout from "../../Layouts/DashboardLayout";
import UserCard from "../../Components/UserCard";
import GridList from "../../Components/GridList";
import useAxios from "../../hooks/useAxios";
import { isLoading, isSuccess } from "../../utils/statusHelpers";
import { useDialog } from "../../Context/DialogContext";
import AddUserForm from "../../Components/AddUserForm";

const UserManagement = () => {
  const { openDialog } = useDialog();
  const [{ data, status }, refresh] = useAxios({
    method: "GET",
    url: "/user/managed-by",
  });

  return (
    <DashboardLayout>
      <Stack spacing={2}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={1}
        >
          <Typography variant="h6">User Management</Typography>
          <Button
            variant="contained"
            disableElevation
            onClick={() =>
              openDialog("Add User", <AddUserForm refresh={refresh} />)
            }
          >
            Add User
          </Button>
        </Stack>
        <Box textAlign="center">
          {isSuccess(status) && (
            <GridList
              items={data.users}
              sourceName="data"
              ItemComponent={(props) => (
                <UserCard {...props} refresh={refresh} />
              )}
              itemsPerRow={{
                xs: 2,
                sm: 3,
                md: 4,
                lg: 6,
              }}
              gapBetweenItems={2}
            />
          )}
          {isLoading(status) && <CircularProgress />}
        </Box>
      </Stack>
    </DashboardLayout>
  );
};

export default UserManagement;
