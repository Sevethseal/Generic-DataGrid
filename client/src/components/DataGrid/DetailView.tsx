import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Box,
  Button,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { useHistory } from "react-router-dom";
import { DetailViewProps } from "../../types";

const DetailView: React.FC<DetailViewProps> = ({ data }) => {
  const history = useHistory();

  const handleBack = (): void => {
    history.push("/");
  };
  console.log("DetailView data:", data);
  if (!data) {
    return (
      <Card>
        <CardContent>
          <Typography>No data available</Typography>
        </CardContent>
      </Card>
    );
  }

  const formatFieldName = (key: string): string => {
    return key.replace(/([A-Z])/g, " $1").trim();
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
    return value?.toString() || "N/A";
  };

  return (
    <Box>
      <Button startIcon={<ArrowBack />} onClick={handleBack} sx={{ mb: 2 }}>
        Back to Grid
      </Button>

      <Card>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            {data.Brand} {data.Model}
          </Typography>

          <Grid container spacing={3}>
            {Object.entries(data).map(([key, value]) => (
              <Grid key={key}>
                <Box>
                  <Typography variant="h6" color="primary">
                    {formatFieldName(key)}
                  </Typography>
                  <Typography variant="body1">
                    {renderFieldValue(value)}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default DetailView;
