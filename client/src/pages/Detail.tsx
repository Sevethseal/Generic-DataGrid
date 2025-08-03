import React from "react";
import { useLocation, useParams } from "react-router-dom";
import { Typography } from "@mui/material";
import DetailView from "../components/DataGrid/DetailView";
import { DataRow } from "../types";

interface LocationState {
  data: DataRow;
}

const Detail: React.FC = () => {
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const data = (location.state as LocationState)?.data || null;

  return (
    <>
      <Typography
        variant="h4"
        gutterBottom
        sx={{ color: "#1976d2", fontWeight: "bold" }}
      >
        Vehicle Details
      </Typography>
      <DetailView data={data} />
    </>
  );
};

export default Detail;
