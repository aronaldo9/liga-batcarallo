import { primera, segunda } from "@/data/miembros";
import { logrosIndividuales } from "@/data/palmares";
import MemberCard from "@/components/MemberCard";

function getLogros(memberId) {
  return logrosIndividuales.find((l) => l.memberId === memberId)?.logros ?? [];
}

function getTitulos(memberId) {
  return getLogros(memberId).filter((l) => l.posicion === "Campeón/a").length;
}

export const metadata = { title: "Miembros · Liga Batcarallo" };

function DivisionHeader({ title, subtitle }) {
  return (
    <div className="mb-8 mt-14 first:mt-0">
      <p className="text-batman-yellow text-xs font-bold uppercase tracking-widest mb-1">
        {subtitle}
      </p>
      <h2
        className="font-[family-name:var(--font-bangers)] text-5xl text-gotham-text tracking-widest"
        style={{ textShadow: "3px 3px 0 #000" }}
      >
        {title}
      </h2>
      <div className="border-b-4 border-gotham-border mt-4" />
    </div>
  );
}


export default function MiembrosPage() {
  return (
    <div>
      {/* Page header */}
      <div className="mb-12 relative">
        <div className="halftone absolute inset-0 opacity-20 -mx-4 rounded-none" />
        <div className="relative py-8 px-2">
          <p className="text-batman-yellow text-xs font-bold uppercase tracking-widest mb-2">
            Los elegidos de Gotham
          </p>
          <h1
            className="font-[family-name:var(--font-bangers)] text-7xl text-batman-yellow tracking-widest"
            style={{ textShadow: "4px 4px 0 #000" }}
          >
            Miembros
          </h1>
        </div>
        <div className="border-b-4 border-batman-yellow" />
      </div>

      {/* Primera División */}
      <DivisionHeader title="Primera División" subtitle="La élite de Gotham" />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {primera.map((m, i) => (
          <MemberCard key={m.id} miembro={{ ...m, titulos: getTitulos(m.id) }} logros={getLogros(m.id)} index={i} priority={i < 4} />
        ))}
      </div>

      {/* Segunda División */}
      <DivisionHeader title="Segunda División" subtitle="Ascendiendo desde las sombras" />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {segunda.map((m, i) => (
          <MemberCard key={m.id} miembro={{ ...m, titulos: getTitulos(m.id) }} logros={getLogros(m.id)} index={i} flippable={false} />
        ))}
      </div>
    </div>
  );
}
