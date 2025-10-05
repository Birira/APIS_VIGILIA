import React from 'react';

export const StatusPanel = ({ connectionStatus, loading, error }) => {
  const isConnected = connectionStatus.includes('Connected');
  
  return (
    <div 
      className="status-panel" 
      style={{
        color: '#000',
        background: isConnected ? '#298329ff' : '#ff9494ff',
        padding: '10px',
        borderRadius: '5px',
        marginBottom: '20px',
        border: '1px solid #ddd',
      }}
    >
      <p style={{ 
        margin: '5px 0'
      }}>
        ESTADO DE CONEXIÓN: {' '}
        <span style={{ 
          color: isConnected ? 'green' : 'red',
          textShadow: '1px 1px 2px rgba(10, 7, 7, 0.7)'
        }}>
          {connectionStatus.toUpperCase()}
        </span>
      </p>
      {loading && (
        <p style={{ 
          color: 'blue',
          margin: '5px 0'
        }}>
          CARGANDO DATOS...
        </p>
      )}
      {error && (
        <p style={{ 
          color: 'red',
          margin: '5px 0'
        }}>
          {error.toUpperCase()}
        </p>
      )}
    </div>
  );
};