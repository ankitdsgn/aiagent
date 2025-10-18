"use client"; // required for useState/useEffect in Next.js App Router

import * as React from "react";
import { Box, LinearProgress } from "@mui/material";

export default function LinearDeterminate() {
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) =>
        oldProgress === 100
          ? 0
          : Math.min(oldProgress + Math.random() * 10, 100)
      );
    }, 500);

    return () => clearInterval(timer);
  }, []);

  return (
    <Box sx={{ width: "625px" }}>
      <LinearProgress
        variant="determinate"
        value={progress}
        // ✅ MUI built-in color prop (theme palette)
        color="success"
        // ✅ Optional custom override
        sx={{
          height: 6,
          borderRadius: 4,
          backgroundColor: "#EBEBEB", // track
          "& .MuiLinearProgress-bar": {
            backgroundColor: "#6A57C8", // bar
          },
        }}
      />
    </Box>
  );
}
