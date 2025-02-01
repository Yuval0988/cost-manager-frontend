import React, { useState } from 'react';
import {
  Paper,
  TextField,
  Button,
  Box,
  MenuItem,
  Alert,
  Snackbar,
  Typography
} from '@mui/material';
import { openCostsDB } from '../lib/idb';

/**
 * Predefined categories for cost items
 * @constant {string[]}
 */
const CATEGORIES = [
  'Food',
  'Transportation',
  'Housing',
  'Healthcare',
  'Entertainment',
  'Shopping',
  'Utilities',
  'Other'
];

/**
 * Component for adding new cost items
 * Allows users to input sum, category, description, and date
 * @component
 */
function AddCostForm() {
  // Form state with default values
  const [formData, setFormData] = useState({
    sum: '',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  // UI state for error and success messages
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  /**
   * Handles form input changes
   * @param {Object} event - Input change event
   */
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  /**
   * Validates form data before submission
   * @returns {boolean} True if form is valid
   */
  const validateForm = () => {
    // Validate sum
    if (!formData.sum || isNaN(formData.sum) || Number(formData.sum) <= 0) {
      setError('Please enter a valid amount');
      return false;
    }
    // Validate category
    if (!formData.category) {
      setError('Please select a category');
      return false;
    }
    // Validate description
    if (!formData.description.trim()) {
      setError('Please enter a description');
      return false;
    }
    // Validate date
    if (!formData.date) {
      setError('Please select a date');
      return false;
    }
    return true;
  };

  /**
   * Handles form submission
   * @param {Object} event - Form submit event
   */
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    try {
      const db = await openCostsDB();
      await db.addCost({
        ...formData,
        sum: Number(formData.sum)
      });

      // Reset form after successful submission
      setFormData({
        sum: '',
        category: '',
        description: '',
        date: new Date().toISOString().split('T')[0]
      });
      setSuccess(true);
    } catch (err) {
      console.error('Error saving cost:', err);
      setError('Failed to save cost. Please try again.');
    }
  };

  return (
    <Paper sx={{ p: 3, borderRadius: '12px' }}>
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 500 }}>
        Add New Cost
      </Typography>
      
      <form onSubmit={handleSubmit}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          {/* Amount input */}
          <TextField
            label="Amount"
            name="sum"
            type="number"
            value={formData.sum}
            onChange={handleChange}
            required
            inputProps={{ min: "0", step: "0.01" }}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
          />

          {/* Category selection */}
          <TextField
            select
            label="Category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
          >
            {CATEGORIES.map(category => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </TextField>

          {/* Description input */}
          <TextField
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            multiline
            rows={2}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
          />

          {/* Date selection */}
          <TextField
            type="date"
            label="Date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            InputLabelProps={{
              shrink: true,
            }}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
          />

          {/* Submit button */}
          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
            size="large"
            sx={{ 
              mt: 1,
              height: '48px',
              borderRadius: '8px',
              textTransform: 'none',
              fontSize: '1rem'
            }}
          >
            Save Cost
          </Button>
        </Box>
      </form>

      {/* Error message snackbar */}
      <Snackbar
        open={error !== null}
        autoHideDuration={4000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          severity="error" 
          onClose={() => setError(null)}
          sx={{ borderRadius: '8px' }}
        >
          {error}
        </Alert>
      </Snackbar>

      {/* Success message snackbar */}
      <Snackbar
        open={success}
        autoHideDuration={4000}
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          severity="success" 
          onClose={() => setSuccess(false)}
          sx={{ borderRadius: '8px' }}
        >
          Cost saved successfully
        </Alert>
      </Snackbar>
    </Paper>
  );
}

export default AddCostForm;
