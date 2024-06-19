import React from "react";
import useAxios from "../../hooks/useAxios";
import DashboardLayout from "../../Layouts/DashboardLayout";
import { Box, CircularProgress, Stack, Typography } from "@mui/material";
import FileCard from "../../Components/FileCard";
import { isLoading, isSuccess } from "../../utils/statusHelpers";
import GridList from "../../Components/GridList";
import { useParams } from "react-router-dom";

const UserFiles = () => {
  const { userId } = useParams();
  const [{ data, status }, refresh] = useAxios({
    method: "GET",
    url: `/file/${userId}/files`,
  });
  return (
    <DashboardLayout>
      <Stack spacing={2}>
        {isSuccess(status) && (
          <>
            <Typography variant="h6">{data.user.username}'s Files</Typography>
            <Box textAlign="center">
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
            </Box>
          </>
        )}
        {isLoading(status) && (
          <Box textAlign="center">
            <CircularProgress />
          </Box>
        )}
      </Stack>
    </DashboardLayout>
  );
};

export default UserFiles;
