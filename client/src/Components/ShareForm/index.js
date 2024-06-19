import React from "react";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  MenuItem,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import useAxios from "../../hooks/useAxios";
import { isLoading, isSuccess } from "../../utils/statusHelpers";
import { useDialog } from "../../Context/DialogContext";
import MySwal from "../../utils/swal";

const AddAccessForm = ({ fileId, refresh }) => {
  const [username, setUsername] = React.useState("");
  const [{ status }, submit] = useAxios(
    {
      method: "POST",
      url: "/file/share",
      data: {
        fileId,
        username,
      },
    },
    { manual: true }
  );
  return (
    <Stack direction="row" spacing={1}>
      <TextField
        label="Username"
        size="small"
        fullWidth
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <Button
        variant="contained"
        disableElevation
        disabled={isLoading(status)}
        onClick={() => submit({}, refresh)}
      >
        Add
      </Button>
    </Stack>
  );
};

const ShareForm = ({ fileId }) => {
  const { closeDialog } = useDialog();
  const [{ data, status }, refresh] = useAxios({
    method: "GET",
    url: `/file/shared-with/${fileId}`,
  });

  const [{ status: updateStatus }, updateAccess] = useAxios(
    {
      method: "POST",
      url: "/file/share",
    },
    { manual: true }
  );

  const [{ status: removeStatus }, removeUser] = useAxios(
    {
      method: "DELETE",
    },
    { manual: true }
  );

  return isSuccess(status) ? (
    <Stack spacing={2}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="body1" fontWeight="bold" noWrap>
          Anyone with the link
        </Typography>
        <Switch
          checked={data?.isPublic}
          disabled={isLoading(updateStatus)}
          onChange={(e) =>
            updateAccess(
              {
                data: {
                  fileId,
                  isPublic: e.target.checked,
                },
              },
              refresh
            )
          }
        />
      </Stack>
      {!data?.isPublic && (
        <>
          <AddAccessForm fileId={fileId} refresh={refresh} />
          <Stack spacing={1}>
            <Typography variant="body2" fontWeight="bold">
              People with access:
            </Typography>
            <Box>
              <MenuItem
                component={Stack}
                disableRipple
                direction="row"
                justifyContent="space-between !important"
                alignItems="center"
                spacing={1}
              >
                <Typography variant="body2">
                  {data.owner.username} (owner)
                </Typography>
              </MenuItem>
              {data.sharedWithUsers.map((user) => (
                <MenuItem
                  component={Stack}
                  disableRipple
                  direction="row"
                  justifyContent="space-between !important"
                  alignItems="center"
                  spacing={1}
                >
                  <Typography variant="body2">{user.username}</Typography>
                  <IconButton
                    size="small"
                    disabled={isLoading(removeStatus)}
                    onClick={() =>
                      removeUser(
                        {
                          url: `/file/shared-with/${fileId}/${user?._id}`,
                        },
                        refresh
                      )
                    }
                  >
                    <CloseOutlinedIcon fontSize="small" />
                  </IconButton>
                </MenuItem>
              ))}
            </Box>
          </Stack>
        </>
      )}
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Button
          variant="outlined"
          disableElevation
          onClick={() => {
            navigator.clipboard.writeText(
              `${window.location.origin}/file/${fileId}`
            );
            MySwal.toast({ title: "Link copied!" });
          }}
        >
          Copy Link
        </Button>
        <Button variant="contained" disableElevation onClick={closeDialog}>
          Done
        </Button>
      </Stack>
    </Stack>
  ) : (
    <Box textAlign="center">
      <CircularProgress />
    </Box>
  );
};

export default ShareForm;
