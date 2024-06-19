import React from "react";
import { Box, Button, Stack, TextField } from "@mui/material";
import { useDialog } from "../../Context/DialogContext";
import { isLoading } from "../../utils/statusHelpers";
import useAxios from "../../hooks/useAxios";

const AddUserForm = ({ refresh }) => {
  const { closeDialog } = useDialog();
  const [formData, setFormData] = React.useState({
    username: "",
    password: "",
  });

  const [{ status }, submitUser] = useAxios(
    {
      method: "POST",
      url: "/user",
      data: { ...formData },
    },
    { manual: true }
  );

  const addNewUser = (e) => {
    e.preventDefault();
    submitUser({}, () => {
      refresh();
      closeDialog();
    });
  };

  return (
    <form onSubmit={addNewUser}>
      <Stack spacing={2} py={2}>
        <TextField
          label="Username"
          fullWidth
          value={formData.username}
          onChange={(e) =>
            setFormData((prevState) => ({
              ...prevState,
              username: e.target.value,
            }))
          }
        />
        <TextField
          type="password"
          label="Password"
          fullWidth
          value={formData.password}
          onChange={(e) =>
            setFormData((prevState) => ({
              ...prevState,
              password: e.target.value,
            }))
          }
        />
        <Box textAlign="end">
          <Button
            type="submit"
            variant="contained"
            disableElevation
            disabled={isLoading(status)}
          >
            {isLoading(status) ? "Adding..." : "Add"}
          </Button>
        </Box>
      </Stack>
    </form>
  );
};

export default AddUserForm;
