import React, { useState } from "react";
import {
  IconButton,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  TextField,
  Grid,
  Alert,
} from "@mui/material";
import { Visibility, Edit, Delete } from "@mui/icons-material";
import { useHistory } from "react-router-dom";
import { ActionRendererProps } from "../../types";
import { deleteItem, updateItem } from "../../services/api";

const ActionRenderer: React.FC<ActionRendererProps> = ({ data, onRefresh }) => {
  const history = useHistory();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  // helper to compute an ID for routing
  const resolveId = (): string =>
    (data.id as string) ||
    `${data.Brand}_${data.Model}` ||
    Math.random().toString(36).substring(2);

  const handleView = (): void => {
    const id = resolveId();
    history.push(`/detail/${encodeURIComponent(id)}`, { data });
  };

  const handleEdit = (): void => {
    setEditFormData({ ...data });
    setErrors({});
    setEditModalOpen(true);
  };

  const handleEditModalClose = (): void => {
    setEditModalOpen(false);
    setEditFormData({});
    setErrors({});
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

  const handleFormChange = (field: string, value: any): void => {
    const updated = { ...editFormData, [field]: value };
    setEditFormData(updated);
    setErrors(validate(updated));
  };

  const handleFormSubmit = async (): Promise<void> => {
    const validationErrors = validate(editFormData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    try {
      await updateItem(editFormData.id, editFormData);
      setEditModalOpen(false);
      setEditFormData({});
      await onRefresh();
    } catch (err) {
      console.error("Update Error:", err);
    }
  };

  // Delete dialog handlers
  const openDeleteDialog = (): void => {
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = (): void => {
    setDeleteDialogOpen(false);
  };

  const handleDeleteConfirm = async (): Promise<void> => {
    closeDeleteDialog();
    if (data.id !== undefined && data.id !== null) {
      try {
        await deleteItem(String(data.id));
        await onRefresh();
      } catch (err) {
        console.error("Delete Error:", err);
      }
    } else {
      console.error("Cannot delete item: id is undefined or null");
    }
  };

  const renderFormFields = () =>
    Object.keys(editFormData).map((key) => {
      if (key === "id" || key === "_id") {
        return null;
      }
      return (
        <Grid key={key}>
          <TextField
            fullWidth
            label={key.charAt(0).toUpperCase() + key.slice(1)}
            value={editFormData[key] || ""}
            onChange={(e) => handleFormChange(key, e.target.value)}
            variant="outlined"
            size="small"
            error={Boolean(errors[key])}
            helperText={errors[key] || " "}
            type={
              [
                "AccelSec",
                "TopSpeed_KmH",
                "Range_Km",
                "Efficiency_WhKm",
                "FastCharge_KmH",
                "Seats",
                "PriceEuro",
              ].includes(key)
                ? "number"
                : "text"
            }
          />
        </Grid>
      );
    });

  return (
    <>
      <Box
        sx={{
          display: "flex",
          gap: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <IconButton size="small" color="primary" onClick={handleView}>
          <Visibility fontSize="small" />
        </IconButton>
        <IconButton size="small" color="warning" onClick={handleEdit}>
          <Edit fontSize="small" />
        </IconButton>
        <IconButton size="small" color="error" onClick={openDeleteDialog}>
          <Delete fontSize="small" />
        </IconButton>
      </Box>

      {/* Edit Modal */}
      <Dialog
        open={editModalOpen}
        onClose={handleEditModalClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Edit Item</DialogTitle>
        <DialogContent>
          {Object.keys(errors).length > 0 && (
            <Alert severity="error" sx={{ mb: 2 }}>
              Please fix the following errors:{" "}
              {Object.values(errors).join(" • ")}
            </Alert>
          )}
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {renderFormFields()}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditModalClose} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleFormSubmit}
            color="primary"
            variant="contained"
            disabled={Object.keys(errors).length > 0}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={closeDeleteDialog}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete this item? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ActionRenderer;
