import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import idb from '../lib/idb';

function TestIDB() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    async function test() {
      try {
        const db = await idb.openCostsDB("costsdb", 1);
        setLogs(prev => [...prev, "creating db succeeded"]);

        const result1 = await db.addCost({
          sum: 200,
          category: "FOOD",
          description: "pizza"
        });
        if (result1) {
          setLogs(prev => [...prev, "adding 1st cost item succeeded"]);
        }

        const result2 = await db.addCost({
          sum: 400,
          category: "CAR",
          description: "fuel"
        });
        if (result2) {
          setLogs(prev => [...prev, "adding 2nd cost item succeeded"]);
        }

      } catch (error) {
        setLogs(prev => [...prev, `Error: ${error.message}`]);
      }
    }

    test();
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>IDB Test Results</Typography>
      {logs.map((log, index) => (
        <Typography key={index} sx={{ fontFamily: 'monospace' }}>
          {log}
        </Typography>
      ))}
    </Box>
  );
}

export default TestIDB;
