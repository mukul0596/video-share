import React from "react";
import useAxios from "../../hooks/useAxios";
import DashboardLayout from "../../Layouts/DashboardLayout";
import {
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import FileCard from "../../Components/FileCard";
import { isLoading, isSuccess } from "../../utils/statusHelpers";
import GridList from "../../Components/GridList";
import { useDialog } from "../../Context/DialogContext";
import VideoUpload from "../../Components/VideoUpload";

const MyFiles = () => {
  const { openDialog } = useDialog();
  const [{ data, status }, refresh] = useAxios({
    method: "GET",
    url: "/file/my",
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
          <Typography variant="h6">My Files</Typography>
          <Button
            variant="contained"
            disableElevation
            onClick={() =>
              openDialog("Upload New", <VideoUpload refresh={refresh} />)
            }
          >
            Upload New
          </Button>
        </Stack>
        <Box textAlign="center">
          {isSuccess(status) && (
            <GridList
              items={data.files}
              sourceName="data"
              ItemComponent={(props) => (
                <FileCard {...props} refresh={refresh} />
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

export default MyFiles;
