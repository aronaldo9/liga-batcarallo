"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NavMenu({ links, session }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <>
      {/* Desktop links */}
      <div className="hidden sm:flex items-center gap-1">
        <ul className="flex gap-1">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`block px-4 py-1 text-sm font-bold uppercase tracking-widest transition-colors ${
                  link.highlight
                    ? "text-batman-yellow hover:text-black hover:bg-batman-yellow"
                    : link.admin
                    ? "text-red-400 hover:text-black hover:bg-red-600"
                    : "text-gotham-muted hover:text-black hover:bg-batman-yellow"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {session ? (
          <div className="flex items-center gap-1 ml-3 border-l border-gotham-muted pl-3">
            <span className="text-xs text-gotham-muted uppercase tracking-widest">
              {session.username}
            </span>
            <form action="/api/logout" method="POST">
              <button
                type="submit"
                className="px-3 py-1 text-xs font-bold uppercase tracking-widest text-gotham-muted hover:text-black hover:bg-batman-yellow transition-colors"
              >
                Salir
              </button>
            </form>
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

      {/* Mobile hamburger */}
      <button
        className="sm:hidden flex flex-col gap-1.5 p-2"
        onClick={() => setOpen(!open)}
        aria-label="Menú"
      >
        <span className={`block w-6 h-0.5 bg-batman-yellow transition-transform ${open ? "rotate-45 translate-y-2" : ""}`} />
        <span className={`block w-6 h-0.5 bg-batman-yellow transition-opacity ${open ? "opacity-0" : ""}`} />
        <span className={`block w-6 h-0.5 bg-batman-yellow transition-transform ${open ? "-rotate-45 -translate-y-2" : ""}`} />
      </button>

      {/* Mobile menu */}
      {open && (
        <div className="sm:hidden absolute top-16 left-0 right-0 bg-black border-b-4 border-batman-yellow z-50">
          <ul className="flex flex-col">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`block px-6 py-4 text-sm font-bold uppercase tracking-widest border-b border-gotham-border transition-colors ${
                    link.highlight
                      ? "text-batman-yellow hover:bg-batman-yellow hover:text-black"
                      : link.admin
                      ? "text-red-400 hover:bg-red-600 hover:text-black"
                      : "text-gotham-muted hover:bg-batman-yellow hover:text-black"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="px-6 py-4 border-t border-gotham-border">
            {session ? (
              <div className="flex items-center justify-between">
                <span className="text-xs text-gotham-muted uppercase tracking-widest">
                  {session.username}
                </span>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1 text-xs font-bold uppercase tracking-widest text-gotham-muted hover:text-black hover:bg-batman-yellow transition-colors"
                >
                  Salir
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="block w-full text-center px-4 py-2 text-sm font-bold uppercase tracking-widest text-black bg-batman-yellow hover:bg-white transition-colors"
              >
                Entrar
              </Link>
            )}
          </div>
        </div>
      )}
    </>
  );
}
