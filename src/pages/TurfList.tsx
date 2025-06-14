import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Container,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { turfApi, type Turf, type SearchParams } from '../services/api';
import styles from './TurfList.module.css';

const TurfList = () => {
  const navigate = useNavigate();
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedSport, setSelectedSport] = useState('');
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());
  const [turfs, setTurfs] = useState<Turf[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cities = [
    'Ahmedabad',
    'Mumbai',
    'Delhi',
    'Bangalore',
    'Chennai',
    'Hyderabad',
    'Kolkata',
    'Pune',
  ];

  const sports = [
    'Pickleball',
    'Tennis',
    'Table Tennis',
    'Basketball',
    'Volleyball',
    'Badminton',
  ];

  useEffect(() => {
    const fetchTurfs = async () => {
      if (!selectedCity || !selectedSport || !selectedDate) return;

      try {
        setLoading(true);
        setError(null);
        const searchParams: SearchParams = {
          city: selectedCity,
          sport: selectedSport,
          date: selectedDate.format('YYYY-MM-DD'),
          time: selectedDate.format('HH:mm'), // Using current time as default
        };
        const data = await turfApi.searchTurfs(searchParams);
        setTurfs(data);
      } catch (err) {
        setError('Failed to fetch turfs. Please try again.');
        console.error('Error fetching turfs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTurfs();
  }, [selectedCity, selectedSport, selectedDate]);

  return (
    <Container maxWidth="lg" className={styles.container}>
      {/* Filter Bar */}
      <Box className={styles.filterBar}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>City</InputLabel>
              <Select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                label="City"
              >
                {cities.map((city) => (
                  <MenuItem key={city} value={city}>
                    {city}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Sport</InputLabel>
              <Select
                value={selectedSport}
                onChange={(e) => setSelectedSport(e.target.value)}
                label="Sport"
              >
                {sports.map((sport) => (
                  <MenuItem key={sport} value={sport}>
                    {sport}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Date"
                value={selectedDate}
                onChange={(newValue) => setSelectedDate(newValue)}
                sx={{ width: '100%' }}
              />
            </LocalizationProvider>
          </Grid>
        </Grid>
      </Box>

      {/* Loading State */}
      {loading && (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      )}

      {/* Error State */}
      {error && (
        <Alert severity="error" sx={{ my: 2 }}>
          {error}
        </Alert>
      )}

      {/* No Results State */}
      {!loading && !error && turfs.length === 0 && selectedCity && selectedSport && selectedDate && (
        <Alert severity="info" sx={{ my: 2 }}>
          No turfs found matching your criteria.
        </Alert>
      )}

      {/* Turf Cards */}
      <Grid container spacing={3} sx={{ mt: 2 }}>
        {turfs.map((turf) => (
          <Grid item key={turf.id} xs={12} sm={6} md={4}>
            <Card className={styles.turfCard}>
              <CardMedia
                component="img"
                height="200"
                image={turf.images[0]}
                alt={turf.name}
                className={styles.cardImage}
              />
              <CardContent>
                <Typography variant="h6" component="h2" gutterBottom>
                  {turf.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {turf.city}
                </Typography>
                <Typography variant="h6" color="primary" gutterBottom>
                  ₹{turf.price}/hour
                </Typography>
                <Box className={styles.facilities}>
                  {turf.facilities.map((facility) => (
                    <span key={facility} className={styles.facilityChip}>
                      {facility}
                    </span>
                  ))}
                </Box>
                <Button
                  variant="contained"
                  fullWidth
                  component={Link}
                  to={`/turf/${turf.id}`}
                  className={styles.viewDetailsButton}
                >
                  View Details
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default TurfList; 