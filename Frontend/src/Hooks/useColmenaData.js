import { useState, useEffect } from 'react';
import { getData, pingApi } from './getData';

// Function to calculate temperature statistics
const calculateTemperatureStats = (data) => {
  if (!data || data.length === 0) return null;
  
  // Extract temperature values and filter out null/undefined values
  const temperatures = data
    .map(item => item.temperatura)
    .filter(temp => temp !== null && temp !== undefined && !isNaN(temp));
  
  if (temperatures.length === 0) return null;
  
  // Calculate mean
  const mean = temperatures.reduce((sum, temp) => sum + temp, 0) / temperatures.length;
  
  // Calculate variance
  const variance = temperatures.reduce((sum, temp) => {
    return sum + Math.pow(temp - mean, 2);
  }, 0) / temperatures.length;
  
  // Calculate standard deviation
  const standardDeviation = Math.sqrt(variance);
  
  // Calculate coefficient of variation (CV = standard deviation / mean * 100)
  const coefficientOfVariation = mean !== 0 ? (standardDeviation / mean) * 100 : 0;
  
  // Calculate min and max
  const min = Math.min(...temperatures);
  const max = Math.max(...temperatures);
  
  return {
    count: temperatures.length,
    mean: Math.round(mean * 100) / 100,
    coefficientOfVariation: Math.round(coefficientOfVariation * 100) / 100,
    standardDeviation: Math.round(standardDeviation * 100) / 100,
    min: Math.round(min * 100) / 100,
    max: Math.round(max * 100) / 100
  };
};

export const useColmenaData = () => {
  const [data, setData] = useState([]);
  const [latestData, setLatestData] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('Checking...');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [temperatureStats, setTemperatureStats] = useState(null);

  // Test API connectivity first
  const checkConnection = async () => {
    try {
      const pingResult = await pingApi();
      if (pingResult.status === 'ok') {
        setConnectionStatus('Connected to API');
        fetchData();
      } else {
        setConnectionStatus('API Error: ' + pingResult.message);
        setLoading(false);
      }
    } catch (err) {
      setConnectionStatus('Failed to connect to API');
      setError('Connection error: ' + err.message);
      setLoading(false);
    }
  };

  // Fetch actual data
  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await getData();
      
      setData(result);
      if (result.length > 0) {
        setLatestData(result[result.length - 1]);
        // Calculate temperature statistics
        const stats = calculateTemperatureStats(result);
        setTemperatureStats(stats);
      }
      setLoading(false);
    } catch (err) {
      setError('Error fetching data: ' + err.message);
      setLoading(false);
    }
  };

  // Refresh data function that can be called from components
  const refreshData = () => {
    checkConnection();
  };

  useEffect(() => {
    checkConnection();
  }, []);

  return {
    data,
    latestData,
    connectionStatus,
    loading,
    error,
    temperatureStats,
    refreshData
  };
};