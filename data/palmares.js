// Palmarés global por temporada (campeón de liga)
export const palmares = [
  { temporada: "2024/2025", campeon: "Davor",  equipo: "Ficticius",      puntos: 1971 },
  { temporada: "2023/2024", campeon: "Aarón",  equipo: "AronConCola",    puntos: 2155 },
  { temporada: "2022/2023", campeon: "Aarón",  equipo: "AronConCola",    puntos: 2094 },
  { temporada: "2021/2022", campeon: "Davor",  equipo: "Ficticius",      puntos: 2069 },
  { temporada: "2020/2021", campeon: "Davor",  equipo: "Ficticius",      puntos: 2104 },
  { temporada: "2019/2020", campeon: "Davor",  equipo: "Ficticius",      puntos: 1571 },
  { temporada: "2018/2019", campeon: "Aarón",  equipo: "AronConCola",    puntos: null },
];

// Logros individuales por jugador (memberId = id en miembros.js)
export const logrosIndividuales = [
  {
    memberId: 31, // Alfonso — Gandalf el Blanco
    logros: [
      { temporada: "2024/2025", competicion: "Primera División", posicion: "6º clasificado" },
      { temporada: "2023/2024", competicion: "Segunda División", posicion: "3er clasificado" },
      { temporada: "2025",      competicion: "Mundial de Clubes", posicion: "5º clasificado" },
    ],
  },
  {
    memberId: 1, // Davor — Ficticius
    logros: [
      // Primera División
      { temporada: "2024/2025", competicion: "Primera División",          posicion: "Campeón/a" },
      { temporada: null,        competicion: "Final Supercopa Batcarallo", posicion: "Campeón/a" },
      { temporada: null,        competicion: "Supercopa Nacional",         posicion: "Campeón/a" },
      { temporada: "2021/2022", competicion: "Primera División",          posicion: "Campeón/a" },
      { temporada: "2020/2021", competicion: "Primera División",          posicion: "Campeón/a" },
      { temporada: null,        competicion: "Supercopa Batcarallo",      posicion: "Campeón/a" },
      { temporada: null,        competicion: "Champions Batcarallo",      posicion: "Campeón/a" },
      { temporada: null,        competicion: "Copa Batcarallo",           posicion: "2º clasificado" },
      { temporada: null,        competicion: "Supercopa Batcarallo",      posicion: "Campeón/a" },
      // Segunda División
      { temporada: "2023/2024", competicion: "Segunda División",          posicion: "Campeón/a" },
      { temporada: "2019/2020", competicion: "Primera División",          posicion: "Campeón/a" },
      { temporada: null,        competicion: "Copa Batcarallo",           posicion: "2º clasificado" },
      { temporada: "2023/2024", competicion: "FA Cup Batcarallo",         posicion: "Campeón/a" },
      { temporada: "2020",      competicion: "Eurocopa",                  posicion: "2º clasificado" },
      { temporada: "2022",      competicion: "Mundial Catar",             posicion: "5º clasificado" },
    ],
  },
  {
    memberId: 26, // Aarón — AronConCola
    logros: [
      { temporada: "2023/2024", competicion: "Primera División",             posicion: "Campeón/a" },
      { temporada: "2022/2023", competicion: "Primera División",             posicion: "Campeón/a" },
      { temporada: "2018/2019", competicion: "Primera División",             posicion: "Campeón/a" },
      { temporada: "2021/2022", competicion: "Primera División",             posicion: "2º clasificado" },
      { temporada: null,        competicion: "Supercopa Nacional",           posicion: "2º clasificado" },
      { temporada: null,        competicion: "Champions Batcarallo",         posicion: "2º clasificado" },
      { temporada: null,        competicion: "Copa Batcarallo",              posicion: "Campeón/a" },
      { temporada: null,        competicion: "Champions Batcarallo",         posicion: "2º clasificado" },
      { temporada: null,        competicion: "Copa Batcarallo",              posicion: "Campeón/a" },
      { temporada: null,        competicion: "Final Supercopa Batcarallo",   posicion: "2º clasificado" },
      { temporada: null,        competicion: "Supercopa Semifinal Nacional", posicion: "Campeón/a" },
      { temporada: null,        competicion: "Copa Batcarallo",              posicion: "2º clasificado" },
      { temporada: "2019/2020", competicion: "Primera División",             posicion: "4º clasificado" },
      { temporada: "2017/2018", competicion: "Primera División",             posicion: "4º clasificado" },
      { temporada: "2016/2017", competicion: "Primera División",             posicion: "5º clasificado" },
      { temporada: "2015/2016", competicion: "Primera División",             posicion: "4º clasificado" },
      { temporada: "2022",      competicion: "Mundial Catar",                posicion: "4º clasificado" },
      { temporada: "2024",      competicion: "Eurocopa",                     posicion: "6º clasificado" },
    ],
  },
  {
    memberId: 25, // Melo — Sporting de Melendry
    logros: [
      { temporada: "2024/2025", competicion: "Primera División",   posicion: "4º clasificado" },
      { temporada: null,        competicion: "Champions Batcarallo", posicion: "2º clasificado" },
      { temporada: null,        competicion: "Copa Batcarallo",    posicion: "Campeón/a" },
      { temporada: "2023/2024", competicion: "Primera División",   posicion: "6º clasificado" },
      { temporada: "2022/2023", competicion: "Primera División",   posicion: "5º clasificado" },
      { temporada: "2021/2022", competicion: "Primera División",   posicion: "4º clasificado" },
      { temporada: "2020/2021", competicion: "Primera División",   posicion: "5º clasificado" },
      { temporada: "2020",      competicion: "Eurocopa",           posicion: "Campeón/a" },
      { temporada: "2022",      competicion: "Mundial Catar",      posicion: "Campeón/a" },
      { temporada: "2024",      competicion: "Copa América",       posicion: "4º clasificado" },
      { temporada: "2025",      competicion: "Mundial de Clubes",  posicion: "4º clasificado" },
    ],
  },
  {
    memberId: 35, // Carras — Carras Team
    logros: [
      { temporada: "2024/2025", competicion: "Primera División",  posicion: "5º clasificado" },
      { temporada: "2022/2023", competicion: "Primera División",  posicion: "2º clasificado" },
      { temporada: null,        competicion: "FA Cup Batcarallo", posicion: "2º clasificado" },
      { temporada: "2021/2022", competicion: "Segunda División",  posicion: "2º clasificado" },
      { temporada: "2024",      competicion: "Eurocopa",          posicion: "2º clasificado" },
      { temporada: "2022",      competicion: "Mundial Catar",     posicion: "3er clasificado" },
      { temporada: "2025",      competicion: "Mundial de Clubes", posicion: "Último clasificado" },
    ],
  },
  {
    memberId: 34, // Beto — Monchi Milolo
    logros: [
      { temporada: "2025/2026", competicion: "Supercopa Batcarallo",  posicion: "2º clasificado" },
      { temporada: "2024/2025", competicion: "Primera División",      posicion: "2º clasificado" },
      { temporada: null,        competicion: "Champions Batcarallo",  posicion: "Campeón/a" },
      { temporada: "2023/2024", competicion: "Primera División",      posicion: "5º clasificado" },
      { temporada: null,        competicion: "Supercopa Batcarallo",  posicion: "2º clasificado" },
      { temporada: null,        competicion: "Champions Batcarallo",  posicion: "Campeón/a" },
      { temporada: "2021/2022", competicion: "Primera División",      posicion: "6º clasificado" },
      { temporada: "2020/2021", competicion: "Primera División",      posicion: "2º clasificado" },
      { temporada: null,        competicion: "Champions Batcarallo",  posicion: "2º clasificado" },
      { temporada: "2019/2020", competicion: "Primera División",      posicion: "3er clasificado" },
      { temporada: "2020",      competicion: "Eurocopa",              posicion: "3er clasificado" },
    ],
  },
  {
    memberId: 33, // Antonio Barroso — Antonio (primera)
    logros: [
      { temporada: "2024/2025", competicion: "Primera División", posicion: "2º clasificado" },
      { temporada: "2023/2024", competicion: "Primera División", posicion: "6º clasificado" },
      { temporada: "2024",      competicion: "Eurocopa",         posicion: "7º clasificado" },
    ],
  },
  {
    memberId: 32, // Kike — Kikebiri
    logros: [
      { temporada: "2023/2024", competicion: "Primera División",  posicion: "Último clasificado" },
      { temporada: "2024/2025", competicion: "Segunda División",  posicion: "5º clasificado" },
      { temporada: "2022/2023", competicion: "Segunda División",  posicion: "2º clasificado" },
      { temporada: "2025",      competicion: "Mundial de Clubes", posicion: "Campeón/a" },
    ],
  },
  {
    memberId: 30, // Elvira — Lideresa
    logros: [
      { temporada: "2024/2025", competicion: "Primera División",          posicion: "3er clasificado" },
      { temporada: "2022/2023", competicion: "Primera División",          posicion: "3er clasificado" },
      { temporada: "2020/2021", competicion: "Segunda División",           posicion: "3er clasificado" },
      { temporada: null,        competicion: "Champions Batcarallo",      posicion: "Campeón/a" },
      { temporada: null,        competicion: "Final Supercopa Batcarallo", posicion: "2º clasificado" },
      { temporada: null,        competicion: "Supercopa Internacional",   posicion: "Campeón/a" },
    ],
  },
  {
    memberId: 29, // Carlos — Carlosceju
    logros: [
      { temporada: "2025/2026", competicion: "Supercopa Batcarallo", posicion: "Campeón/a" },
      { temporada: "2024/2025", competicion: "Segunda División",     posicion: "Campeón/a" },
      { temporada: "2024/2025", competicion: "Copa Batcarallo",      posicion: "2º clasificado" },
      { temporada: "2024/2025", competicion: "FA Cup Batcarallo",    posicion: "Campeón/a" },
    ],
  },
  {
    memberId: 28, // Jorge — Tupac
    logros: [
      { temporada: "2024/2025", competicion: "Primera División", posicion: "3er clasificado" },
      { temporada: "2023/2024", competicion: "Primera División", posicion: "3er clasificado" },
      { temporada: "2020/2021", competicion: "Primera División", posicion: "6º clasificado" },
    ],
  },
  {
    memberId: 27, // Paco — Enuma Elish
    logros: [
      { temporada: "2022/2023", competicion: "Primera División",   posicion: "4º clasificado" },
      { temporada: "2021/2022", competicion: "Primera División",   posicion: "5º clasificado" },
      { temporada: "2020/2021", competicion: "Primera División",   posicion: "4º clasificado" },
      { temporada: "2024",      competicion: "Eurocopa",           posicion: "3er clasificado" },
      { temporada: "2025",      competicion: "Mundial de Clubes",  posicion: "3er clasificado" },
    ],
  },
  { memberId: 40, logros: [] }, // Seko
  { memberId: 39, logros: [
    { temporada: "2020/2021", competicion: "Copa Batcarallo", posicion: "2º clasificado" },
  ] }, // Mora
  { memberId: 38, logros: [
    { temporada: "2021/2022", competicion: "FA Cup Batcarallo", posicion: "Campeón/a" },
    { temporada: "2021/2022", competicion: "Segunda División",  posicion: "3er clasificado" },
    { temporada: "2023/2024", competicion: "FA Cup Batcarallo", posicion: "2º clasificado" },
  ] }, // Juanfra
  { memberId: 37, logros: [
    { temporada: "2021/2022", competicion: "FA Cup Batcarallo", posicion: "2º clasificado" },
    { temporada: "2023/2024", competicion: "Segunda División",  posicion: "2º clasificado" },
  ] }, // Harry
  { memberId: 36, logros: [] }, // Antonio (segunda)
  { memberId: 13, logros: [
    { temporada: "2020/2021", competicion: "Segunda División", posicion: "Campeón/a" },
    { temporada: "2020/2021", competicion: "Copa Batcarallo",  posicion: "Campeón/a" },
  ] }, // David
  { memberId: 14, logros: [
    { temporada: "2019/2020", competicion: "Primera División", posicion: "2º clasificado" },
  ] }, // Ángel
  { memberId: 45, logros: [
    { temporada: "2022/2023", competicion: "Segunda División", posicion: "Campeón/a" },
    { temporada: "2022/2023", competicion: "Copa Batcarallo",  posicion: "Campeón/a" },
  ] }, // Verdú Team
  { memberId: 43, logros: [
    { temporada: "2024/2025", competicion: "FA Cup Batcarallo", posicion: "2º clasificado" },
  ] }, // Isotopos
  { memberId: 44, logros: [] }, // Legendario Cola
];
