import Link from 'next/link';
import Image from 'next/image';
import { cookies } from 'next/headers';
import { verifySessionToken } from '@/lib/auth';
import LogoutButton from './LogoutButton';

const publicLinks = [
  { href: '/miembros', label: 'Miembros' },
  { href: '/palmares', label: 'Palmarés' },
  { href: '/normativa', label: 'Normativa' },
];

export default async function Navbar() {
  const cookieStore = await cookies();
  const token = cookieStore.get('batcarallo_session')?.value;
  const session = verifySessionToken(token);

  return (
    <nav className="bg-black border-b-4 border-batman-yellow">
      <div className="mx-auto max-w-5xl px-4 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-3 group">
          <Image
            src="/logo-batcarallo.png"
            alt="Liga Batcarallo"
            width={52}
            height={52}
            className="object-contain"
            style={{ height: 'auto' }}
          />
          <span className="font-[family-name:var(--font-bangers)] text-batman-yellow text-2xl tracking-widest group-hover:text-white transition-colors">
            Liga Batcarallo
          </span>
        </Link>

        <div className="flex items-center gap-1">
          <ul className="flex gap-1">
            {publicLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block px-4 py-1 text-sm font-bold uppercase tracking-widest text-gotham-muted hover:text-black hover:bg-batman-yellow transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            {session && (
              <li>
                <Link
                  href="/quiniela"
                  className="block px-4 py-1 text-sm font-bold uppercase tracking-widest text-batman-yellow hover:text-black hover:bg-batman-yellow transition-colors"
                >
                  Quiniela
                </Link>
              </li>
            )}
            {session?.is_admin && (
              <li>
                <Link
                  href="/admin/quiniela"
                  className="block px-4 py-1 text-sm font-bold uppercase tracking-widest text-red-400 hover:text-black hover:bg-red-600 transition-colors"
                >
                  Admin
                </Link>
              </li>
            )}
          </ul>

          {session ? (
            <div className="flex items-center gap-1 ml-3 border-l border-gotham-muted pl-3">
              <span className="text-xs text-gotham-muted uppercase tracking-widest">
                {session.username}
              </span>
              <LogoutButton />
            </div>
          ) : (
            <Link
              href="/login"
              className="ml-3 block px-4 py-1 text-sm font-bold uppercase tracking-widest text-black bg-batman-yellow hover:bg-white transition-colors"
            >
              Entrar
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
