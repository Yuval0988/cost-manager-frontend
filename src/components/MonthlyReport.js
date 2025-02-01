import React, { useState, useEffect } from 'react';
import {
  Paper,
  Box,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  MenuItem,
  Grid,
  Alert,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { PieChart } from '@mui/x-charts';
import { openCostsDB } from '../lib/idb';

/**
 * Component for displaying monthly cost report and pie chart
 * Shows detailed report and pie chart visualization for selected month/year
 * @component
 */
function MonthlyReport() {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  
  // State for date selection and data
  const [selectedDate, setSelectedDate] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear()
  });
  const [costs, setCosts] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [error, setError] = useState(null);

  // Generate array of months for select input
  const months = Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    label: new Date(2000, i).toLocaleString('default', { month: 'long' })
  }));

  // Generate array of years (last 5 years to next year)
  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: 6 },
    (_, i) => currentYear - 4 + i
  );

  /**
   * Formats number as currency
   * @param {number} amount - Amount to format
   * @returns {string} Formatted currency string
   */
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  /**
   * Fetches cost data when selected date changes
   */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const db = await openCostsDB();
        
        // Get costs for selected month
        const monthCosts = await db.getCostsByMonth(
          selectedDate.month,
          selectedDate.year
        );
        setCosts(monthCosts);

        // Calculate category totals for pie chart
        const categoryTotals = monthCosts.reduce((acc, cost) => {
          acc[cost.category] = (acc[cost.category] || 0) + cost.sum;
          return acc;
        }, {});
        
        // Transform category data for pie chart
        const pieData = Object.entries(categoryTotals).map(([category, value], index) => ({
          id: index,
          value,
          label: `${category}: ${formatCurrency(value)}`
        }));
        setCategoryData(pieData);
        
        setError(null);
      } catch (err) {
        console.error('Error loading report:', err);
        setError('Failed to load report data. Please try again.');
      }
    };

    fetchData();
  }, [selectedDate]);

  /**
   * Handles date selection changes
   * @param {Object} event - Change event from select input
   */
  const handleDateChange = (event) => {
    const { name, value } = event.target;
    setSelectedDate(prev => ({
      ...prev,
      [name]: Number(value)
    }));
  };

  return (
    <Paper sx={{ p: 3, borderRadius: '12px' }}>
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 500 }}>
        Monthly Report
      </Typography>

      {/* Date selection controls */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6}>
          <TextField
            select
            fullWidth
            label="Month"
            name="month"
            value={selectedDate.month}
            onChange={handleDateChange}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
          >
            {months.map(month => (
              <MenuItem key={month.value} value={month.value}>
                {month.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            select
            fullWidth
            label="Year"
            name="year"
            value={selectedDate.year}
            onChange={handleDateChange}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
          >
            {years.map(year => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>

      {/* Error message */}
      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: '8px' }}>
          {error}
        </Alert>
      )}

      {/* No data message or report content */}
      {costs.length === 0 ? (
        <Typography variant="body1" sx={{ textAlign: 'center', py: 3, color: 'text.secondary' }}>
          No costs found for {months.find(m => m.value === selectedDate.month)?.label} {selectedDate.year}
        </Typography>
      ) : (
        <>
          {/* Costs table */}
          <TableContainer sx={{ mb: 4, borderRadius: '8px', border: '1px solid', borderColor: 'divider' }}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: 'background.default' }}>
                  <TableCell>Date</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell align="right">Amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {costs.map((cost) => (
                  <TableRow key={cost.id} hover>
                    <TableCell>
                      {new Date(cost.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{cost.category}</TableCell>
                    <TableCell>{cost.description}</TableCell>
                    <TableCell align="right">
                      {formatCurrency(cost.sum)}
                    </TableCell>
                  </TableRow>
                ))}
                {/* Total row */}
                <TableRow sx={{ bgcolor: 'background.default' }}>
                  <TableCell colSpan={3}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>Total</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                      {formatCurrency(
                        costs.reduce((sum, cost) => sum + cost.sum, 0)
                      )}
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pie chart */}
          {categoryData.length > 0 && (
            <Box sx={{ height: isSmallScreen ? 300 : 400, width: '100%' }}>
              <Typography variant="h6" gutterBottom align="center" sx={{ fontWeight: 500 }}>
                Costs by Category
              </Typography>
              <PieChart
                series={[
                  {
                    data: categoryData,
                    highlightScope: { faded: 'global', highlighted: 'item' },
                    faded: { innerRadius: 30, additionalRadius: -30 },
                  },
                ]}
                height={isSmallScreen ? 250 : 350}
                slotProps={{
                  legend: {
                    direction: 'row',
                    position: 'bottom',
                    padding: 0,
                  },
                }}
              />
            </Box>
          )}
        </>
      )}
    </Paper>
  );
}

export default MonthlyReport;
