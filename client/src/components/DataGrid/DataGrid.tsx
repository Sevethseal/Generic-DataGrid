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
  Chip,
} from "@mui/material";
import {
  ColDef,
  GridApi,
  RowNode,
  GridReadyEvent,
  SelectionChangedEvent,
} from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import FilterToolbar from "./FilterToolbar";
import ActionRenderer from "./ActionRenderer";
import { DataGridProps } from "../../types";
import { createItem } from "../../services/api";
import { useHistory } from "react-router-dom"; // For React Router v5

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

// OpenAI API service
const compareWithChatGPT = async (selectedRows: any[]): Promise<string> => {
  try {
    const prompt = `Compare these electric vehicles and provide insights on their performance, efficiency, and value proposition:

${selectedRows
  .map(
    (row, index) =>
      `Vehicle ${index + 1}: ${row.Brand} ${row.Model}
- 0-100 km/h: ${row.AccelSec}s
- Top Speed: ${row.TopSpeed_KmH} km/h
- Range: ${row.Range_Km} km
- Efficiency: ${row.Efficiency_WhKm} Wh/km
- Fast Charge: ${row.FastCharge_KmH} km/h
- Price: €${row.PriceEuro}
- Body Style: ${row.BodyStyle}
- Segment: ${row.Segment}
- Seats: ${row.Seats}
- Powertrain: ${row.PowerTrain}
`
  )
  .join("\n\n")}

Please provide a detailed comparison covering:
1. Performance analysis
2. Efficiency comparison
3. Value for money assessment
4. Use case recommendations
5. Overall ranking and recommendation`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`, // Make sure to set this in your .env file
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 2000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    throw error;
  }
};

const DataGrid: React.FC<ExtendedDataGridProps> = ({
  data,
  loading,
  onSearch,
  onFilter,
  searchTerm,
  filters,
  onRefresh,
}) => {
  const history = useHistory();

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

  // state for row selection
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [isComparing, setIsComparing] = useState(false);

  // Handle selection change
  const onSelectionChanged = useCallback((event: SelectionChangedEvent) => {
    const selected = event.api.getSelectedRows();

    // Limit selection to maximum 5 rows
    if (selected.length > 5) {
      // Deselect the last selected row
      const nodesToDeselect = event.api.getSelectedNodes().slice(5);
      nodesToDeselect.forEach((node) => node.setSelected(false));
      setSelectedRows(selected.slice(0, 5));
    } else {
      setSelectedRows(selected);
    }
  }, []);

  // Handle compare with ChatGPT
  const handleCompareWithChatGPT = async () => {
    if (selectedRows.length < 2) {
      alert("Please select at least 2 rows to compare");
      return;
    }

    setIsComparing(true);
    try {
      const comparison = await compareWithChatGPT(selectedRows);

      // Navigate to comparison page with data
      history.push("/comparison", {
        selectedVehicles: selectedRows,
        comparison: comparison,
      });
    } catch (error) {
      console.error("Failed to get comparison:", error);
      alert("Failed to get comparison from ChatGPT. Please try again.");
    } finally {
      setIsComparing(false);
    }
  };

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

  // build column definitions including checkbox selection and actions
  const columnDefs = useMemo<ColDef[]>(
    () => [
      {
        checkboxSelection: true,
        headerCheckboxSelection: true,
        width: 50,
        pinned: "left",
        sortable: false,
        filter: false,
        resizable: false,
      },
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
        {/* Action buttons and selection info */}
        <Box
          sx={{
            p: 1,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {selectedRows.length > 0 && (
              <Chip
                label={`${selectedRows.length} selected (max 5)`}
                color={selectedRows.length >= 5 ? "warning" : "primary"}
                variant="outlined"
              />
            )}
            {selectedRows.length >= 2 && (
              <Button
                variant="contained"
                color="secondary"
                onClick={handleCompareWithChatGPT}
                disabled={isComparing}
                sx={{ ml: 1 }}
              >
                {isComparing ? "Comparing..." : "Compare with ChatGPT"}
              </Button>
            )}
          </Box>

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
              rowSelection="multiple"
              onSelectionChanged={onSelectionChanged}
              suppressRowClickSelection={true}
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
