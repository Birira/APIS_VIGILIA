import { useState, useEffect } from 'react'
import { getCsv } from "./Hooks/getCsv"

function App() {
  const [call, setCall] = useState([]);
  const [last, setLast] = useState([]);

  useEffect(() => {
    const fetchCall = async () => {
      const col = await getCsv();

      setCall(col);
      setLast(col[col.length - 1]);

    };
    fetchCall();
  }, []);

  const diffHoras = (fechaStr) => {
    const fecha = new Date(fechaStr.replace(" ", "T"));
    return ((Date.now() - fecha.getTime()) / 3600000).toFixed(1) + " h";
  };

  return (
    <>
      <div className="container pt-2">
        <div className="row">
          <h1>Registro de ultima actividad</h1>
          {call.map((col, index) => (
            <div className="col" key={index}>
              <div className="card bg-warning">
                <div className="card-body">
                  <p className="card-text">Peso: {col.peso}kg</p>
                  <p className="card-text">decibelios: {col.decibelios}db</p>
                  <p className="card-text">temperatura: {col.temperatura}°C</p>
                  <p className="card-text">Obtención: Hace {diffHoras(col.fecha)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <h1 className='text-center'>Ultima actividad</h1>
        <div className="container d-flex justify-content-center row p-2">
          <div className="card bg-success w-25">
            <div className="card-body ">
              <p className="card-text">Peso: {last.peso}kg</p>
              <p className="card-text">decibelios: {last.decibelios}db</p>
              <p className="card-text">temperatura: {last.temperatura}°C</p>
              <p className="card-text">Obtención: Hace {last.fecha}</p>
            </div>
          </div>
        </div>
      </div >
    </>
  );
};

export default App;
