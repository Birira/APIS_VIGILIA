import React, { useState, useEffect } from 'react';

export const ConfiguracionHorarios = () => {
  const [horarios, setHorarios] = useState([]);
  const [nuevoHorario, setNuevoHorario] = useState({ hora_inicio: 9, hora_fin: 17 });
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });

  // Cargar horarios actuales al montar el componente
  useEffect(() => {
    cargarHorarios();
  }, []);

  const cargarHorarios = async () => {
    try {
      const response = await fetch('http://168.181.186.157/sonido/horarios');
      const data = await response.json();
      setHorarios(data.rangos.map(r => ({ hora_inicio: r.inicio, hora_fin: r.fin })));
    } catch (error) {
      mostrarMensaje('error', 'Error al cargar horarios');
      console.error('Error:', error);
    }
  };

  const agregarHorario = () => {
    // Validaciones
    if (nuevoHorario.hora_inicio >= nuevoHorario.hora_fin) {
      mostrarMensaje('error', 'La hora de inicio debe ser menor que la hora de fin');
      return;
    }
    
    if (nuevoHorario.hora_inicio < 0 || nuevoHorario.hora_fin > 24) {
      mostrarMensaje('error', 'Las horas deben estar entre 0 y 24');
      return;
    }

    setHorarios([...horarios, { ...nuevoHorario }]);
    setNuevoHorario({ hora_inicio: 9, hora_fin: 17 });
    mostrarMensaje('success', 'Horario agregado. Recuerda guardar los cambios.');
  };

  const eliminarHorario = (index) => {
    setHorarios(horarios.filter((_, i) => i !== index));
    mostrarMensaje('success', 'Horario eliminado. Recuerda guardar los cambios.');
  };

  const guardarHorarios = async () => {
    if (horarios.length === 0) {
      mostrarMensaje('error', 'Debe haber al menos un horario configurado');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://168.181.186.157/sonido/horarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(horarios)
      });

      if (response.ok) {
        const data = await response.json();
        mostrarMensaje('success', '✓ Horarios guardados correctamente. El Arduino los actualizará en los próximos 5 minutos.');
        cargarHorarios(); // Recargar para confirmar
      } else {
        const error = await response.json();
        mostrarMensaje('error', error.detail || 'Error al guardar horarios');
      }
    } catch (error) {
      mostrarMensaje('error', 'Error de conexión con el servidor');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const mostrarMensaje = (tipo, texto) => {
    setMensaje({ tipo, texto });
    setTimeout(() => setMensaje({ tipo: '', texto: '' }), 5000);
  };

  return (
    <div style={{
      background: 'white',
      padding: '30px',
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      maxWidth: '700px',
      margin: '20px auto'
    }}>
      <h2 style={{ 
        margin: '0 0 10px 0',
        color: '#333',
        borderBottom: '3px solid #C2AF67',
        paddingBottom: '10px'
      }}>
        ⚙️ Configuración de Horarios de Muestreo
      </h2>
      
      <p style={{ 
        color: '#666', 
        fontSize: '14px',
        marginBottom: '20px'
      }}>
        Define los rangos horarios en los que el Arduino enviará datos de sonido
      </p>

      {/* Mensaje de feedback */}
      {mensaje.texto && (
        <div style={{
          padding: '12px',
          marginBottom: '20px',
          borderRadius: '6px',
          background: mensaje.tipo === 'success' ? '#d4edda' : '#f8d7da',
          color: mensaje.tipo === 'success' ? '#155724' : '#721c24',
          border: `1px solid ${mensaje.tipo === 'success' ? '#c3e6cb' : '#f5c6cb'}`
        }}>
          {mensaje.texto}
        </div>
      )}

      {/* Lista de horarios actuales */}
      <div style={{ marginBottom: '30px' }}>
        <h3 style={{ fontSize: '18px', marginBottom: '15px', color: '#555' }}>
          📅 Horarios Activos ({horarios.length})
        </h3>
        
        {horarios.length === 0 ? (
          <div style={{
            padding: '20px',
            textAlign: 'center',
            color: '#999',
            border: '2px dashed #ddd',
            borderRadius: '8px'
          }}>
            No hay horarios configurados. Agrega al menos uno.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {horarios.map((h, index) => (
              <div 
                key={index}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '15px',
                  background: '#f8f9fa',
                  borderRadius: '8px',
                  border: '1px solid #e0e0e0'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ 
                    fontSize: '24px',
                    color: '#C2AF67'
                  }}>🕐</span>
                  <span style={{ 
                    fontSize: '16px', 
                    fontWeight: '500',
                    color: '#333'
                  }}>
                    {String(h.hora_inicio).padStart(2, '0')}:00 - {String(h.hora_fin).padStart(2, '0')}:00
                  </span>
                  <span style={{ 
                    fontSize: '12px',
                    color: '#666',
                    background: '#e9ecef',
                    padding: '2px 8px',
                    borderRadius: '4px'
                  }}>
                    {h.hora_fin - h.hora_inicio}h de duración
                  </span>
                </div>
                <button
                  onClick={() => eliminarHorario(index)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '6px',
                    border: 'none',
                    background: '#dc3545',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => e.target.style.background = '#c82333'}
                  onMouseLeave={(e) => e.target.style.background = '#dc3545'}
                >
                  🗑️ Eliminar
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Agregar nuevo horario */}
      <div style={{
        background: '#f8f9fa',
        padding: '20px',
        borderRadius: '8px',
        border: '2px dashed #C2AF67',
        marginBottom: '20px'
      }}>
        <h3 style={{ fontSize: '18px', marginBottom: '15px', color: '#555' }}>
          ➕ Agregar Nuevo Horario
        </h3>
        <div style={{
          display: 'flex',
          gap: '15px',
          alignItems: 'flex-end',
          flexWrap: 'wrap'
        }}>
          <div style={{ flex: '1', minWidth: '150px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: 'bold',
              color: '#555',
              fontSize: '14px'
            }}>
              🕐 Hora de Inicio
            </label>
            <input
              type="number"
              min="0"
              max="23"
              value={nuevoHorario.hora_inicio}
              onChange={(e) => setNuevoHorario({
                ...nuevoHorario, 
                hora_inicio: parseInt(e.target.value) || 0
              })}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '6px',
                border: '2px solid #ddd',
                fontSize: '16px',
                fontWeight: 'bold'
              }}
            />
            <small style={{ color: '#666', fontSize: '12px' }}>
              (0-23 horas)
            </small>
          </div>
          
          <div style={{ flex: '1', minWidth: '150px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: 'bold',
              color: '#555',
              fontSize: '14px'
            }}>
              🕐 Hora de Fin
            </label>
            <input
              type="number"
              min="1"
              max="24"
              value={nuevoHorario.hora_fin}
              onChange={(e) => setNuevoHorario({
                ...nuevoHorario, 
                hora_fin: parseInt(e.target.value) || 1
              })}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '6px',
                border: '2px solid #ddd',
                fontSize: '16px',
                fontWeight: 'bold'
              }}
            />
            <small style={{ color: '#666', fontSize: '12px' }}>
              (1-24 horas)
            </small>
          </div>

          <button
            onClick={agregarHorario}
            style={{
              padding: '12px 24px',
              borderRadius: '6px',
              border: 'none',
              background: '#28a745',
              color: 'white',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold',
              transition: 'background 0.2s',
              minWidth: '150px',
              alignSelf: 'flex-start',
              margin: '22px'
            }}
            onMouseEnter={(e) => e.target.style.background = '#218838'}
            onMouseLeave={(e) => e.target.style.background = '#28a745'}
          >
            ➕ Agregar
          </button>
        </div>
      </div>

      {/* Botón guardar */}
      <div style={{ textAlign: 'center' }}>
        <button
          onClick={guardarHorarios}
          disabled={loading || horarios.length === 0}
          style={{
            padding: '15px 40px',
            borderRadius: '8px',
            border: 'none',
            background: loading || horarios.length === 0 ? '#ccc' : '#C2AF67',
            color: 'white',
            cursor: loading || horarios.length === 0 ? 'not-allowed' : 'pointer',
            fontSize: '18px',
            fontWeight: 'bold',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            transition: 'all 0.2s',
            width: '100%',
            maxWidth: '400px'
          }}
          onMouseEnter={(e) => {
            if (!loading && horarios.length > 0) {
              e.target.style.background = '#a89555';
              e.target.style.transform = 'translateY(-2px)';
            }
          }}
          onMouseLeave={(e) => {
            if (!loading && horarios.length > 0) {
              e.target.style.background = '#C2AF67';
              e.target.style.transform = 'translateY(0)';
            }
          }}
        >
          {loading ? '⏳ Guardando...' : '💾 Guardar Configuración'}
        </button>
      </div>

      {/* Información adicional */}
      <div style={{
        marginTop: '20px',
        padding: '15px',
        background: '#e7f3ff',
        borderRadius: '6px',
        border: '1px solid #b3d9ff'
      }}>
        <p style={{ margin: '0', fontSize: '13px', color: '#004085' }}>
          ℹ️ <strong>Nota:</strong> El Arduino consultará los horarios automáticamente cada 5 minutos. 
          Los cambios se aplicarán en la próxima sincronización.
        </p>
      </div>
    </div>
  );
};
