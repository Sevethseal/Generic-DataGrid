import React from "react";
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  Grid,
  Chip,
  Box,
  Button,
  Divider,
  Stack,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { useHistory } from "react-router-dom";
import { DetailViewProps } from "../../types";


const fieldLabels: Record<string, string> = {
  brand: "Brand",
  model: "Model",
  price: "Price",
  horsepower: "Horsepower",
  torque: "Torque",
  fastchargekm: "Fast Charge (km)",
};

const DetailView: React.FC<DetailViewProps> = ({ data }) => {
  const history = useHistory();

  const handleBack = (): void => {
    history.push("/");
  };

  if (!data) {
    return (
      <Card sx={{ maxWidth: 600, mx: "auto", my: 4, p: 2 }}>
        <CardContent>
          <Typography variant="h6" align="center">
            No data available
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const normalizeKey = (key: string): string =>
    key.toLowerCase().replace(/[\s_]+/g, "");

  const formatFieldName = (key: string): string => {
    const norm = normalizeKey(key);
    return (
      fieldLabels[norm] ||
      key
        .replace(/([A-Z])/g, " $1")
        .replace(/[_]+/g, " ")
        .replace(/^./, (str) => str.toUpperCase())
    );
  };

  const renderFieldValue = (value: any): React.ReactNode => {
    if (typeof value === "boolean") {
      return (
        <Chip
          label={value ? "Yes" : "No"}
          color={value ? "success" : "default"}
          size="small"
        />
      );
    }

    if (value instanceof Date) {
      return value.toLocaleDateString();
    }

    return value?.toString() || "N/A";
  };

  const entries = Object.entries(data);

  return (
    <Box
      sx={{ p: 3, maxWidth: 900, mx: "auto", bgcolor: "background.default" }}
    >
      <Button
        startIcon={<ArrowBack />}
        onClick={handleBack}
        sx={{ mb: 3 }}
        variant="outlined"
      >
        Back to Grid
      </Button>

      <Card sx={{ boxShadow: 3 }}>
        <CardHeader title={`${data.Brand} ${data.Model}`} />
        <Divider />
        <CardContent>
          <Grid container spacing={2}>
            {entries.map(([key, value]) => (
              <Grid key={key}>
                <Stack
                  spacing={1}
                  sx={{
                    p: 2,
                    bgcolor: "background.paper",
                    borderRadius: 1,
                  }}
                >
                  <Typography variant="subtitle2" color="text.secondary">
                    {formatFieldName(key)}
                  </Typography>
                  <Typography variant="body1">
                    {renderFieldValue(value)}
                  </Typography>
                </Stack>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default DetailView;