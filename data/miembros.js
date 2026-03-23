export const miembros = [
  // Primera División
  { id: 1,  nombre: "Davor",             equipo: "Ficticius",         temporadas: 5, titulos: 2, division: "primera", imagen: "/espantapajaros.jpg", apodo: "El Retrovisores" },
  { id: 26, nombre: "Aarón",             equipo: "AronConCola",          temporadas: 5, titulos: 0, division: "primera", imagen: "/enigma.jpg",  apodo: "El Boss" },
  { id: 25, nombre: "Melo",              equipo: "Sporting de Melendry", temporadas: 5, titulos: 1, division: "primera", imagen: "/bane.jpg", apodo: "El Fiestas" },
  { id: 3,  nombre: "Dick Grayson",      equipo: "Nightwing FC",      temporadas: 5, titulos: 1, division: "primera", imagen: "/characters/nightwing.png" },
  { id: 3,  nombre: "Jason Todd",        equipo: "Red Hood United",   temporadas: 4, titulos: 0, division: "primera", imagen: "/characters/red-hood.png" },
  { id: 4,  nombre: "Tim Drake",         equipo: "Robin Athletic",    temporadas: 5, titulos: 1, division: "primera", imagen: "/characters/red-robin.png" },
  { id: 5,  nombre: "Damian Wayne",      equipo: "Al Ghul CF",        temporadas: 3, titulos: 0, division: "primera", imagen: "/characters/robin.png" },
  { id: 6,  nombre: "Barbara Gordon",    equipo: "Batgirl SC",        temporadas: 5, titulos: 1, division: "primera", imagen: "/characters/batgirl.png" },
  { id: 7,  nombre: "Lucius Fox",        equipo: "Wayne Enterprises", temporadas: 4, titulos: 0, division: "primera", imagen: "/characters/lucius.png" },
  { id: 8,  nombre: "Alfred Pennyworth", equipo: "Manor XI",          temporadas: 5, titulos: 0, division: "primera", imagen: "/characters/alfred.png" },
  { id: 9,  nombre: "Kate Kane",         equipo: "Batwoman City",     temporadas: 3, titulos: 0, division: "primera", imagen: "/characters/batwoman.png" },
  { id: 10, nombre: "Jim Gordon",        equipo: "GCPD United",       temporadas: 5, titulos: 1, division: "primera", imagen: "/characters/gordon.png" },
  { id: 11, nombre: "Cassandra Cain",    equipo: "Black Bat FC",      temporadas: 2, titulos: 0, division: "primera", imagen: "/characters/cassandra.png" },
  { id: 12, nombre: "Duke Thomas",       equipo: "Signal Sports",     temporadas: 2, titulos: 0, division: "primera", imagen: "/characters/signal.png" },

  // Segunda División
  { id: 13, nombre: "David",              equipo: "Batminero",         temporadas: 5, titulos: 0, division: "segunda", imagen: "/batminero.webp", apodo: "El Jefe Porrero" },
  { id: 14, nombre: "Ángel",             equipo: "Angel_glz",         temporadas: 4, titulos: 0, division: "segunda", imagen: "/becario.webp", apodo: "El Becario" },
  { id: 15, nombre: "Two-Face",          equipo: "Dent City",         temporadas: 5, titulos: 0, division: "segunda", imagen: "/characters/two-face.png" },
  { id: 16, nombre: "Riddler",           equipo: "Enigma United",     temporadas: 3, titulos: 0, division: "segunda", imagen: "/characters/riddler.png" },
  { id: 17, nombre: "Penguin",           equipo: "Iceberg Lounge SC", temporadas: 5, titulos: 0, division: "segunda", imagen: "/characters/penguin.png" },
  { id: 18, nombre: "Scarecrow",         equipo: "Fear Athletic",     temporadas: 4, titulos: 0, division: "segunda", imagen: "/characters/scarecrow.png" },
  { id: 19, nombre: "Bane",              equipo: "Venom CF",          temporadas: 3, titulos: 0, division: "segunda", imagen: "/characters/bane.png" },
  { id: 20, nombre: "Poison Ivy",        equipo: "Ivy Eleven",        temporadas: 4, titulos: 0, division: "segunda", imagen: "/characters/ivy.png" },
  { id: 21, nombre: "Mr. Freeze",        equipo: "Absolute Zero FC",  temporadas: 3, titulos: 0, division: "segunda", imagen: "/characters/freeze.png" },
  { id: 22, nombre: "Ra's al Ghul",      equipo: "League of Shadows", temporadas: 5, titulos: 0, division: "segunda", imagen: "/characters/ras.png" },
  { id: 23, nombre: "Talia al Ghul",     equipo: "Demon's Head XI",   temporadas: 2, titulos: 0, division: "segunda", imagen: "/characters/talia.png" },
  { id: 24, nombre: "Catwoman",          equipo: "Selina's Nine",     temporadas: 5, titulos: 0, division: "segunda", imagen: "/characters/catwoman.png" },
];

export const primera = miembros.filter((m) => m.division === "primera");
export const segunda = miembros.filter((m) => m.division === "segunda");
