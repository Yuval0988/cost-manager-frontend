import React, { useState, useEffect } from 'react';
import { 
  ThemeProvider, 
  createTheme, 
  CssBaseline,
  Container,
  Box,
  Paper,
  Tabs,
  Tab,
  Typography,
  useMediaQuery,
  Alert
} from '@mui/material';
import AddCostForm from './components/AddCostForm';
import MonthlyReport from './components/MonthlyReport';
import { openCostsDB } from './lib/idb';

/**
 * Create theme for consistent styling across the application
 */
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2196f3',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff'
    }
  },
  typography: {
    h4: {
      fontWeight: 600,
      letterSpacing: '0.5px'
    }
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 10px rgba(0,0,0,0.08)'
        }
      }
    }
  }
});

/**
 * Main application component
 * Handles navigation between Add Cost and Monthly Report views
 * @component
 */
function App() {
  const [currentTab, setCurrentTab] = useState(0);
  const [error, setError] = useState(null);
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  /**
   * Initialize database on app load
   */
  useEffect(() => {
    const initDatabase = async () => {
      try {
        await openCostsDB();
        console.log('Database initialized successfully');
      } catch (err) {
        console.error('Database initialization error:', err);
        setError('Failed to initialize database. Please refresh the page.');
      }
    };

    initDatabase();
  }, []);

  /**
   * Handles tab change
   * @param {Object} event - Change event
   * @param {number} newValue - New tab index
   */
  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  // Show error state if database initialization fails
  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="md">
        <Box sx={{ my: isSmallScreen ? 2 : 4 }}>
          {/* Application title */}
          <Typography 
            variant="h4" 
            component="h1" 
            gutterBottom 
            align="center"
            sx={{ 
              mb: 4,
              color: theme.palette.primary.main,
              textShadow: '1px 1px 1px rgba(0,0,0,0.1)'
            }}
          >
            Yuval and Shaked's project
          </Typography>
          
          {/* Navigation tabs */}
          <Paper 
            sx={{ 
              mb: 3,
              borderRadius: '12px',
              overflow: 'hidden'
            }}
          >
            <Tabs
              value={currentTab}
              onChange={handleTabChange}
              indicatorColor="primary"
              textColor="primary"
              centered
              sx={{
                borderBottom: 1,
                borderColor: 'divider',
                bgcolor: 'background.paper'
              }}
            >
              <Tab 
                label="Add Cost" 
                sx={{ 
                  textTransform: 'none',
                  fontWeight: 500,
                  fontSize: '1rem'
                }}
              />
              <Tab 
                label="Monthly Report" 
                sx={{ 
                  textTransform: 'none',
                  fontWeight: 500,
                  fontSize: '1rem'
                }}
              />
            </Tabs>
          </Paper>

          {/* Main content area */}
          <Box sx={{ p: isSmallScreen ? 0 : 2 }}>
            {currentTab === 0 && <AddCostForm />}
            {currentTab === 1 && <MonthlyReport />}
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;
