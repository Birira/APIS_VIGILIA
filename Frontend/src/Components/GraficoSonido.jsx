import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import React, { useState, useEffect } from 'react';

export const GraficoSonido = ({ startDate, endDate }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch sound data from the API
  const fetchSoundData = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://168.181.186.157/sonido');
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const result = await response.json();
      setData(result.data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching sound data:', err);
      setError('Error al cargar datos de sonido: ' + err.message);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount and set up auto-refresh
  useEffect(() => {
    fetchSoundData();

    // Refresh data every 60 seconds
    const interval = setInterval(fetchSoundData, 60000);
    
    return () => clearInterval(interval);
  }, []);

  // Filter data based on date range
  const filteredData = React.useMemo(() => {
    if (!data || data.length === 0) return [];
    
    if (!startDate && !endDate) return data;

    return data.filter(item => {
      if (!item.fecha_registro) return false;
      
      const itemDate = new Date(item.fecha_registro);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;

      // Ajustar el final del día para incluir todo el día seleccionado
      if (end) {
        end.setHours(23, 59, 59, 999);
      }

      if (start && end) {
        return itemDate >= start && itemDate <= end;
      } else if (start) {
        return itemDate >= start;
      } else if (end) {
        return itemDate <= end;
      }
      
      return true;
    });
  }, [data, startDate, endDate]);

  // Format dates for better display and limit data points
  const formattedData = React.useMemo(() => {
    // Limitar a los últimos 100 puntos para mejor visualización
    const MAX_POINTS = 100;
    const limitedData = filteredData.slice(-MAX_POINTS);
    
    return limitedData.map(item => ({
      ...item,
      formattedDate: item.fecha_registro 
        ? new Date(item.fecha_registro).toLocaleString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })
        : 'Sin fecha'
    }));
  }, [filteredData]);

  // Show loading state
  if (loading && data.length === 0) {
    return <div style={{ textAlign: 'center', padding: '20px' }}>Cargando datos de sonido...</div>;
  }

  // Show error state
  if (error) {
    return <div style={{ color: 'red', textAlign: 'center', padding: '20px' }}>{error}</div>;
  }

  // Show empty state
  if (!formattedData || formattedData.length === 0) {
    return <div style={{ textAlign: 'center', padding: '20px' }}>No hay datos disponibles para mostrar en el gráfico de sonido</div>;
  }

  return (
    <div className="graficos-container">
      {/* Gráfico de Sonido */}
      <div style={{ width: '100%', height: 400, marginTop: 20, marginBottom: 60 }}>
        <h2>Gráfico de Sonido</h2>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={formattedData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="formattedDate"
              tick={{ fontSize: 10 }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              label={{ value: 'Nivel de Sonido', angle: -90, position: 'insideLeft' }} 
            />
            <Tooltip formatter={(value, name) => {
              if (name === 'Sonido') return [value, name];
              return [value, name];
            }} />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="sonido" 
              stroke="#8B4513" 
              dot={false}
              activeDot={false}
              name="Sonido" 
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
