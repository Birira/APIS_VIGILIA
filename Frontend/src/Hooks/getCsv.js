export async function getCsv() {
    const res = await fetch("http://127.0.0.1:8000/");
    const colmena = await res.json();
    return colmena;
};