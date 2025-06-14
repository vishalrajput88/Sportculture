import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Alert,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

interface Venue {
  id: number;
  name: string;
  city: string;
  sport: string;
  price: number;
  rating: number;
  images: string[];
  facilities: string[];
  address: string;
  description: string;
  contact: {
    phone: string;
    email: string;
  };
  openingHours: {
    [key: string]: string;
  };
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [formData, setFormData] = useState<Partial<Venue>>({
    name: '',
    city: '',
    sport: '',
    price: 0,
    address: '',
    description: '',
    facilities: [],
    contact: {
      phone: '',
      email: '',
    },
    openingHours: {
      Monday: '9:00 AM - 10:00 PM',
      Tuesday: '9:00 AM - 10:00 PM',
      Wednesday: '9:00 AM - 10:00 PM',
      Thursday: '9:00 AM - 10:00 PM',
      Friday: '9:00 AM - 10:00 PM',
      Saturday: '9:00 AM - 10:00 PM',
      Sunday: '9:00 AM - 10:00 PM',
    },
  });

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    fetchVenues();
  }, [navigate]);

  const fetchVenues = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:3000/api/admin/venues', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch venues');
      }
      
      const data = await response.json();
      setVenues(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (venue?: Venue) => {
    if (venue) {
      setSelectedVenue(venue);
      setFormData(venue);
    } else {
      setSelectedVenue(null);
      setFormData({
        name: '',
        city: '',
        sport: '',
        price: 0,
        address: '',
        description: '',
        facilities: [],
        contact: {
          phone: '',
          email: '',
        },
        openingHours: {
          Monday: '9:00 AM - 10:00 PM',
          Tuesday: '9:00 AM - 10:00 PM',
          Wednesday: '9:00 AM - 10:00 PM',
          Thursday: '9:00 AM - 10:00 PM',
          Friday: '9:00 AM - 10:00 PM',
          Saturday: '9:00 AM - 10:00 PM',
          Sunday: '9:00 AM - 10:00 PM',
        },
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedVenue(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('adminToken');
      const url = selectedVenue
        ? `http://localhost:3000/api/admin/venues/${selectedVenue.id}`
        : 'http://localhost:3000/api/admin/venues';
      
      const response = await fetch(url, {
        method: selectedVenue ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to save venue');
      }

      handleCloseDialog();
      fetchVenues();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this venue?')) {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`http://localhost:3000/api/admin/venues/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete venue');
      }

      fetchVenues();
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <Container>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Manage Venues
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add New Venue
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>City</TableCell>
              <TableCell>Sport</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {venues.map((venue) => (
              <TableRow key={venue.id}>
                <TableCell>{venue.name}</TableCell>
                <TableCell>{venue.city}</TableCell>
                <TableCell>{venue.sport}</TableCell>
                <TableCell>₹{venue.price}/hour</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenDialog(venue)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(venue.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedVenue ? 'Edit Venue' : 'Add New Venue'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Venue Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="City"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Sport"
                  value={formData.sport}
                  onChange={(e) => setFormData({ ...formData, sport: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Price per Hour"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone"
                  value={formData.contact?.phone}
                  onChange={(e) => setFormData({
                    ...formData,
                    contact: { ...formData.contact, phone: e.target.value }
                  })}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={formData.contact?.email}
                  onChange={(e) => setFormData({
                    ...formData,
                    contact: { ...formData.contact, email: e.target.value }
                  })}
                  required
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {selectedVenue ? 'Update' : 'Add'} Venue
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminDashboard; 