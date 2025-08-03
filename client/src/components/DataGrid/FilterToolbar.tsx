import React from "react";
import {
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Toolbar,
  Card,
  SelectChangeEvent,
} from "@mui/material";
import { FilterToolbarProps, FilterOperator } from "../../types";

const FilterToolbar: React.FC<FilterToolbarProps> = ({
  onSearch,
  onFilter,
  searchTerm,
  filters,
  columns,
}) => {
  const filterOperators: FilterOperator[] = [
    "contains",
    "equals",
    "starts with",
    "ends with",
    "is empty",
    "greater than",
    "less than",
  ];

  const handleColumnChange = (event: SelectChangeEvent<string>) => {
    onFilter({ ...filters, column: event.target.value });
  };

  const handleOperatorChange = (event: SelectChangeEvent<FilterOperator>) => {
    onFilter({ ...filters, operator: event.target.value as FilterOperator });
  };

  const handleValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onFilter({ ...filters, value: event.target.value });
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(event.target.value);
  };

  return (
    <Card sx={{ mb: 2 }}>
      <Toolbar sx={{ gap: 2, flexWrap: "wrap" }}>
        <TextField
          label="Search..."
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={handleSearchChange}
          sx={{ minWidth: 200 }}
        />

        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Column</InputLabel>
          <Select
            value={filters.column || ""}
            label="Column"
            onChange={handleColumnChange}
          >
            {columns.map((col) => (
              <MenuItem key={col.field} value={col.field}>
                {col.headerName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Operator</InputLabel>
          <Select
            value={filters.operator}
            label="Operator"
            onChange={handleOperatorChange}
          >
            {filterOperators.map((op) => (
              <MenuItem key={op} value={op}>
                {op}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Value"
          variant="outlined"
          size="small"
          value={filters.value || ""}
          onChange={handleValueChange}
          sx={{ minWidth: 150 }}
        />
      </Toolbar>
    </Card>
  );
};

export default FilterToolbar;
