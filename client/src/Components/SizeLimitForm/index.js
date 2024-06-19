import React from "react";
import { Box, Button, Stack, TextField } from "@mui/material";
import { useDialog } from "../../Context/DialogContext";
import { isLoading } from "../../utils/statusHelpers";
import useAxios from "../../hooks/useAxios";

const SizeLimitForm = ({ currSizeLimit, userId, refresh }) => {
  const { closeDialog } = useDialog();
  const [sizeLimit, setSizeLimit] = React.useState(currSizeLimit);

  const [{ status }, submitSizeLimit] = useAxios(
    {
      method: "PUT",
      url: `/user/${userId}/size-limit`,
      data: { sizeLimit },
    },
    { manual: true }
  );

  const updateSizeLimit = (e) => {
    e.preventDefault();
    submitSizeLimit({}, () => {
      refresh();
      closeDialog();
    });
  };

  return (
    <form onSubmit={updateSizeLimit}>
      <Stack spacing={2} py={2}>
        <TextField
          type="number"
          label="Size Limit"
          helperText="in bytes (1 MB = 1000000 B)"
          fullWidth
          value={sizeLimit}
          onChange={(e) => setSizeLimit(e.target.value)}
        />
        <Box textAlign="end">
          <Button
            type="submit"
            variant="contained"
            disableElevation
            disabled={isLoading(status)}
          >
            {isLoading(status) ? "Submitting..." : "Submit"}
          </Button>
        </Box>
      </Stack>
    </form>
  );
};

export default SizeLimitForm;
