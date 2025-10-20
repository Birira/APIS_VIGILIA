import React, { useState, useMemo } from 'react';
import { useColmenaData } from "./Hooks/useColmenaData";
import { Grafico } from "./Components/Grafico";
import { StatusPanel } from "./Components/StatusPanel";
import { TemperatureStats } from "./Components/TemperatureStats";
import "./Style/index.css";

function App() {
  const {
    data,
    latestData,
    connectionStatus,
    loading,
    error,
    temperatureStats,
  } = useColmenaData();

  // Estados para el filtro de fechas
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Filtrar datos según el rango de fechas
  const filteredData = useMemo(() => {
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

  // Función para limpiar filtros
  const clearFilters = () => {
    setStartDate('');
    setEndDate('');
  };

  return (
    <div className="container" style={{ 
      maxWidth: '1800px',
      margin: '0 auto',
      padding: '20px',
      background: '#F4F7F0'
    }}>
      <h1 style={{ 
        textAlign: 'center', 
        borderBottom: '2px solid #C2AF67',
        paddingBottom: '10px',
        marginBottom: '20px',
        textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
      }}>
        MONITOREO DE COLMENA
      </h1>
      
      {/* Layout de dos columnas */}
      <div style={{
        display: 'flex',
        gap: '20px',
        alignItems: 'flex-start'
      }}>
        {/* Columna izquierda - Estadísticas */}
        <div style={{ 
          flex: '0 0 350px',
          position: 'sticky',
          top: '20px'
        }}>
          <TemperatureStats temperatureStats={temperatureStats} />
        </div>
        
        {/* Columna derecha - Filtros y Gráfico */}
        <div style={{ flex: '1' }}>
          {/* Filtro de fechas */}
          <div style={{
            background: '#C2AF67',
            padding: '20px',
            borderRadius: '8px',
            marginBottom: '20px',
            border: '1px solid #ddd'
          }}>
        <h3 style={{ marginTop: 0, marginBottom: '15px' }}>Filtrar por Rango de Fechas</h3>
        <div style={{
          display: 'flex',
          gap: '15px',
          alignItems: 'center',
          flexWrap: 'wrap'
        }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Fecha Inicio:
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              style={{
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #ccc',
                fontSize: '14px'
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Fecha Fin:
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              style={{
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #ccc',
                fontSize: '14px'
              }}
            />
          </div>
          <div style={{ marginTop: '20px' }}>
            <button
              onClick={clearFilters}
              style={{
                padding: '8px 16px',
                borderRadius: '4px',
                border: 'none',
                background: '#C2AF67',
                color: 'white',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold'
              }}
            >
              Limpiar Filtros
            </button>
          </div>
          {(startDate || endDate) && (
            <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
              Mostrando {filteredData.length} de {data.length} registros
            </div>
          )}
        </div>
      </div>
      
      <Grafico data={filteredData} />
      
      <StatusPanel 
        connectionStatus={connectionStatus}
        loading={loading}
        error={error}
      />
        </div>
      </div>
    </div>
  );
}

export default App;
