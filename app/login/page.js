'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Error al iniciar sesión');
      } else {
        router.refresh();
        router.push('/');
      }
    } catch {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div
        className="bg-gotham-card border-4 border-batman-yellow w-full max-w-sm overflow-hidden"
        style={{ boxShadow: '6px 6px 0 #000' }}
      >
        {/* Header */}
        <div className="bg-batman-yellow px-6 py-4 flex items-center gap-3">
          <Image
            src="/logo-batcarallo.png"
            alt="Liga Batcarallo"
            width={36}
            height={36}
            className="object-contain"
            style={{ height: 'auto' }}
          />
          <h1 className="font-[family-name:var(--font-bangers)] text-black text-2xl tracking-widest uppercase">
            Acceso a Gotham
          </h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-6 flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold uppercase tracking-widest text-batman-yellow">
              Usuario
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
              className="bg-black border-2 border-gotham-muted focus:border-batman-yellow outline-none px-3 py-2 text-gotham-text text-sm transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold uppercase tracking-widest text-batman-yellow">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="bg-black border-2 border-gotham-muted focus:border-batman-yellow outline-none px-3 py-2 text-gotham-text text-sm transition-colors"
            />
          </div>

          {error && (
            <p className="text-red-400 text-xs font-bold uppercase tracking-wider border border-red-800 bg-red-950 px-3 py-2">
              ⚠ {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-batman-yellow text-black font-black uppercase tracking-widest text-sm py-2 px-4 hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p className="px-6 pb-4 text-gotham-muted text-xs text-center">
          Liga Batcarallo · Solo miembros
        </p>
      </div>
    </div>
  );
}
