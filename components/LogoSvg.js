/**
 * Logo SVG: Batman oval + silueta clásica de murciélago + balón de fútbol
 * ViewBox: 300x110
 *
 * El murciélago tiene:
 * - Orejas puntiagudas con muesca central
 * - Alas que arquean hacia arriba y bajan en punta exterior
 * - Cuerpo central donde se integra el balón de fútbol
 */
export default function LogoSvg({ width = 200, height = 73, className = "" }) {
  return (
    <svg
      viewBox="0 0 300 110"
      width={width}
      height={height}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Logo Liga Batcarallo"
    >
      {/* Sombra offset estilo cómic */}
      <ellipse cx="155" cy="62" rx="143" ry="48" fill="#000" />

      {/* Óvalo amarillo (emblema Batman) */}
      <ellipse cx="150" cy="57" rx="143" ry="48" fill="#f5c518" />
      <ellipse cx="150" cy="57" rx="143" ry="48" fill="none" stroke="#000" strokeWidth="5" />

      {/*
        Murciélago — silueta completa en una sola path.

        Puntos clave:
          - Orejas: L(133,3) y L(167,3)
          - Punta ala izq: aprox (8, 42)
          - Punta ala der: aprox (292, 42)
          - Arco superior ala izq pico: aprox (48, 15)
          - Arco superior ala der pico: aprox (252, 15)
          - Fondo: (150, 90)
      */}
      <path
        fill="#000"
        d="
          M 150 88
          C 128 87, 90 80, 56 70
          C 28 62, 8 50, 8 40
          C 8 28, 26 13, 48 16
          C 64 18, 82 30, 96 38
          C 103 20, 116 8, 128 14
          L 133 3
          L 139 17
          C 142 11, 146 9, 150 9
          C 154 9, 158 11, 161 17
          L 167 3
          L 172 14
          C 184 8, 197 20, 204 38
          C 218 30, 236 18, 252 16
          C 274 13, 292 28, 292 40
          C 292 50, 272 62, 244 70
          C 210 80, 172 87, 150 88
          Z
        "
      />

      {/* Balón de fútbol americano (rugby) en el cuerpo del murciélago */}
      <ellipse cx="150" cy="55" rx="22" ry="15" fill="#f5c518" />
      <ellipse cx="150" cy="55" rx="22" ry="15" fill="none" stroke="#000" strokeWidth="2" />

      {/* Costura central (meridiano vertical) */}
      <path
        d="M 150 41 C 154 48, 154 62, 150 70"
        fill="none"
        stroke="#000"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Cordones horizontales */}
      <line x1="144" y1="49" x2="156" y2="49" stroke="#000" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="141" y1="55" x2="159" y2="55" stroke="#000" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="144" y1="61" x2="156" y2="61" stroke="#000" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
