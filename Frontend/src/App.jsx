import { useState, useEffect } from 'react'

function App() {
  const [call, setCall] = useState([])

  async function getCsv() {
    const res = await fetch("http://127.0.0.1:8000/");
    const colmena = await res.json();
    return colmena;
  }
  useEffect(() => {
    const fetchCall = async () => {

      const col = await getCsv();

      setCall(col);
    };
    fetchCall();
  }, [])

  const handleClick = () => {
    console.log(call);
  }

  const diffHoras = (fechaStr) => {
    const fecha = new Date(fechaStr.replace(" ", "T"));
    return ((Date.now() - fecha.getTime()) / 3600000).toFixed(1) + " h";
  };

  return (
    <>
      <div className=''>
        <button onClick={handleClick}>Fetch CSV</button>
      </div>

      <div className="container">
        <div className="row">
          {call.map((col, index) => (
            <div className="col" key={index}>
              <div className="card">
                <div className="card-body">
                  <p className="card-text">Peso: {col.peso}kg</p>
                  <p className="card-text">decibelios: {col.decibelios}db</p>
                  <p className="card-text">temperatura: {col.temperatura}*C</p>
                  <p className="card-text">Obtención: Hace {diffHoras(col.fecha)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default App
