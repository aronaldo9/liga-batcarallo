'use client';

import { useState, useEffect } from 'react';

const OPCIONES = ['1', 'X', '2'];

function Input({ label, type = 'text', value, onChange, required, min }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-bold uppercase tracking-widest text-batman-yellow">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        min={min}
        className="bg-black border-2 border-gotham-muted focus:border-batman-yellow outline-none px-3 py-2 text-gotham-text text-sm transition-colors"
      />
    </div>
  );
}

function PartidoFields({ label, partido, onChange }) {
  return (
    <div className="border border-gotham-muted p-3 flex flex-col gap-2">
      <p className="text-xs font-bold uppercase tracking-widest text-gotham-muted">{label}</p>
      <div className="grid grid-cols-2 gap-2">
        <Input
          label="Local"
          value={partido.equipo_local}
          onChange={(v) => onChange({ ...partido, equipo_local: v })}
          required
        />
        <Input
          label="Visitante"
          value={partido.equipo_visitante}
          onChange={(v) => onChange({ ...partido, equipo_visitante: v })}
          required
        />
      </div>
    </div>
  );
}

function NuevaJornadaForm({ onCreada }) {
  const [numero, setNumero] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fechaJornada, setFechaJornada] = useState('');
  const [fechaLimite, setFechaLimite] = useState('');
  const [simple1, setSimple1] = useState({ tipo: 'simple', orden: 1, equipo_local: '', equipo_visitante: '' });
  const [simple2, setSimple2] = useState({ tipo: 'simple', orden: 2, equipo_local: '', equipo_visitante: '' });
  const [jornadaPartido, setJornadaPartido] = useState({ tipo: 'jornada', orden: 3, equipo_local: '', equipo_visitante: '' });
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setEnviando(true);
    try {
      const res = await fetch('/api/quiniela', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          numero: parseInt(numero),
          descripcion,
          fecha_jornada: fechaJornada,
          fecha_limite: fechaLimite,
          partidos: [simple1, simple2, jornadaPartido],
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Error al crear');
      } else {
        onCreada();
        setNumero(''); setDescripcion(''); setFechaJornada(''); setFechaLimite('');
        setSimple1({ tipo: 'simple', orden: 1, equipo_local: '', equipo_visitante: '' });
        setSimple2({ tipo: 'simple', orden: 2, equipo_local: '', equipo_visitante: '' });
        setJornadaPartido({ tipo: 'jornada', orden: 3, equipo_local: '', equipo_visitante: '' });
      }
    } catch {
      setError('Error de conexión');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <Input label="Número de jornada" type="number" value={numero} onChange={setNumero} required min="1" />
        <Input label="Descripción (opcional)" value={descripcion} onChange={setDescripcion} />
        <Input label="Fecha jornada" type="date" value={fechaJornada} onChange={setFechaJornada} required />
        <Input label="Plazo pronósticos" type="datetime-local" value={fechaLimite} onChange={setFechaLimite} required />
      </div>
      <PartidoFields label="Partido simple 1" partido={simple1} onChange={setSimple1} />
      <PartidoFields label="Partido simple 2" partido={simple2} onChange={setSimple2} />
      <PartidoFields label="★ Partido de jornada" partido={jornadaPartido} onChange={setJornadaPartido} />
      {error && (
        <p className="text-red-400 text-xs font-bold uppercase border border-red-800 bg-red-950 px-3 py-2">⚠ {error}</p>
      )}
      <button
        type="submit"
        disabled={enviando}
        className="bg-batman-yellow text-black font-black uppercase tracking-widest text-sm py-2 px-6 hover:bg-white transition-colors disabled:opacity-50 self-start"
      >
        {enviando ? 'Creando...' : 'Crear jornada'}
      </button>
    </form>
  );
}

function ResultadosForm({ jornada, partidos, onGuardado }) {
  const [resultados, setResultados] = useState({});
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');

  const todosSeleccionados = partidos.every((p) => resultados[p.id]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setEnviando(true);
    try {
      const res = await fetch(`/api/quiniela/${jornada.id}/resultado`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resultados }),
      });
      const data = await res.json();
      if (!res.ok) setError(data.error || 'Error');
      else onGuardado();
    } catch {
      setError('Error de conexión');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      {partidos.map((p) => (
        <div key={p.id} className="flex items-center justify-between gap-4">
          <span className="text-sm text-gotham-text flex-1">
            <span className="text-gotham-muted text-xs">{p.tipo === 'jornada' ? '★ ' : ''}</span>
            {p.equipo_local} vs {p.equipo_visitante}
          </span>
          <div className="flex gap-1">
            {OPCIONES.map((op) => (
              <button
                key={op}
                type="button"
                onClick={() => setResultados((prev) => ({ ...prev, [p.id]: op }))}
                className={`w-10 py-1 font-[family-name:var(--font-bangers)] text-lg tracking-widest border transition-colors ${
                  resultados[p.id] === op
                    ? 'bg-batman-yellow text-black border-batman-yellow'
                    : 'bg-transparent text-gotham-muted border-gotham-muted hover:border-batman-yellow'
                }`}
              >
                {op}
              </button>
            ))}
          </div>
        </div>
      ))}
      {error && (
        <p className="text-red-400 text-xs font-bold border border-red-800 bg-red-950 px-3 py-2">⚠ {error}</p>
      )}
      <button
        type="submit"
        disabled={!todosSeleccionados || enviando}
        className="bg-batman-yellow text-black font-black uppercase tracking-widest text-xs py-2 px-4 hover:bg-white transition-colors disabled:opacity-40 self-start"
      >
        {enviando ? 'Guardando...' : 'Guardar resultados'}
      </button>
    </form>
  );
}

export default function AdminQuinielaPage() {
  const [jornadas, setJornadas] = useState([]);
  const [partidosPorJornada, setPartidosPorJornada] = useState({});
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('crear'); // 'crear' | 'resultados'

  async function cargarJornadas() {
    setLoading(true);
    try {
      const res = await fetch('/api/quiniela');
      const data = await res.json();
      const jornadasSinResultado = (data.jornadas || []).filter(
        (j) => j.estado !== 'con_resultado'
      );
      setJornadas(jornadasSinResultado);

      // Cargar partidos de cada jornada sin resultado
      const partidosMap = {};
      await Promise.all(
        jornadasSinResultado.map(async (j) => {
          const r = await fetch(`/api/quiniela/${j.id}`);
          const d = await r.json();
          partidosMap[j.id] = d.partidos || [];
        })
      );
      setPartidosPorJornada(partidosMap);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { cargarJornadas(); }, []);

  async function cerrarJornada(id) {
    await fetch(`/api/quiniela/${id}`, { method: 'PATCH' });
    cargarJornadas();
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <p className="text-red-400 text-xs font-bold uppercase tracking-widest mb-1">Panel de Administración</p>
        <h1 className="font-[family-name:var(--font-bangers)] text-5xl text-batman-yellow tracking-widest"
          style={{ textShadow: '3px 3px 0 #000' }}>
          Quiniela Admin
        </h1>
        <div className="border-b-2 border-batman-yellow mt-4" />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {['crear', 'resultados'].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-1 text-sm font-bold uppercase tracking-widest border-2 transition-colors ${
              tab === t
                ? 'bg-batman-yellow text-black border-batman-yellow'
                : 'border-gotham-muted text-gotham-muted hover:border-batman-yellow'
            }`}
          >
            {t === 'crear' ? 'Nueva jornada' : 'Entrar resultados'}
          </button>
        ))}
      </div>

      {tab === 'crear' && (
        <div
          className="bg-gotham-card border-4 border-batman-yellow overflow-hidden"
          style={{ boxShadow: '6px 6px 0 #000' }}
        >
          <div className="bg-batman-yellow px-5 py-3">
            <h2 className="font-[family-name:var(--font-bangers)] text-black text-xl tracking-widest uppercase">
              Nueva jornada de quiniela
            </h2>
          </div>
          <div className="px-5 py-5">
            <NuevaJornadaForm onCreada={cargarJornadas} />
          </div>
        </div>
      )}

      {tab === 'resultados' && (
        <div className="flex flex-col gap-6">
          {loading && <p className="text-gotham-muted text-sm">Cargando...</p>}
          {!loading && jornadas.length === 0 && (
            <p className="text-gotham-muted text-sm">No hay jornadas pendientes de resultado.</p>
          )}
          {jornadas.map((j) => (
            <div
              key={j.id}
              className="bg-gotham-card border-4 border-batman-yellow overflow-hidden"
              style={{ boxShadow: '6px 6px 0 #000' }}
            >
              <div className="bg-batman-yellow px-5 py-3 flex items-center justify-between">
                <h2 className="font-[family-name:var(--font-bangers)] text-black text-xl tracking-widest uppercase">
                  Jornada {j.numero}{j.descripcion ? ` · ${j.descripcion}` : ''}
                </h2>
                {j.estado === 'abierta' && (
                  <button
                    onClick={() => cerrarJornada(j.id)}
                    className="text-xs font-bold uppercase tracking-widest bg-black text-red-400 border border-red-700 px-3 py-1 hover:bg-red-900 transition-colors"
                  >
                    Cerrar jornada
                  </button>
                )}
              </div>
              <div className="px-5 py-4">
                <ResultadosForm
                  jornada={j}
                  partidos={partidosPorJornada[j.id] || []}
                  onGuardado={cargarJornadas}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
