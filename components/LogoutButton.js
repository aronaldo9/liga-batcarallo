'use client';

import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.refresh();
    router.push('/');
  }

  return (
    <button
      onClick={handleLogout}
      className="block px-3 py-1 text-xs font-bold uppercase tracking-widest text-gotham-muted hover:text-black hover:bg-red-600 transition-colors"
    >
      Salir
    </button>
  );
}
