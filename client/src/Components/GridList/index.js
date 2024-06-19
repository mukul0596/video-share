import React from "react";
import { Grid } from "@mui/material";
import { v4 as uuidv4 } from "uuid";

const GridList = ({
  items,
  sourceName,
  ItemComponent,
  itemsPerRow,
  gapBetweenItems,
}) => {
  return (
    <Grid container spacing={gapBetweenItems}>
      {items?.map((item) => (
        <Grid
          key={uuidv4()}
          item
          xs={12 / itemsPerRow.xs}
          sm={12 / itemsPerRow.sm}
          md={12 / itemsPerRow.md}
          lg={12 / itemsPerRow.lg}
          display="flex"
          alignItems="stretch"
        >
          <ItemComponent {...(sourceName && { [sourceName]: item })} />
        </Grid>
      ))}
    </Grid>
  );
};

export default GridList;
