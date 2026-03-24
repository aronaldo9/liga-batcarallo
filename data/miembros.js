export const miembros = [
  // Primera División
  { id: 1,  nombre: "Davor",             equipo: "Ficticius",         temporadas: 5, titulos: 2, division: "primera", imagen: "/espantapajaros.jpg", apodo: "El Retrovisores" },
  { id: 26, nombre: "Aarón",             equipo: "AronConCola",          temporadas: 5, titulos: 0, division: "primera", imagen: "/enigma.jpg",  apodo: "El Boss" },
  { id: 25, nombre: "Melo",              equipo: "Sporting de Melendry", temporadas: 5, titulos: 1, division: "primera", imagen: "/bane.jpg", apodo: "El Fiestas" },
  { id: 35, nombre: "Carras",            equipo: "Carras Team",          temporadas: 5, titulos: 0, division: "primera", imagen: "/s_grundy.png" },
  { id: 34, nombre: "Beto",              equipo: "Monchi Milolo",        temporadas: 5, titulos: 0, division: "primera", imagen: "/l_fox.png" },
  { id: 33, nombre: "Antonio",           equipo: "Antonio Barroso Cejudo", temporadas: 5, titulos: 0, division: "primera", imagen: "/strange.png" },
  { id: 32, nombre: "Kike",              equipo: "Kikebiri",             temporadas: 5, titulos: 0, division: "primera", imagen: "/gordon.png",  apodo: "El Biri" },
  { id: 31, nombre: "Alfonso",           equipo: "Gandalf El Blanco",    temporadas: 5, titulos: 0, division: "primera", imagen: "/szasz.png" },
  { id: 30, nombre: "Elvira",            equipo: "Lideresa",             temporadas: 5, titulos: 0, division: "primera", imagen: "/harley.png" },
  { id: 29, nombre: "Carlos",            equipo: "Carlosceju",           temporadas: 5, titulos: 0, division: "primera", imagen: "/pinguino.webp" },
  { id: 28, nombre: "Jorge",             equipo: "Tupac",                temporadas: 5, titulos: 0, division: "primera", imagen: "/mrfreeze.jpg", apodo: "El Cizañero" },
  { id: 27, nombre: "Paco",              equipo: "Enuma Elish",          temporadas: 5, titulos: 0, division: "primera", imagen: "/joker.jpg",  apodo: "El Celtista" },

  // Segunda División
  { id: 40, nombre: "Seko",              equipo: "Seko",                 temporadas: 5, titulos: 0, division: "segunda", imagen: "/deadshot.png" },
  { id: 39, nombre: "Mora",              equipo: "Hansi Flick",          temporadas: 5, titulos: 0, division: "segunda", imagen: "/sombrerero.png", apodo: "El Jota Jordi" },
  { id: 38, nombre: "Juanfra",           equipo: "JF",                   temporadas: 5, titulos: 0, division: "segunda", imagen: "/alfred.png",  apodo: "El de las Fresquitas" },
  { id: 37, nombre: "Harry",             equipo: "Harry FC",             temporadas: 5, titulos: 0, division: "segunda", imagen: "/twofaces.png", apodo: "El Polémico" },
  { id: 36, nombre: "Antonio",           equipo: "Largo",                temporadas: 5, titulos: 0, division: "segunda", imagen: "/clayface.png" },
  { id: 13, nombre: "David",              equipo: "Batminero",         temporadas: 5, titulos: 0, division: "segunda", imagen: "/batminero.webp", apodo: "El Jefe Porrero" },
  { id: 14, nombre: "Ángel",             equipo: "Angel_glz",         temporadas: 4, titulos: 0, division: "segunda", imagen: "/becario.webp", apodo: "El Becario" },
  { id: 45, nombre: "Verdú Team",        equipo: "Verdú Team",           temporadas: 5, titulos: 0, division: "segunda", imagen: "/croc.jpg" },
  { id: 43, nombre: "Isotopos",          equipo: "Isotopos",             temporadas: 5, titulos: 0, division: "segunda", imagen: "/marionetista.jpg" },
  { id: 44, nombre: "Legendario Cola",  equipo: "Legendario Cola",      temporadas: 5, titulos: 0, division: "segunda", imagen: "/ras.jpg" },
  { id: 41, nombre: "Vacante",           equipo: "—",                    temporadas: 0, titulos: 0, division: "segunda", imagen: "/skyline.png" },
  { id: 42, nombre: "Vacante",           equipo: "—",                    temporadas: 0, titulos: 0, division: "segunda", imagen: "/skyline.png" },
];

export const primera = miembros.filter((m) => m.division === "primera");
export const segunda = miembros.filter((m) => m.division === "segunda");
