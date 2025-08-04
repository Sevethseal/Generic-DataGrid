// src/components/DataGrid/DataGrid.tsx
import React, {
  useMemo,
  useRef,
  useState,
  useCallback,
  ChangeEvent,
} from "react";
import { AgGridReact } from "ag-grid-react";
import {
  Paper,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Grid,
} from "@mui/material";
import { ColDef, GridApi, RowNode, GridReadyEvent } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import FilterToolbar from "./FilterToolbar";
import ActionRenderer from "./ActionRenderer";
import { DataGridProps } from "../../types";
import { createItem } from "../../services/api";

const STATIC_COLUMN_DEFS: ColDef[] = [
  {
    field: "Brand",
    headerName: "Brand",
    sortable: true,
    filter: true,
    resizable: true,
  },
  {
    field: "Model",
    headerName: "Model",
    sortable: true,
    filter: true,
    resizable: true,
  },
  {
    field: "AccelSec",
    headerName: "0–100 km/h (s)",
    sortable: true,
    filter: true,
    resizable: true,
  },
  {
    field: "TopSpeed_KmH",
    headerName: "Top Speed (km/h)",
    sortable: true,
    filter: true,
    resizable: true,
  },
  {
    field: "Range_Km",
    headerName: "Range (km)",
    sortable: true,
    filter: true,
    resizable: true,
  },
  {
    field: "Efficiency_WhKm",
    headerName: "Efficiency (Wh/km)",
    sortable: true,
    filter: true,
    resizable: true,
  },
  {
    field: "FastCharge_KmH",
    headerName: "Fast-Charge (km/h)",
    sortable: true,
    filter: true,
    resizable: true,
  },
  {
    field: "RapidCharge",
    headerName: "Rapid-Charge",
    sortable: true,
    filter: true,
    resizable: true,
  },
  {
    field: "PowerTrain",
    headerName: "Powertrain",
    sortable: true,
    filter: true,
    resizable: true,
  },
  {
    field: "PlugType",
    headerName: "Plug Type",
    sortable: true,
    filter: true,
    resizable: true,
  },
  {
    field: "BodyStyle",
    headerName: "Body Style",
    sortable: true,
    filter: true,
    resizable: true,
  },
  {
    field: "Segment",
    headerName: "Segment",
    sortable: true,
    filter: true,
    resizable: true,
  },
  {
    field: "Seats",
    headerName: "Seats",
    sortable: true,
    filter: true,
    resizable: true,
  },
  {
    field: "PriceEuro",
    headerName: "Price (€)",
    sortable: true,
    filter: true,
    resizable: true,
  },
  {
    field: "Date",
    headerName: "Date",
    sortable: true,
    filter: true,
    resizable: true,
  },
];

interface ExtendedDataGridProps extends DataGridProps {
  /** Callback to add a new row via API */
  onRefresh: () => Promise<void>;
}

const DataGrid: React.FC<ExtendedDataGridProps> = ({
  data,
  loading,
  onSearch,
  onFilter,
  searchTerm,
  filters,
  onRefresh,
}) => {
  // reference to AG Grid API
  const gridApiRef = useRef<GridApi | null>(null);

  // capture the grid API once ready
  const onGridReady = useCallback((event: GridReadyEvent) => {
    gridApiRef.current = event.api;
  }, []);

  // state for dialog
  const [open, setOpen] = useState(false);
  const [newRowData, setNewRowData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Validation logic
  const validate = (formData: Record<string, any>) => {
    const newErrors: Record<string, string> = {};

    // Required string fields
    [
      "Brand",
      "Model",
      "RapidCharge",
      "PowerTrain",
      "PlugType",
      "BodyStyle",
      "Segment",
    ].forEach((field) => {
      if (!formData[field] || String(formData[field]).trim() === "") {
        newErrors[field] = `${field} is required`;
      }
    });

    // Numeric fields
    [
      "AccelSec",
      "TopSpeed_KmH",
      "Range_Km",
      "Efficiency_WhKm",
      "FastCharge_KmH",
      "Seats",
      "PriceEuro",
    ].forEach((field) => {
      const val = formData[field];
      if (val === undefined || val === null || String(val).trim() === "") {
        newErrors[field] = `${field} is required`;
      } else if (isNaN(Number(val))) {
        newErrors[field] = `${field} must be a number`;
      }
    });

    // Date field
    if (!formData.Date) {
      newErrors.Date = "Date is required";
    } else if (isNaN(new Date(formData.Date).getTime())) {
      newErrors.Date = "Date is invalid";
    }

    return newErrors;
  };

  const handleOpen = () => {
    // initialize form state
    const init: Record<string, any> = {};
    STATIC_COLUMN_DEFS.forEach((col) => {
      init[col.field!] = "";
    });
    setNewRowData(init);
    setErrors({});
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setNewRowData({});
    setErrors({});
  };

  const handleChange =
    (field: string) => (e: ChangeEvent<HTMLInputElement>) => {
      const updated = { ...newRowData, [field]: e.target.value };
      setNewRowData(updated);
      setErrors(validate(updated));
    };

  const handleSubmit = async () => {
    const validationErrors = validate(newRowData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await createItem(newRowData);
      setOpen(false);
      setNewRowData({});
      setErrors({});
      await onRefresh();
    } catch (err) {
      console.error("Failed to add row:", err);
      alert("Failed to add row");
    }
  };

  // build column definitions including actions
  const columnDefs = useMemo<ColDef[]>(
    () => [
      ...STATIC_COLUMN_DEFS,
      {
        headerName: "Actions",
        field: "actions",
        cellRenderer: ActionRenderer,
        cellRendererParams: {
          onRefresh,
        },
        width: 120,
        pinned: "right",
        sortable: false,
        filter: false,
      },
    ],
    []
  );

  // default column settings
  const defaultColDef: ColDef = useMemo(
    () => ({
      sortable: true,
      filter: true,
      resizable: true,
      minWidth: 100,
      editable: true,
    }),
    []
  );

  return (
    <>
      <Paper elevation={3}>
        {/* Add New Row button */}
        <Box sx={{ p: 1, display: "flex", justifyContent: "flex-end" }}>
          <Button variant="contained" color="primary" onClick={handleOpen}>
            Add New Row
          </Button>
        </Box>

        <FilterToolbar
          onSearch={onSearch}
          onFilter={onFilter}
          searchTerm={searchTerm}
          filters={filters}
          columns={STATIC_COLUMN_DEFS.map((col) => ({
            headerName: col.headerName!,
            field: col.field!,
          }))}
        />

        <Box sx={{ height: "70vh", width: "100%" }}>
          <div
            className="ag-theme-alpine"
            style={{ height: "100%", width: "100%" }}
          >
            <AgGridReact
              onGridReady={onGridReady}
              rowData={data}
              columnDefs={columnDefs}
              defaultColDef={{
                ...defaultColDef,
                editable: false,
              }}
              pagination
              paginationPageSize={10}
              loading={loading}
            />
          </div>
        </Box>
      </Paper>

      {/* Modal for adding new row */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Add New Row</DialogTitle>
        <DialogContent dividers>
          {/* Show validation errors as an alert */}
          {Object.keys(errors).length > 0 && (
            <Alert severity="error" sx={{ mb: 2 }}>
              Please fix the following errors:{" "}
              {Object.values(errors).join(" • ")}
            </Alert>
          )}

          <Grid container spacing={2} sx={{ mt: 1 }}>
            {STATIC_COLUMN_DEFS.map((col) => (
              <Grid key={col.field}>
                <TextField
                  fullWidth
                  label={col.headerName}
                  value={newRowData[col.field!] || ""}
                  onChange={handleChange(col.field!)}
                  variant="outlined"
                  size="small"
                  error={Boolean(errors[col.field!])}
                  helperText={errors[col.field!] || " "}
                  type={
                    [
                      "AccelSec",
                      "TopSpeed_KmH",
                      "Range_Km",
                      "Efficiency_WhKm",
                      "FastCharge_KmH",
                      "Seats",
                      "PriceEuro",
                    ].includes(col.field!)
                      ? "number"
                      : "text"
                  }
                />
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            color="primary"
            disabled={Object.keys(errors).length > 0}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DataGrid;