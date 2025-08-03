import React from "react";
import { IconButton, Box } from "@mui/material";
import { Visibility, Edit, Delete } from "@mui/icons-material";
import { useHistory } from "react-router-dom";
import { ActionRendererProps } from "../../types";

const ActionRenderer: React.FC<ActionRendererProps> = ({ data }) => {
  const history = useHistory();

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
    const id = resolveId();
    history.push(`/edit/${encodeURIComponent(id)}`, { data });
  };

  const handleDelete = (): void => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      console.log("Delete item:", data);
      // TODO: call your delete API or callback here
    }
  };

  return (
    <Box sx={{ display: "flex", gap: 1 }}>
      <IconButton size="small" color="primary" onClick={handleView}>
        <Visibility fontSize="small" />
      </IconButton>

      <IconButton size="small" color="warning" onClick={handleEdit}>
        <Edit fontSize="small" />
      </IconButton>

      <IconButton size="small" color="error" onClick={handleDelete}>
        <Delete fontSize="small" />
      </IconButton>
    </Box>
  );
};

export default ActionRenderer;
