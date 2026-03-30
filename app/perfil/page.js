"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PerfilPage() {
  const router = useRouter();
  const [actual, setActual] = useState("");
  const [nueva, setNueva] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [error, setError] = useState("");
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setOk(false);

    if (nueva !== confirmar) {
      setError("Las contraseñas nuevas no coinciden.");
      return;
    }

    setLoading(true);
    const res = await fetch("/api/auth/cambiar-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ actual, nueva }),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Error desconocido.");
    } else {
      setOk(true);
      setActual("");
      setNueva("");
      setConfirmar("");
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="mb-10">
        <p className="text-batman-yellow text-xs font-bold uppercase tracking-widest mb-2">
          Tu cuenta
        </p>
        <h1 className="font-[family-name:var(--font-bangers)] text-5xl sm:text-7xl text-batman-yellow tracking-widest"
          style={{ textShadow: "4px 4px 0 #000" }}>
          Perfil
        </h1>
        <div className="border-b-4 border-batman-yellow mt-4" />
      </div>

      <div className="bg-gotham-card border-4 border-batman-yellow p-6" style={{ boxShadow: "6px 6px 0 #000" }}>
        <h2 className="font-[family-name:var(--font-bangers)] text-batman-yellow text-2xl tracking-widest uppercase mb-6">
          Cambiar contraseña
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-gotham-muted text-xs uppercase tracking-widest mb-1">
              Contraseña actual
            </label>
            <input
              type="password"
              value={actual}
              onChange={(e) => setActual(e.target.value)}
              required
              className="w-full bg-black border-2 border-gotham-border text-gotham-text px-3 py-2 focus:outline-none focus:border-batman-yellow"
            />
          </div>

          <div>
            <label className="block text-gotham-muted text-xs uppercase tracking-widest mb-1">
              Nueva contraseña
            </label>
            <input
              type="password"
              value={nueva}
              onChange={(e) => setNueva(e.target.value)}
              required
              minLength={8}
              className="w-full bg-black border-2 border-gotham-border text-gotham-text px-3 py-2 focus:outline-none focus:border-batman-yellow"
            />
          </div>

          <div>
            <label className="block text-gotham-muted text-xs uppercase tracking-widest mb-1">
              Confirmar nueva contraseña
            </label>
            <input
              type="password"
              value={confirmar}
              onChange={(e) => setConfirmar(e.target.value)}
              required
              className="w-full bg-black border-2 border-gotham-border text-gotham-text px-3 py-2 focus:outline-none focus:border-batman-yellow"
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm font-bold">{error}</p>
          )}
          {ok && (
            <p className="text-green-400 text-sm font-bold">Contraseña actualizada correctamente.</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-batman-yellow text-black font-black uppercase tracking-widest px-6 py-3 hover:bg-white transition-colors disabled:opacity-50"
          >
            {loading ? "Guardando..." : "Cambiar contraseña"}
          </button>
        </form>
      </div>
    </div>
  );
}
