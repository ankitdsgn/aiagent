"use client";

import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

export default function Loader() {
  return (
    <Box>
      <CircularProgress
        size={28}
        style={{
          color: "#AC98ED",
        }}
      />
    </Box>
  );
}
