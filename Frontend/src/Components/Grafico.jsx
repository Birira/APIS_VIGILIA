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
      {/* Gráfico de Temperatura y Humedad */}
      <div style={{ width: '100%', height: 400, marginTop: 20, marginBottom: 60 }}>
        <h2>Gráfico de Temperatura y Humedad</h2>
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
              yAxisId="left"
              label={{ value: 'Temperatura (°C)', angle: -90, position: 'insideLeft' }} 
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              label={{ value: 'Humedad (%)', angle: 90, position: 'insideRight' }} 
            />
            <Tooltip formatter={(value, name) => {
              if (name === 'Temperatura') return [`${value}°C`, name];
              if (name === 'Humedad') return [`${value}%`, name];
              return [value, name];
            }} />
            <Legend />
            <Line 
              yAxisId="left"
              type="monotone" 
              dataKey="temperatura" 
              stroke="#FF5733" 
              activeDot={{ r: 8 }} 
              name="Temperatura" 
              strokeWidth={2}
            />
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="humedad" 
              stroke="#3B82F6" 
              activeDot={{ r: 8 }} 
              name="Humedad" 
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};