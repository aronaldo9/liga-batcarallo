import Link from 'next/link';
import Image from 'next/image';
import { cookies } from 'next/headers';
import { verifySessionToken } from '@/lib/auth';
import NavMenu from './NavMenu';

export default async function Navbar() {
  const cookieStore = await cookies();
  const token = cookieStore.get('batcarallo_session')?.value;
  const session = verifySessionToken(token);

  const links = [
    { href: '/miembros', label: 'Miembros' },
    { href: '/palmares', label: 'Palmarés' },
    { href: '/normativa', label: 'Normativa' },
    ...(session ? [
      { href: '/quiniela', label: 'Quiniela', highlight: true },
      { href: '/clasificacion', label: 'Clasificación', highlight: true },
    ] : []),
    ...(session?.is_admin ? [{ href: '/admin/quiniela', label: 'Admin', admin: true }] : []),
  ];

  return (
    <nav className="bg-black border-b-4 border-batman-yellow relative">
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

        <NavMenu links={links} session={session ? { username: session.username, is_admin: session.is_admin } : null} />
      </div>
    </nav>
  );
}
