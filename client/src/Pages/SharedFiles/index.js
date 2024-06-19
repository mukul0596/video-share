import React from "react";
import useAxios from "../../hooks/useAxios";
import DashboardLayout from "../../Layouts/DashboardLayout";
import { Box, CircularProgress, Grid, Stack, Typography } from "@mui/material";
import FileCard from "../../Components/FileCard";
import { isLoading, isSuccess } from "../../utils/statusHelpers";
import GridList from "../../Components/GridList";

const SharedFiles = () => {
  const [{ data, status }, refresh] = useAxios({
    method: "GET",
    url: "/file/shared",
  });
  return (
    <DashboardLayout>
      <Stack spacing={2}>
        <Typography variant="h6">Shared Files</Typography>
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

export default SharedFiles;
