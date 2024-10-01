import React, { useState } from 'react';
import { Container, Grid, Button, Typography, Box } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import AirportAutoComplete from './components/AirportAutoComplete';
import DistanceCalculator from './components/DistanceCalculator';
import MapDisplay from './components/MapDisplay';
import { useEffect } from 'react';

interface Airport {
  icao: string;
  iata: string;
  name: string;
  city: string;
  latitude: string;
  longitude: string;
}

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#BB86FC',
    },
    secondary: {
      main: '#03DAC5',
    },
    background: {
      default: '#121212',
      paper: '#1E1E1E',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#B0BEC5',
    },
  },
});

const App: React.FC = () => {
  const [airport1, setAirport1] = useState<Airport | null>(null);
  const [airport2, setAirport2] = useState<Airport | null>(null);
  const [distance, setDistance] = useState<number | null>(null);

  useEffect(() => {
    if (!airport1 || !airport2) {
      setDistance(null);
      return;
    }
  }, [airport1, airport2]);

  const handleCalculateDistance = () => {
    if (airport1 && airport2) {
      const dist = DistanceCalculator(airport1, airport2);
      setDistance(dist);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container sx={{ bgcolor: 'background.default', minHeight: '100vh', p: 2 }}>
        <Box sx={{ textAlign: 'center', py: 5 }}>
          <Typography variant="h3" component="h1" gutterBottom color="primary">
            Flight Distance Calculator
          </Typography>
          <Typography variant="body1" color="textSecondary" gutterBottom>
            Calculate the distance between two U.S. airports in nautical miles.
          </Typography>
        </Box>

        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} sm={6}>
            <AirportAutoComplete onSelect={setAirport1} label="From" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <AirportAutoComplete onSelect={setAirport2} label="To" />
          </Grid>

          <Grid item xs={12}>
            <Button
              variant="contained"
              color="info"
              size="large"
              onClick={handleCalculateDistance}
              fullWidth
              sx={{ py: 2, fontSize: '1.2rem', mt: 2 }}
            >
              Calculate Distance
            </Button>
          </Grid>

          {airport1 && airport2 && distance && (
            <Grid item xs={12}>
              <Typography variant="h5" color="textPrimary" sx={{ mt: 4, textAlign: 'center' }}>
                Distance: {Math.round(distance * 100) / 100} Nautical Miles
              </Typography>
            </Grid>
          )}

          {airport1 && airport2 && distance && (
            <Grid item xs={12}>
              <MapDisplay airport1={airport1} airport2={airport2} />
            </Grid>
          )}
        </Grid>
      </Container>
    </ThemeProvider>
  );
};

export default App;
