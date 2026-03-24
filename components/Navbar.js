import Link from "next/link";
import Image from "next/image";

const links = [
  { href: "/miembros", label: "Miembros" },
  { href: "/palmares", label: "Palmarés" },
  { href: "/normativa", label: "Normativa" },
];

export default function Navbar() {
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
            style={{ height: "auto" }}
          />
          <span className="font-[family-name:var(--font-bangers)] text-batman-yellow text-2xl tracking-widest group-hover:text-white transition-colors">
            Liga Batcarallo
          </span>
        </Link>
        <ul className="flex gap-1">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="block px-4 py-1 text-sm font-bold uppercase tracking-widest text-gotham-muted hover:text-black hover:bg-batman-yellow transition-colors"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
