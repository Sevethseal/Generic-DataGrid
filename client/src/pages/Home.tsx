import React from "react";
import { Typography, Box } from "@mui/material";
import DataGrid from "../components/DataGrid/DataGrid";
import useDataGrid from "../hooks/useDataGrid";

const Home: React.FC = () => {
  const {
    data,
    loading,
    searchTerm,
    filters,
    handleSearch,
    handleFilter,
    loadData,
  } = useDataGrid();

  return (
    <Box>
      <Typography
        variant="h4"
        gutterBottom
        sx={{ color: "#1976d2", fontWeight: "bold" }}
      >
        Vehicle Data
      </Typography>
      <DataGrid
        data={data}
        loading={loading}
        onSearch={handleSearch}
        onFilter={handleFilter}
        searchTerm={searchTerm}
        filters={filters}
        onRefresh={loadData}
      />
    </Box>
  );
};

export default Home;
