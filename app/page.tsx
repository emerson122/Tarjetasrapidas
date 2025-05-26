'use client';
import { useEffect, useState } from 'react';

export default function Home() {
  const [dominio, setDominio] = useState('');
  const [pregunta, setPregunta] = useState('');
  const [tipo, setTipo] = useState('respuesta_unica');
  const [respuesta, setRespuesta] = useState('');
  const [opciones, setOpciones] = useState({ A: '', B: '', C: '', D: '', correcta: '' });
  const [flashcards, setFlashcards] = useState<any[]>([]);
  const [filtro, setFiltro] = useState('');
  const [indice, setIndice] = useState(0);
  const [mostrar, setMostrar] = useState(false);

  useEffect(() => {
    fetch('/api/flashcards')
      .then(res => res.json())
      .then(setFlashcards);
  }, []);

  const dominios = [...new Set(flashcards.map(f => f.dominio))];

  const guardar = async () => {
    const data = {
      dominio,
      pregunta,
      tipo,
      ...(tipo === 'respuesta_unica'
        ? { respuesta }
        : { opciones: { A: opciones.A, B: opciones.B, C: opciones.C, D: opciones.D }, correcta: opciones.correcta })
    };
    await fetch('/api/flashcards', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    alert('Guardado');
    location.reload();
  };

  const tarjetasFiltradas = flashcards.filter(f => f.dominio === filtro);
  const actual = tarjetasFiltradas[indice];

  return (
    <main style={{ fontFamily: 'sans-serif', padding: 20, backgroundColor: '#eafaf1', minHeight: '100vh' }}>
      <h1>🧠 Flashcards Interactivas</h1>

      <section style={seccion}>
        <h2>Crear Flashcard</h2>
        <input placeholder="Dominio" value={dominio} onChange={e => setDominio(e.target.value)} />
        <textarea placeholder="Pregunta" value={pregunta} onChange={e => setPregunta(e.target.value)} />
        <select value={tipo} onChange={e => setTipo(e.target.value)}>
          <option value="respuesta_unica">Respuesta única</option>
          <option value="opcion_multiple">Opción múltiple</option>
        </select>

        {tipo === 'respuesta_unica' ? (
          <textarea placeholder="Respuesta" value={respuesta} onChange={e => setRespuesta(e.target.value)} />
        ) : (
          <>
            <input placeholder="Opción A" value={opciones.A} onChange={e => setOpciones({ ...opciones, A: e.target.value })} />
            <input placeholder="Opción B" value={opciones.B} onChange={e => setOpciones({ ...opciones, B: e.target.value })} />
            <input placeholder="Opción C" value={opciones.C} onChange={e => setOpciones({ ...opciones, C: e.target.value })} />
            <input placeholder="Opción D" value={opciones.D} onChange={e => setOpciones({ ...opciones, D: e.target.value })} />
            <input placeholder="Correcta (A, B, C o D)" value={opciones.correcta} onChange={e => setOpciones({ ...opciones, correcta: e.target.value })} />
          </>
        )}
        <button onClick={guardar}>Guardar</button>
      </section>

      <section style={seccion}>
        <h2>Modo Examen</h2>
        <select value={filtro} onChange={e => { setFiltro(e.target.value); setIndice(0); setMostrar(false); }}>
          <option value="">-- Selecciona un dominio --</option>
          {dominios.map(d => <option key={d} value={d}>{d}</option>)}
        </select>

        {actual && (
          <div style={{ marginTop: 20 }}>
            <h3>{actual.pregunta}</h3>
            {actual.tipo === 'opcion_multiple' && (
              <ul>
                {Object.entries(actual.opciones).map(([k, v]) => <li key={k}>{k}: {v}</li>)}
              </ul>
            )}
            {mostrar && (
              <p style={{ background: '#fff8dc', padding: 10, borderRadius: 8 }}>
                {actual.tipo === 'respuesta_unica' ? actual.respuesta : `Correcta: ${actual.correcta}`}
              </p>
            )}
            <button onClick={() => setMostrar(true)}>Mostrar respuesta</button>
            <button onClick={() => { setIndice(i => i + 1); setMostrar(false); }}>Siguiente</button>
          </div>
        )}
      </section>
    </main>
  );
}

const seccion = {
  background: '#ffffff',
  border: '2px solid #b2dfdb',
  borderRadius: 12,
  padding: 20,
  margin: '20px 0'
};