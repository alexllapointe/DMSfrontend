import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavigationBar from "./NavigationBar";

import {
  Autocomplete,
  TextField,
  MenuItem,
  Button,
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Alert,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";

const locations = [
  { label: "Indianapolis, Indiana, 46204, United States" },
  { label: "Las Vegas, Nevada, 89101, United States" },
  { label: "New York, NY, 10001, United States" },
  { label: "San Francisco, CA, 94103, United States" },
];

// Mock search results with FedEx and UPS
const getLocalSearchResults = ({ from, to, packages, weight }) => {
  const basePrice = 10;
  const parsedWeight = parseFloat(weight);

  const services = [
    { provider: "FedEx", type: "Ground", multiplier: 1, deliveryTime: 5 },
    { provider: "FedEx", type: "Express", multiplier: 1.5, deliveryTime: 3 },
    { provider: "FedEx", type: "Overnight", multiplier: 2.5, deliveryTime: 1 },
    { provider: "UPS", type: "Ground", multiplier: 1.1, deliveryTime: 5 },
    { provider: "UPS", type: "2nd Day Air", multiplier: 1.6, deliveryTime: 2 },
    { provider: "UPS", type: "Next Day Air", multiplier: 2.7, deliveryTime: 1 },
  ];

  return services.map((service) => {
    const price = basePrice + packages * 4 + parsedWeight * 0.9 * service.multiplier;
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + service.deliveryTime);

    return {
      provider: service.provider,
      serviceType: service.type,
      price: price.toFixed(2),
      deliveryTime: service.deliveryTime,
      deliveredBy: deliveryDate.toDateString(),
    };
  });
};

const Shipping = () => {
  const navigate = useNavigate();

  const [from, setFrom] = useState(null);
  const [to, setTo] = useState(null);
  const [packages, setPackages] = useState(1);
  const [weight, setWeight] = useState("");
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const [providerFilter, setProviderFilter] = useState("All");
  const [sortOption, setSortOption] = useState("");

  const handleSearch = () => {
    if (!from || !to || !weight) {
      setError("Please fill all fields before searching!");
      return;
    }
    setError("");
    const localResults = getLocalSearchResults({
      from: from.label,
      to: to.label,
      packages,
      weight,
    });
    setResults(localResults);
  };

  const handleShipNow = (result) => {
    alert(`You selected "${result.provider} - ${result.serviceType}" to ship your package.`);
  };

  // Filtered and Sorted Results
  let displayedResults = [...results];
  if (providerFilter !== "All") {
    displayedResults = displayedResults.filter((r) => r.provider === providerFilter);
  }
  if (sortOption === "Fastest") {
    displayedResults.sort((a, b) => a.deliveryTime - b.deliveryTime);
  } else if (sortOption === "Lowest Price") {
    displayedResults.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
  }

  return (
    <Box>
      {/* <NavigationBar /> */}

      <Container sx={{ mt: 8 }}>
        {/* Search Fields */}
        <Box sx={{ display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap" }}>
          <Autocomplete
            options={locations}
            getOptionLabel={(option) => option.label}
            value={from}
            onChange={(event, newValue) => setFrom(newValue)}
            renderInput={(params) => (
              <TextField {...params} label="From" variant="outlined" fullWidth />
            )}
            sx={{ width: 250 }}
          />

          <Autocomplete
            options={locations}
            getOptionLabel={(option) => option.label}
            value={to}
            onChange={(event, newValue) => setTo(newValue)}
            renderInput={(params) => (
              <TextField {...params} label="To" variant="outlined" fullWidth />
            )}
            sx={{ width: 250 }}
          />

          <TextField
            select
            label="Packages"
            value={packages}
            onChange={(e) => setPackages(e.target.value)}
            variant="outlined"
            sx={{ width: 120 }}
          >
            {[1, 2, 3, 4, 5].map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Package Weight (kg)"
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            variant="outlined"
            sx={{ width: 150 }}
          />

          <Button
            variant="contained"
            color="primary"
            onClick={handleSearch}
            sx={{ height: "56px" }}
          >
            Search
          </Button>
        </Box>

        {/* Error */}
        {error && (
          <Alert severity="error" sx={{ mt: 3 }}>
            {error}
          </Alert>
        )}

        {/* Filters & Sort */}
        {results.length > 0 && (
          <Box sx={{ mt: 4, display: "flex", gap: 2, flexWrap: "wrap", alignItems: "center" }}>
            <FormControl sx={{ minWidth: 180 }}>
              <InputLabel>Filter by Provider</InputLabel>
              <Select
                value={providerFilter}
                label="Filter by Provider"
                onChange={(e) => setProviderFilter(e.target.value)}
              >
                <MenuItem value="All">All</MenuItem>
                <MenuItem value="FedEx">FedEx</MenuItem>
                <MenuItem value="UPS">UPS</MenuItem>
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 180 }}>
              <InputLabel>Sort by</InputLabel>
              <Select
                value={sortOption}
                label="Sort by"
                onChange={(e) => setSortOption(e.target.value)}
              >
                <MenuItem value="">None</MenuItem>
                <MenuItem value="Fastest">Reaching Fastest</MenuItem>
                <MenuItem value="Lowest Price">Lowest Price</MenuItem>
              </Select>
            </FormControl>
          </Box>
        )}

        {/* Results */}
        {displayedResults.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" color="primary" fontWeight="bold">
              Search Results ({displayedResults.length} options)
            </Typography>

            {displayedResults.map((result, index) => (
              <Paper
                key={index}
                elevation={3}
                sx={{ mt: 3, p: 2, borderRadius: "10px", backgroundColor: "#f9f9f9" }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {result.provider} - {result.serviceType}
                    </Typography>
                    <Typography variant="subtitle1">
                      <strong>Price:</strong> ${result.price}
                    </Typography>
                    <Typography variant="subtitle1">
                      <strong>Delivery Time:</strong> {result.deliveryTime} days
                    </Typography>
                    <Typography variant="subtitle1">
                      <strong>Delivered By:</strong> {result.deliveredBy}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} display="flex" alignItems="center" justifyContent="flex-end">
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => handleShipNow(result)}
                    >
                      Ship Now
                    </Button>
                  </Grid>
                </Grid>
              </Paper>
            ))}
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default Shipping;
