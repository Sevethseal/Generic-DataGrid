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
} from "@mui/material";
import { ColDef, GridApi, RowNode, GridReadyEvent } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import FilterToolbar from "./FilterToolbar";
import ActionRenderer from "./ActionRenderer";
import { DataGridProps } from "../../types";

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
  onAddRow?: (newRow: Record<string, any>) => Promise<void>;
}

const DataGrid: React.FC<ExtendedDataGridProps> = ({
  data,
  loading,
  onSearch,
  onFilter,
  searchTerm,
  filters,
  onAddRow,
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

  const handleOpen = () => {
    // initialize form state
    const init: Record<string, any> = {};
    STATIC_COLUMN_DEFS.forEach((col) => {
      init[col.field!] = "";
    });
    setNewRowData(init);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange =
    (field: string) => (e: ChangeEvent<HTMLInputElement>) => {
      setNewRowData((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleSubmit = async () => {
    try {
      if (onAddRow) {
        await onAddRow(newRowData);
      } else {
        // fallback: directly add to grid
        const api = gridApiRef.current;
        if (api) {
          api.applyTransaction({ add: [newRowData] });
        }
      }
      setOpen(false);
    } catch (err) {
      console.error("Failed to add row", err);
      // show error feedback as needed
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
              defaultColDef={defaultColDef}
              pagination
              paginationPageSize={10}
              loading={loading}
              suppressRowClickSelection
            />
          </div>
        </Box>
      </Paper>

      {/* Modal for adding new row */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Row</DialogTitle>
        <DialogContent dividers>
          {STATIC_COLUMN_DEFS.map((col) => (
            <TextField
              key={col.field}
              margin="dense"
              label={col.headerName}
              fullWidth
              value={newRowData[col.field!] || ""}
              onChange={handleChange(col.field!)}
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DataGrid;
