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

function JugadoresPanel() {
  const [jugadores, setJugadores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resetId, setResetId] = useState(null);
  const [resetPass, setResetPass] = useState('');
  const [resetError, setResetError] = useState('');
  const [resetOk, setResetOk] = useState(false);

  async function cargar() {
    setLoading(true);
    try {
      const res = await fetch('/api/quiniela/jugadores');
      const data = await res.json();
      setJugadores(data.jugadores || []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { cargar(); }, []);

  async function toggleEliminado(userId, eliminadoActual) {
    await fetch('/api/quiniela/jugadores', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, eliminado: !eliminadoActual }),
    });
    cargar();
  }

  function abrirReset(id) {
    setResetId(id);
    setResetPass('');
    setResetError('');
    setResetOk(false);
  }

  function cerrarReset() {
    setResetId(null);
    setResetPass('');
    setResetError('');
    setResetOk(false);
  }

  async function handleResetPassword(userId) {
    setResetError('');
    if (!resetPass || resetPass.length < 8) {
      setResetError('Mínimo 8 caracteres');
      return;
    }
    const res = await fetch('/api/admin/password', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, password: resetPass }),
    });
    if (res.ok) {
      setResetOk(true);
      setTimeout(cerrarReset, 1500);
    } else {
      const data = await res.json();
      setResetError(data.error || 'Error');
    }
  }

  if (loading) return <p className="text-gotham-muted text-sm">Cargando...</p>;

  return (
    <div className="bg-gotham-card border-4 border-batman-yellow overflow-hidden" style={{ boxShadow: '6px 6px 0 #000' }}>
      <div className="bg-batman-yellow px-5 py-3">
        <h2 className="font-[family-name:var(--font-bangers)] text-black text-xl tracking-widest uppercase">
          Estado jugadores
        </h2>
      </div>
      <table className="w-full text-sm">
        <thead className="bg-black text-gotham-muted uppercase tracking-widest text-xs border-b-2 border-batman-yellow">
          <tr>
            <th className="px-4 py-2 text-left">Usuario</th>
            <th className="px-4 py-2 text-center">Ausencias</th>
            <th className="px-4 py-2 text-center">Estado</th>
            <th className="px-4 py-2 text-center">Quiniela</th>
            <th className="px-4 py-2 text-center">Contraseña</th>
          </tr>
        </thead>
        <tbody>
          {jugadores.map((j) => (
            <tr key={j.id} className={`border-t border-gotham-muted ${j.quiniela_eliminado ? 'opacity-60' : ''}`}>
              <td className="px-4 py-2 font-semibold text-gotham-text">{j.username}</td>
              <td className="px-4 py-2 text-center text-gotham-muted">{j.ausencias_consecutivas}</td>
              <td className="px-4 py-2 text-center">
                {j.quiniela_eliminado
                  ? <span className="text-red-400 font-bold text-xs uppercase">Eliminado</span>
                  : <span className="text-green-400 font-bold text-xs uppercase">Activo</span>
                }
              </td>
              <td className="px-4 py-2 text-center">
                <button
                  onClick={() => toggleEliminado(j.id, j.quiniela_eliminado)}
                  className={`text-xs font-bold uppercase tracking-widest px-3 py-1 border transition-colors ${
                    j.quiniela_eliminado
                      ? 'border-green-700 text-green-400 hover:bg-green-900'
                      : 'border-red-700 text-red-400 hover:bg-red-900'
                  }`}
                >
                  {j.quiniela_eliminado ? 'Rehabilitar' : 'Eliminar'}
                </button>
              </td>
              <td className="px-4 py-2 text-center">
                {resetId === j.id ? (
                  <div className="flex flex-col gap-1 items-center">
                    <div className="flex gap-1">
                      <input
                        type="password"
                        value={resetPass}
                        onChange={(e) => setResetPass(e.target.value)}
                        placeholder="Nueva contraseña"
                        className="bg-black border border-gotham-muted focus:border-batman-yellow outline-none px-2 py-1 text-gotham-text text-xs w-36"
                        onKeyDown={(e) => e.key === 'Enter' && handleResetPassword(j.id)}
                      />
                      <button
                        onClick={() => handleResetPassword(j.id)}
                        className="text-xs font-bold uppercase px-2 py-1 border border-batman-yellow text-batman-yellow hover:bg-batman-yellow hover:text-black transition-colors"
                      >
                        {resetOk ? '✓' : 'OK'}
                      </button>
                      <button
                        onClick={cerrarReset}
                        className="text-xs font-bold uppercase px-2 py-1 border border-gotham-muted text-gotham-muted hover:border-red-700 transition-colors"
                      >
                        ✕
                      </button>
                    </div>
                    {resetError && (
                      <p className="text-red-400 text-xs">{resetError}</p>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => abrirReset(j.id)}
                    className="text-xs font-bold uppercase tracking-widest px-3 py-1 border border-gotham-muted text-gotham-muted hover:border-batman-yellow hover:text-batman-yellow transition-colors"
                  >
                    Reset pass
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function AdminQuinielaPage() {
  const [jornadas, setJornadas] = useState([]);
  const [partidosPorJornada, setPartidosPorJornada] = useState({});
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('crear'); // 'crear' | 'resultados' | 'jugadores'

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
        {[
          { key: 'crear', label: 'Nueva jornada' },
          { key: 'resultados', label: 'Entrar resultados' },
          { key: 'jugadores', label: 'Jugadores' },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`px-4 py-1 text-sm font-bold uppercase tracking-widest border-2 transition-colors ${
              tab === key
                ? 'bg-batman-yellow text-black border-batman-yellow'
                : 'border-gotham-muted text-gotham-muted hover:border-batman-yellow'
            }`}
          >
            {label}
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

      {tab === 'jugadores' && <JugadoresPanel />}

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
