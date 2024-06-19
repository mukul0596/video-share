import React from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  CircularProgress,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import useAxios from "../../hooks/useAxios";
import { isLoading, isSuccess } from "../../utils/statusHelpers";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";
import MySwal from "../../utils/swal";
import { useDialog } from "../../Context/DialogContext";
import ShareForm from "../../Components/ShareForm";
import { getUserData } from "../../utils/auth";

const Preview = () => {
  const { id } = useParams();
  const { openDialog } = useDialog();
  const user = getUserData();

  const [{ data, status }] = useAxios({
    method: "GET",
    url: `/file/${id}`,
  });

  const [{ data: videoData, status: videoStatus }] = useAxios({
    method: "GET",
    url: `/file/stream/${id}`,
    responseType: "blob",
    headers: {
      Range: "bytes=0-",
    },
  });
  let videoObjectUrl;
  if (isSuccess(videoStatus)) {
    const videoBlob = new Blob([videoData], {
      type: videoData?.type,
    });
    videoObjectUrl = URL.createObjectURL(videoBlob);
  }

  const [{}, downloadRequest] = useAxios(
    {
      method: "GET",
      url: `/file/download/${id}`,
      responseType: "blob",
    },
    { manual: true }
  );

  const downloadFileFromBlob = (resData) => {
    const url = window.URL.createObjectURL(new Blob([resData]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", data.file.originalName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    MySwal.showSuccess({
      title: "Downloaded",
      text: `${data.originalName} has been downloaded.`,
    });
  };

  return (
    <Stack spacing={3} p={4}>
      <Stack>
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography variant="h6" noWrap>
            {isSuccess(status) ? data.file.originalName : ""}
          </Typography>
          {isSuccess(status) && isSuccess(videoStatus) && (
            <Stack direction="row" spacing={1}>
              <IconButton
                color="primary"
                size="small"
                onClick={() => {
                  MySwal.showLoader({ title: "Processing..." });
                  downloadRequest({}, downloadFileFromBlob);
                }}
              >
                <DownloadOutlinedIcon />
              </IconButton>
              {user.id &&
                (data.file.uploadedBy._id === user.id ||
                  data.file.uploadedBy.managedBy === user.id) && (
                  <IconButton
                    color="primary"
                    size="small"
                    onClick={() => {
                      openDialog(
                        `Share '${data.file.originalName}'`,
                        <ShareForm fileId={id} />
                      );
                    }}
                  >
                    <PersonAddAltOutlinedIcon />
                  </IconButton>
                )}
            </Stack>
          )}
        </Stack>
      </Stack>
      <Box display="flex" justifyContent="center">
        {isLoading(videoStatus) && <CircularProgress />}
        {isSuccess(videoStatus) && (
          <video
            style={{ maxWidth: "100%", maxHeight: "calc(100dvh - 140px)" }}
            controls
          >
            <source src={videoObjectUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}
      </Box>
    </Stack>
  );
};

export default Preview;
