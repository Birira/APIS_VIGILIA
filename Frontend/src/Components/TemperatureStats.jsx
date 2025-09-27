import React from 'react';

export const TemperatureStats = ({ temperatureStats }) => {
  if (!temperatureStats) return null;

  return (
    <div 
      className="temperature-stats" 
      style={{
        background: '#FFEE8C',
        padding: '20px',
        borderRadius: '5px',
        marginBottom: '30px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
        border: '1px solid #b0c4de',
      }}
    >
      <h2 style={{ 
        marginBottom: '15px',
        borderBottom: '1px solid #b0c4de',
        color: '#2c5282',
        fontSize: '1.8rem',
        textAlign: 'center',
        textTransform: 'uppercase',
        letterSpacing: '1px'
      }}>
        ESTADÍSTICAS DE TEMPERATURA
      </h2>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px'
      }}>
        <StatCard 
          value={`${temperatureStats.coefficientOfVariation}%`}
          label="Coeficiente de Variación"
          color="#FF5733"
        />
        
        <StatCard 
          value={`${temperatureStats.standardDeviation}°C`}
          label="Desviación Estándar"
          color="#2c5282"
        />
        
        <StatCard 
          value={`${temperatureStats.mean}°C`}
          label="Media"
          color="#38a169"
        />
        
        <StatCard 
          value={`${temperatureStats.min}°C - ${temperatureStats.max}°C`}
          label="Rango (Min - Max)"
          color="#3182ce"
          fontSize="18px"
        />
        
        <StatCard 
          value={temperatureStats.count}
          label="Muestras"
          color="#805ad5"
        />
      </div>
      
      <StatDescription />
    </div>
  );
};

// Helper component for individual stat cards
const StatCard = ({ value, label, color, fontSize = '24px' }) => (
  <div style={{
    textAlign: 'center',
    padding: '15px',
    background: 'white',
    borderRadius: '5px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  }}>
    <div style={{ 
      fontSize, 
      fontWeight: 'bold', 
      color,
      textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
    }}>
      {value}
    </div>
    <div style={{ 
      color: '#666', 
      fontSize: '14px',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      marginTop: '5px'
    }}>
      {label}
    </div>
  </div>
);

// Helper component for the explanation
const StatDescription = () => (
  <div style={{
    marginTop: '15px',
    padding: '10px',
    background: '#DBCC79',
    borderRadius: '5px',
    color: '#000000ff',
    lineHeight: '1.4'
  }}>
    <strong style={{ 
      textTransform: 'uppercase',
      letterSpacing: '1px'
    }}>
      ¿QUÉ SIGNIFICA EL COEFICIENTE DE VARIACIÓN?
    </strong><br/>
    EL COEFICIENTE DE VARIACIÓN (CV) ES UNA MEDIDA NORMALIZADA DE LA DISPERSIÓN QUE EXPRESA 
    LA DESVIACIÓN ESTÁNDAR COMO UN PORCENTAJE DE LA MEDIA. ES ÚTIL PARA COMPARAR LA VARIABILIDAD 
    RELATIVA ENTRE DIFERENTES CONJUNTOS DE DATOS. UN CV BAJO (&lt;10%) INDICA ALTA ESTABILIDAD, 
    MIENTRAS QUE UN CV ALTO (&gt;30%) INDICA ALTA VARIABILIDAD EN LAS TEMPERATURAS.
  </div>
);