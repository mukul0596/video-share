import React, { useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import useAxios from "../../hooks/useAxios";
import MySwal from "../../utils/swal";
import { useDialog } from "../../Context/DialogContext";

const VideoUpload = ({ refresh }) => {
  const { closeDialog } = useDialog();
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const [{}, uploadVideo] = useAxios(
    { method: "POST", url: "/file/upload" },
    { manual: true }
  );

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file first.");
      return;
    }

    MySwal.showLoader({ title: "Loading..." });

    const formData = new FormData();
    formData.append("file", selectedFile, selectedFile.name);
    uploadVideo({ data: formData }, () => {
      refresh();
      closeDialog();
      MySwal.showSuccess({
        title: "Uploaded",
        text: `${selectedFile.name} has been uploaded successfully.`,
      });
    });
  };

  return (
    <Box
      sx={{
        border: "2px dashed #ccc",
        borderRadius: "8px",
        padding: "20px",
        textAlign: "center",
        minHeight: "200px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      {!selectedFile ? (
        <>
          <Typography variant="body1">
            Drag and drop a video file here or click to select
          </Typography>
          <input
            type="file"
            accept="video/*"
            style={{ display: "none" }}
            id="upload-button"
            onChange={handleFileChange}
          />
          <label htmlFor="upload-button">
            <Button
              variant="contained"
              color="primary"
              component="span"
              disableElevation
            >
              Select Video
            </Button>
          </label>
        </>
      ) : (
        <>
          <video
            controls
            src={URL.createObjectURL(selectedFile)}
            width="100%"
            style={{ marginBottom: "10px" }}
          />
          <Button variant="contained" color="primary" onClick={handleUpload}>
            Upload Video
          </Button>
        </>
      )}
    </Box>
  );
};

export default VideoUpload;
