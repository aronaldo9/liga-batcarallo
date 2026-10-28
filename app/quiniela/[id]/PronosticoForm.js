'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const OPCIONES = ['1', 'X', '2'];

export default function PronosticoForm({ jornadaId, partidos, valorInicial = {}, fechaLimite }) {
  const router = useRouter();
  const [seleccion, setSeleccion] = useState(valorInicial);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');
  const [plazoVencido, setPlazoVencido] = useState(
    () => !!fechaLimite && Date.now() > new Date(fechaLimite).getTime()
  );

  // Revisa el plazo mientras la página sigue abierta, sin depender de recargarla
  useEffect(() => {
    if (!fechaLimite || plazoVencido) return;
    const limite = new Date(fechaLimite).getTime();
    const id = setInterval(() => {
      if (Date.now() > limite) {
        setPlazoVencido(true);
        clearInterval(id);
      }
    }, 15000);
    return () => clearInterval(id);
  }, [fechaLimite, plazoVencido]);

  const todosSeleccionados = partidos.every((p) => seleccion[p.id]);
  const editando = Object.keys(valorInicial).length > 0;

  if (plazoVencido) {
    return (
      <p className="text-red-400 text-sm font-bold border border-red-800 bg-red-950 px-4 py-3">
        ⚠ El plazo de pronósticos ha terminado.
      </p>
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!todosSeleccionados || plazoVencido) return;
    setError('');
    setEnviando(true);
    try {
      const res = await fetch(`/api/quiniela/${jornadaId}/pronostico`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pronosticos: seleccion }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Error al enviar');
      } else {
        router.refresh();
      }
    } catch {
      setError('Error de conexión');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {partidos.map((partido) => (
        <div key={partido.id} className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            {partido.tipo === 'jornada' && (
              <span className="text-xs font-bold uppercase tracking-widest text-batman-yellow border border-batman-yellow px-2 py-0.5">
                Partido de jornada
              </span>
            )}
            {partido.tipo === 'simple' && (
              <span className="text-xs font-bold uppercase tracking-widest text-gotham-muted border border-gotham-muted px-2 py-0.5">
                Simple
              </span>
            )}
          </div>
          <p className="font-bold text-gotham-text">
            {partido.equipo_local} <span className="text-gotham-muted">vs</span> {partido.equipo_visitante}
          </p>
          <div className="flex gap-2">
            {OPCIONES.map((op) => {
              const activo = seleccion[partido.id] === op;
              return (
                <button
                  key={op}
                  type="button"
                  onClick={() => setSeleccion((prev) => ({ ...prev, [partido.id]: op }))}
                  className={`w-14 py-2 font-(family-name:--font-bangers) text-xl tracking-widest border-2 transition-colors ${
                    activo
                      ? 'bg-batman-yellow text-black border-batman-yellow'
                      : 'bg-transparent text-gotham-muted border-gotham-muted hover:border-batman-yellow hover:text-batman-yellow'
                  }`}
                >
                  {op}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {error && (
        <p className="text-red-400 text-xs font-bold uppercase tracking-wider border border-red-800 bg-red-950 px-3 py-2">
          ⚠ {error}
        </p>
      )}

      <button
        type="submit"
        disabled={!todosSeleccionados || enviando}
        className="bg-batman-yellow text-black font-black uppercase tracking-widest text-sm py-2 px-6 hover:bg-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed self-start"
      >
        {enviando ? 'Enviando...' : editando ? 'Actualizar pronóstico' : 'Enviar pronóstico'}
      </button>
    </form>
  );
}
