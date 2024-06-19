import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import useAxios from "../../hooks/useAxios";
import MySwal from "../../utils/swal";
import { useDialog } from "../../Context/DialogContext";
import SizeLimitForm from "../SizeLimitForm";

const UserCard = ({ data, refresh }) => {
  const navigate = useNavigate();
  const { openDialog } = useDialog();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const [{}, deleteUser] = useAxios(
    {
      method: "DELETE",
      url: `/user/${data?._id}`,
    },
    { manual: true }
  );

  const options = [
    {
      label: "Show Files",
      onClick: () => navigate(`/dashboard/${data._id}`),
    },
    {
      label: "Edit Size Limit",
      onClick: () =>
        openDialog(
          `Size Limit: ${data.username}`,
          <SizeLimitForm
            currSizeLimit={data.sizeLimit}
            userId={data._id}
            refresh={refresh}
          />
        ),
    },
    {
      label: "Delete",
      onClick: () => {
        MySwal.showLoader({ title: "Processing..." });
        deleteUser({}, () => {
          refresh();
          MySwal.showSuccess({
            title: "Deleted",
            text: `${data.username} has been deleted successfully.`,
          });
        });
      },
    },
  ];

  return (
    <Card sx={{ width: "100%" }}>
      <CardContent sx={{ p: 1.5, pb: 0 }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={0.5}
        >
          <Typography variant="caption" fontWeight="bold" noWrap>
            {data.username}
          </Typography>
          <IconButton
            size="small"
            sx={{ p: 0.25 }}
            onClick={(e) => {
              e.stopPropagation();
              setAnchorEl(e.currentTarget);
            }}
          >
            <MoreVertIcon fontSize="small" />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "center",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
          >
            {options.map((option) => (
              <MenuItem
                key={option.label}
                onClick={() => {
                  setAnchorEl(null);
                  option.onClick();
                }}
              >
                <Typography textAlign="center">{option.label}</Typography>
              </MenuItem>
            ))}
          </Menu>
        </Stack>
        <Stack alignItems="flex-start">
          <Typography variant="caption" noWrap>
            Size Limit: {data.sizeLimit} B
          </Typography>
          <Typography variant="caption" noWrap>
            Used: {data.totalStorageUsed} B
          </Typography>
        </Stack>
      </CardContent>
      <CardMedia
        sx={{
          display: "flex",
          justifyContent: "center",
          m: 1.5,
          p: 2,
          bgcolor: "grey.200",
        }}
      >
        <Avatar sx={{ width: 80, height: 80, fontSize: 50, color: "grey.500" }}>
          {data.username.charAt(0).toUpperCase()}
        </Avatar>
      </CardMedia>
    </Card>
  );
};

export default UserCard;
