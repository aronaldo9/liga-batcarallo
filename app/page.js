import Link from "next/link";
import Image from "next/image";
import db from "@/lib/db";
import { palmares, logrosIndividuales } from "@/data/palmares";
import { miembros } from "@/data/miembros";

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

async function getQuinielaInfo() {
  try {
    const [[abierta]] = await db.query(
      `SELECT id, numero, descripcion, fecha_limite
       FROM quiniela_jornadas WHERE estado = 'abierta' LIMIT 1`
    );
    if (abierta) return { tipo: "abierta", jornada: abierta };

    const [[ultima]] = await db.query(
      `SELECT id, numero, descripcion
       FROM quiniela_jornadas WHERE estado = 'con_resultado'
       ORDER BY fecha_jornada DESC LIMIT 1`
    );
    if (!ultima) return null;

    const [top3] = await db.query(
      `SELECT u.username, r.puntos
       FROM quiniela_resultados r
       JOIN users u ON u.id = r.user_id
       WHERE r.jornada_id = ?
       ORDER BY r.puntos DESC LIMIT 3`,
      [ultima.id]
    );
    return { tipo: "resultado", jornada: ultima, top3 };
  } catch {
    return null;
  }
}

function getChampion(competicion) {
  let best = null;
  for (const { memberId, logros } of logrosIndividuales) {
    for (const logro of logros) {
      if (logro.competicion !== competicion || logro.posicion !== "Campeón/a" || !logro.temporada) continue;
      if (!best || logro.temporada > best.temporada) best = { memberId, temporada: logro.temporada };
    }
  }
  if (!best) return null;
  const miembro = miembros.find((m) => m.id === best.memberId);
  if (!miembro) return null;
  return { nombre: miembro.nombre, equipo: miembro.equipo, temporada: best.temporada };
}

const OTROS_TITULOS = [
  { label: "Segunda División", competicion: "Segunda División" },
  { label: "Copa Batcarallo", competicion: "Copa Batcarallo" },
  { label: "Champions Batcarallo", competicion: "Champions Batcarallo" },
];

export default async function Home() {
  const campeon = palmares[0] ?? null;
  const otrosCampeones = OTROS_TITULOS
    .map((t) => ({ ...t, data: getChampion(t.competicion) }))
    .filter((t) => t.data);
  const quiniela = await getQuinielaInfo();

  return (
    <div className="flex flex-col gap-20">

      {/* Hero */}
      <section className="relative overflow-hidden -mx-4 -mt-10">
        <div className="halftone absolute inset-0 opacity-40" />
        <div
          className="absolute inset-0 bg-batman-yellow opacity-10"
          style={{ clipPath: "polygon(0 30%, 100% 10%, 100% 70%, 0 90%)" }}
        />
        <div className="relative z-10 py-12 px-8 text-center flex flex-col items-center">
          <div className="inline-block border-2 border-batman-yellow px-4 py-1 mb-6 rotate-[-1deg]">
            <span className="text-batman-yellow text-xs font-bold uppercase tracking-widest">
              Liga privada · Biwenger · Gotham City
            </span>
          </div>
          <div
            className="mb-2"
            style={{ filter: "drop-shadow(0 0 40px rgba(245,197,24,0.5))" }}
          >
            <Image
              src="/logo-batcarallo.png"
              alt="Liga Batcarallo"
              width={520}
              height={520}
              className="object-contain w-full max-w-[320px] sm:max-w-[520px]"
              style={{ height: "auto" }}
              priority
            />
          </div>
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

      {/* Resumen */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">

        {/* Campeón actual */}
        {campeon && (
          <Link href="/palmares">
            <div
              className="bg-batman-yellow border-4 border-black p-5 h-full hover:scale-[1.02] transition-transform"
              style={{ boxShadow: "6px 6px 0 #000" }}
            >
    <p className="text-black text-xs font-black uppercase tracking-widest mb-1">
                🏆 Campeón · {campeon.temporada}
              </p>
              <p className="font-[family-name:var(--font-bangers)] text-black text-4xl tracking-widest leading-none">
                {campeon.campeon}
              </p>
              <p className="text-black/60 text-sm font-bold uppercase tracking-widest mt-1">
                {campeon.equipo}
              </p>
            </div>
          </Link>
        )}

        {/* Quiniela */}
        {quiniela && quiniela.tipo === "abierta" && (
          <Link href={`/quiniela/${quiniela.jornada.id}`}>
            <div
              className="bg-gotham-card border-4 border-batman-yellow p-5 h-full hover:scale-[1.02] transition-transform"
              style={{ boxShadow: "6px 6px 0 #000" }}
            >
              <p className="text-batman-yellow text-xs font-black uppercase tracking-widest mb-1">
                ⚡ Quiniela abierta
              </p>
              <p className="font-[family-name:var(--font-bangers)] text-gotham-text text-3xl tracking-widest leading-none">
                Jornada {quiniela.jornada.numero}
                {quiniela.jornada.descripcion && ` · ${quiniela.jornada.descripcion}`}
              </p>
              <p className="text-gotham-muted text-xs mt-2">
                Plazo: {new Date(quiniela.jornada.fecha_limite).toLocaleString("es-ES")}
              </p>
              <p className="text-batman-yellow text-xs font-bold uppercase tracking-widest mt-3">
                Enviar pronóstico →
              </p>
            </div>
          </Link>
        )}

        {quiniela && quiniela.tipo === "resultado" && (
          <Link href={`/quiniela/${quiniela.jornada.id}`}>
            <div
              className="bg-gotham-card border-4 border-batman-yellow p-5 h-full hover:scale-[1.02] transition-transform"
              style={{ boxShadow: "6px 6px 0 #000" }}
            >
              <p className="text-batman-yellow text-xs font-black uppercase tracking-widest mb-1">
                Última quiniela · Jornada {quiniela.jornada.numero}
                {quiniela.jornada.descripcion && ` · ${quiniela.jornada.descripcion}`}
              </p>
              <ol className="mt-2 flex flex-col gap-1">
                {quiniela.top3.map((u, i) => (
                  <li key={u.username} className="flex justify-between text-sm">
                    <span className="text-gotham-muted">
                      <span className="text-batman-yellow font-bold mr-2">{i + 1}.</span>
                      {u.username}
                    </span>
                    <span className="font-bold text-batman-yellow">{u.puntos} pts</span>
                  </li>
                ))}
              </ol>
              <p className="text-batman-yellow text-xs font-bold uppercase tracking-widest mt-3">
                Ver resultados →
              </p>
            </div>
          </Link>
        )}

        {!quiniela && (
          <Link href="/quiniela">
            <div
              className="bg-gotham-card border-4 border-gotham-border p-5 h-full hover:border-batman-yellow hover:scale-[1.02] transition-all"
              style={{ boxShadow: "6px 6px 0 #000" }}
            >
              <p className="text-batman-yellow text-xs font-black uppercase tracking-widest mb-1">
                Quiniela
              </p>
              <p className="text-gotham-muted text-sm">Aún no hay jornadas disponibles.</p>
            </div>
          </Link>
        )}
      </section>

      {/* Otros campeones de la temporada */}
      {otrosCampeones.length > 0 && (
        <section>
          <h2 className="font-[family-name:var(--font-bangers)] text-gotham-text text-3xl tracking-widest mb-6 text-center">
            — Campeones {campeon?.temporada} —
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {otrosCampeones.map((t) => (
              <div
                key={t.competicion}
                className="bg-gotham-card border-4 border-gotham-border p-5"
                style={{ boxShadow: "6px 6px 0 #000" }}
              >
                <p className="text-batman-yellow text-xs font-black uppercase tracking-widest mb-1">
                  🏆 {t.label}
                </p>
                <p className="font-[family-name:var(--font-bangers)] text-gotham-text text-2xl tracking-widest leading-none">
                  {t.data.nombre}
                </p>
                <p className="text-gotham-muted text-xs font-bold uppercase tracking-widest mt-1">
                  {t.data.equipo}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skyline */}
      <div className="relative -mx-4 overflow-hidden">
        <Image
          src="/skyline.png"
          alt="Gotham City"
          width={1920}
          height={400}
          className="w-full h-auto opacity-40"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gotham-bg via-transparent to-gotham-bg" />
      </div>

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
