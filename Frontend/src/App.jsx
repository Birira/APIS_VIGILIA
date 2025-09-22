import React from 'react';
import { useColmenaData } from "./Hooks/useColmenaData";
import { Grafico } from "./Components/Grafico";
import { StatusPanel } from "./Components/StatusPanel";
import { TemperatureStats } from "./Components/TemperatureStats";

function App() {
  const {
    data,
    latestData,
    connectionStatus,
    loading,
    error,
    temperatureStats,
  } = useColmenaData();

  return (
    <div className="container" style={{ 
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px'
    }}>
      <h1 style={{ 
        textAlign: 'center', 
        color: '#ffffffff',
        borderBottom: '2px solid #C2AF67',
        paddingBottom: '10px',
        textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
      }}>
        MONITOREO DE COLMENA
      </h1>
      
      <StatusPanel 
        connectionStatus={connectionStatus}
        loading={loading}
        error={error}
      />
      
      <TemperatureStats temperatureStats={temperatureStats} />
      
      <Grafico data={data} />
    </div>
  );
}

export default App;
