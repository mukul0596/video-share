import React from "react";
import {
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";
import VideoFileIcon from "@mui/icons-material/VideoFile";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useNavigate } from "react-router-dom";
import useAxios from "../../hooks/useAxios";
import MySwal from "../../utils/swal";
import { useDialog } from "../../Context/DialogContext";
import ShareForm from "../ShareForm";
import { getUserData } from "../../utils/auth";

const FileCard = ({ data, refresh }) => {
  const navigate = useNavigate();
  const { openDialog } = useDialog();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const user = getUserData();

  const [{}, downloadRequest] = useAxios(
    {
      method: "GET",
      url: `/file/download/${data?._id}`,
      responseType: "blob",
    },
    { manual: true }
  );

  const downloadFileFromBlob = (resData) => {
    const url = window.URL.createObjectURL(new Blob([resData]));

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", data.originalName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    MySwal.showSuccess({
      title: "Downloaded",
      text: `${data.originalName} has been downloaded.`,
    });
  };

  const [{}, deleteFileReq] = useAxios(
    {
      method: "DELETE",
      url: `/file/${data?._id}`,
    },
    { manual: true }
  );

  const options = [
    {
      label: "Preview",
      onClick: () => navigate(`/file/${data._id}`),
    },
    {
      label: "Download",
      onClick: () => {
        MySwal.showLoader({ title: "Processing..." });
        downloadRequest({}, downloadFileFromBlob);
      },
    },
    ...(user.id &&
    (data.uploadedBy._id === user.id || data.uploadedBy.managedBy === user.id)
      ? [
          {
            label: "Share",
            onClick: () => {
              openDialog(
                `Share '${data.originalName}'`,
                <ShareForm fileId={data._id} />
              );
            },
          },
          {
            label: "Delete",
            onClick: () => {
              MySwal.showLoader({ title: "Processing..." });
              deleteFileReq({}, () => {
                refresh();
                MySwal.showSuccess({
                  title: "Deleted",
                  text: `${data.originalName} has been deleted successfully.`,
                });
              });
            },
          },
        ]
      : []),
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
            {data.originalName}
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
        <VideoFileIcon sx={{ fontSize: 80, color: "grey.500" }} />
      </CardMedia>
    </Card>
  );
};

export default FileCard;
