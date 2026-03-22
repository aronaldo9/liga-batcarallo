import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t-4 border-batman-yellow bg-black mt-auto">
      <div className="mx-auto max-w-5xl px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo-batcarallo.png"
            alt="Liga Batcarallo"
            width={64}
            height={35}
            className="object-contain"
          />
          <span className="font-[family-name:var(--font-bangers)] text-batman-yellow text-xl tracking-widest">
            Liga Batcarallo
          </span>
        </Link>
        <span className="text-gotham-muted text-xs uppercase tracking-wider">
          Liga privada Biwenger &copy; {new Date().getFullYear()}
        </span>
      </div>
    </footer>
  );
}
