import Link from "next/link";
import Image from "next/image";

const sections = [
  {
    href: "/miembros",
    label: "Miembros",
    desc: "Los managers que se atreven a jugar en Gotham.",
    rotate: "-rotate-1",
  },
  {
    href: "/palmares",
    label: "Palmarés",
    desc: "Historial de campeones. Solo los mejores quedan en pie.",
    rotate: "rotate-1",
  },
  {
    href: "/normativa",
    label: "Normativa",
    desc: "Las reglas de la liga. Rómpelas y pagarás las consecuencias.",
    rotate: "-rotate-1",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col gap-20">

      {/* Hero */}
      <section className="relative overflow-hidden -mx-4 -mt-10">
        {/* Halftone background */}
        <div className="halftone absolute inset-0 opacity-40" />

        {/* Yellow diagonal stripe */}
        <div
          className="absolute inset-0 bg-batman-yellow opacity-10"
          style={{ clipPath: "polygon(0 30%, 100% 10%, 100% 70%, 0 90%)" }}
        />

        <div className="relative z-10 py-12 px-8 text-center flex flex-col items-center">
          {/* Eyebrow label */}
          <div className="inline-block border-2 border-batman-yellow px-4 py-1 mb-6 rotate-[-1deg]">
            <span className="text-batman-yellow text-xs font-bold uppercase tracking-widest">
              Liga privada · Biwenger · Gotham City
            </span>
          </div>

          {/* Logo imagen */}
          <div
            className="mb-2"
            style={{ filter: "drop-shadow(0 0 40px rgba(245,197,24,0.5))" }}
          >
            <Image
              src="/logo-batcarallo.png"
              alt="Liga Batcarallo"
              width={520}
              height={520}
              className="object-contain"
              priority
            />
          </div>

          {/* Subtitle panel */}
          <div
            className="inline-block bg-black border-4 border-batman-yellow px-6 py-3 rotate-1"
            style={{ boxShadow: "6px 6px 0 #f5c518" }}
          >
            <p className="text-gotham-text font-bold uppercase tracking-widest text-sm">
              El fantasy fútbol más oscuro de Gotham
            </p>
          </div>
        </div>
      </section>

      {/* Nav cards */}
      <section>
        <h2 className="font-[family-name:var(--font-bangers)] text-batman-yellow text-4xl tracking-widest mb-8 text-center">
          — Explora la Liga —
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {sections.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className={`block bg-gotham-card border-4 border-batman-yellow p-6 ${s.rotate} hover:rotate-0 hover:scale-105 transition-all duration-200 group`}
              style={{ boxShadow: "6px 6px 0 #000" }}
            >
              <h3 className="font-[family-name:var(--font-bangers)] text-batman-yellow text-3xl tracking-widest mb-3">
                {s.label}
              </h3>
              <p className="text-gotham-muted text-sm leading-relaxed">{s.desc}</p>
              <div className="mt-4 text-batman-yellow text-xs font-bold uppercase tracking-widest group-hover:underline">
                Ver más →
              </div>
            </Link>
          ))}
        </div>
      </section>

    </div>
  );
}
