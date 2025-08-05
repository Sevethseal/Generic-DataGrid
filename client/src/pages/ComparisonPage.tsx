import React from "react";
import { useLocation, useHistory } from "react-router-dom";
import {
  Paper,
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  Divider,
  Container,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";

interface Vehicle {
  Brand: string;
  Model: string;
  AccelSec: number;
  TopSpeed_KmH: number;
  Range_Km: number;
  Efficiency_WhKm: number;
  FastCharge_KmH: number;
  PriceEuro: number;
  BodyStyle: string;
  Segment: string;
  Seats: number;
  PowerTrain: string;
  RapidCharge: string;
  PlugType: string;
  Date: string;
}

interface ComparisonState {
  selectedVehicles: Vehicle[];
  comparison: string;
}

const ComparisonPage: React.FC = () => {
  const location = useLocation();
  const history = useHistory();

  const state = location.state as ComparisonState;

  if (!state || !state.selectedVehicles || !state.comparison) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h6" color="error" gutterBottom>
            No comparison data available
          </Typography>
          <Button variant="contained" onClick={() => history.push("/")}>
            Go Back to Data Grid
          </Button>
        </Paper>
      </Container>
    );
  }

  const { selectedVehicles, comparison } = state;

  const handleGoBack = () => {
    history.go(-1);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={handleGoBack}
          sx={{ mb: 2 }}
        >
          Back to Data Grid
        </Button>
        <Typography variant="h4" component="h1" gutterBottom>
          Vehicle Comparison Analysis
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          AI-powered comparison of {selectedVehicles.length} selected vehicles
        </Typography>
      </Box>

      {/* Selected Vehicles Summary */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Selected Vehicles
        </Typography>
        <Grid container spacing={2}>
          {selectedVehicles.map((vehicle, index) => (
            <Grid key={`${vehicle.Brand}-${vehicle.Model}-${index}`}>
              <Card variant="outlined" sx={{ height: "100%" }}>
                <CardContent>
                  <Typography variant="h6" component="h3" gutterBottom>
                    {vehicle.Brand} {vehicle.Model}
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Chip
                      label={vehicle.Segment}
                      size="small"
                      color="primary"
                      sx={{ mr: 1, mb: 1 }}
                    />
                    <Chip
                      label={vehicle.BodyStyle}
                      size="small"
                      color="secondary"
                      sx={{ mb: 1 }}
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Price:</strong> {formatCurrency(vehicle.PriceEuro)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Range:</strong> {vehicle.Range_Km} km
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>0-100 km/h:</strong> {vehicle.AccelSec}s
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Efficiency:</strong> {vehicle.Efficiency_WhKm} Wh/km
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Seats:</strong> {vehicle.Seats}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* AI Comparison Analysis */}
      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography
          variant="h6"
          gutterBottom
          sx={{ display: "flex", alignItems: "center" }}
        >
          <Box
            component="span"
            sx={{
              width: 20,
              height: 20,
              borderRadius: "50%",
              background: "linear-gradient(45deg, #10a37f, #1a7f64)",
              mr: 1,
              display: "inline-block",
            }}
          />
          ChatGPT Analysis
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <Box
          sx={{
            bgcolor: "grey.50",
            p: 3,
            borderRadius: 2,
            border: "1px solid",
            borderColor: "grey.200",
          }}
        >
          <Typography
            variant="body1"
            component="div"
            sx={{
              whiteSpace: "pre-wrap",
              lineHeight: 1.7,
              "& p": { mb: 2 },
              fontFamily: "inherit",
            }}
          >
            {comparison}
          </Typography>
        </Box>

        {/* Quick Stats Comparison Table */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Quick Stats Comparison
          </Typography>
          <Box sx={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: "#f5f5f5" }}>
                  <th
                    style={{
                      padding: "12px",
                      textAlign: "left",
                      borderBottom: "2px solid #ddd",
                    }}
                  >
                    Vehicle
                  </th>
                  <th
                    style={{
                      padding: "12px",
                      textAlign: "right",
                      borderBottom: "2px solid #ddd",
                    }}
                  >
                    Price
                  </th>
                  <th
                    style={{
                      padding: "12px",
                      textAlign: "right",
                      borderBottom: "2px solid #ddd",
                    }}
                  >
                    Range (km)
                  </th>
                  <th
                    style={{
                      padding: "12px",
                      textAlign: "right",
                      borderBottom: "2px solid #ddd",
                    }}
                  >
                    0-100 km/h (s)
                  </th>
                  <th
                    style={{
                      padding: "12px",
                      textAlign: "right",
                      borderBottom: "2px solid #ddd",
                    }}
                  >
                    Efficiency (Wh/km)
                  </th>
                  <th
                    style={{
                      padding: "12px",
                      textAlign: "right",
                      borderBottom: "2px solid #ddd",
                    }}
                  >
                    Top Speed (km/h)
                  </th>
                </tr>
              </thead>
              <tbody>
                {selectedVehicles.map((vehicle, index) => (
                  <tr key={`${vehicle.Brand}-${vehicle.Model}-${index}`}>
                    <td
                      style={{
                        padding: "12px",
                        borderBottom: "1px solid #ddd",
                      }}
                    >
                      <strong>
                        {vehicle.Brand} {vehicle.Model}
                      </strong>
                    </td>
                    <td
                      style={{
                        padding: "12px",
                        textAlign: "right",
                        borderBottom: "1px solid #ddd",
                      }}
                    >
                      {formatCurrency(vehicle.PriceEuro)}
                    </td>
                    <td
                      style={{
                        padding: "12px",
                        textAlign: "right",
                        borderBottom: "1px solid #ddd",
                      }}
                    >
                      {vehicle.Range_Km}
                    </td>
                    <td
                      style={{
                        padding: "12px",
                        textAlign: "right",
                        borderBottom: "1px solid #ddd",
                      }}
                    >
                      {vehicle.AccelSec}
                    </td>
                    <td
                      style={{
                        padding: "12px",
                        textAlign: "right",
                        borderBottom: "1px solid #ddd",
                      }}
                    >
                      {vehicle.Efficiency_WhKm}
                    </td>
                    <td
                      style={{
                        padding: "12px",
                        textAlign: "right",
                        borderBottom: "1px solid #ddd",
                      }}
                    >
                      {vehicle.TopSpeed_KmH}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default ComparisonPage;
