import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import React from 'react';

export const Grafico = ({ data }) => {
  // Return empty container if no data
  if (!data || data.length === 0) {
    return <div>No hay datos disponibles para mostrar en el gráfico</div>;
  }

  // Format dates for better display
  const formattedData = data.map(item => ({
    ...item,
    formattedDate: item.fecha_registro ? new Date(item.fecha_registro).toLocaleDateString() : 'Sin fecha'
  }));

  return (
    <div className="graficos-container">
      {/* Gráfico de Temperatura */}
      <div style={{ width: '100%', height: 400, marginTop: 20, marginBottom: 60 }}>
        <h2>Gráfico de Temperatura</h2>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={formattedData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="formattedDate"
            />
            <YAxis 
              label={{ value: 'Temperatura (°C)', angle: -90, position: 'insideLeft' }} 
            />
            <Tooltip formatter={(value, name) => [name === 'Temperatura' ? `${value}°C` : value, name]} />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="temperatura" 
              stroke="#FF5733" 
              activeDot={{ r: 8 }} 
              name="Temperatura" 
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};