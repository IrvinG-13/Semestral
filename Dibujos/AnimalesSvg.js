import React from 'react';

import {
  Circle,
  Ellipse,
  Path,
  Line,
} from 'react-native-svg';

export const dibujos = [
  { id: 'oveja', emoji: '🐑' },
  { id: 'cerdo', emoji: '🐷' },
  { id: 'caballo', emoji: '🐴' },
  { id: 'vaca', emoji: '🐮' },
  { id: 'jirafa', emoji: '🦒' },
];

export const iniciales = {
  oveja: {
    lanaCabeza: '#ffffff',
    cara: '#ffffff',
    orejaIzquierda: '#ffffff',
    orejaDerecha: '#ffffff',
    cuerpo: '#ffffff',
    patas: '#ffffff',
  },

  cerdo: {
    cabeza: '#ffffff',
    cuerpo: '#ffffff',
    orejaIzquierda: '#ffffff',
    orejaDerecha: '#ffffff',
    hocico: '#ffffff',
    patas: '#ffffff',
    cola: '#ffffff',
  },

  caballo: {
    cabeza: '#ffffff',
    cuerpo: '#ffffff',
    orejaIzquierda: '#ffffff',
    orejaDerecha: '#ffffff',
    hocico: '#ffffff',
    crin: '#ffffff',
    cola: '#ffffff',
    patas: '#ffffff',
  },

  vaca: {
    cabeza: '#ffffff',
    cuerpo: '#ffffff',
    orejaIzquierda: '#ffffff',
    orejaDerecha: '#ffffff',
    hocico: '#ffffff',
    manchas: '#ffffff',
    cuernos: '#ffffff',
    patas: '#ffffff',
    cola: '#ffffff',
  },

  jirafa: {
    cabeza: '#ffffff',
    cuello: '#ffffff',
    cuerpo: '#ffffff',
    orejaIzquierda: '#ffffff',
    orejaDerecha: '#ffffff',
    hocico: '#ffffff',
    cuernos: '#ffffff',
    manchas: '#ffffff',
    patas: '#ffffff',
    cola: '#ffffff',
  },
};

function OvejaSvg({ colorParte, pintar }) {
  return (
    <>
      {/* cuerpo tipo nube */}
      <Path
        d="
          M80 190
          C55 170, 65 135, 95 135
          C100 105, 135 105, 145 130
          C160 100, 200 108, 198 140
          C230 130, 255 155, 240 185
          C265 205, 248 240, 220 235
          C210 265, 175 260, 168 238
          C150 265, 112 255, 120 230
          C90 238, 60 215, 80 190
          Z
        "
        fill={colorParte('cuerpo')}
        stroke="black"
        strokeWidth="8"
        strokeLinejoin="round"
        onPressIn={() => pintar('cuerpo')}
      />

      {/* patas */}
      <Path
        d="
          M105 230 L105 285 Q105 300 125 300 L135 300 Q150 300 150 285 L150 235
          M190 232 L190 285 Q190 300 210 300 L220 300 Q235 300 235 285 L235 232
        "
        fill={colorParte('patas')}
        stroke="black"
        strokeWidth="8"
        strokeLinejoin="round"
        onPressIn={() => pintar('patas')}
      />

      {/* orejas */}
      <Path
        d="M83 115 C35 112, 28 165, 80 158 C95 145, 100 125, 83 115 Z"
        fill={colorParte('orejaIzquierda')}
        stroke="black"
        strokeWidth="8"
        strokeLinejoin="round"
        onPressIn={() => pintar('orejaIzquierda')}
      />

      <Path
        d="M237 115 C285 112, 292 165, 240 158 C225 145, 220 125, 237 115 Z"
        fill={colorParte('orejaDerecha')}
        stroke="black"
        strokeWidth="8"
        strokeLinejoin="round"
        onPressIn={() => pintar('orejaDerecha')}
      />

      {/* cara */}
      <Path
        d="
          M95 120
          C92 175, 110 210, 160 215
          C210 210, 228 175, 225 120
          C210 90, 110 90, 95 120
          Z
        "
        fill={colorParte('cara')}
        stroke="black"
        strokeWidth="8"
        strokeLinejoin="round"
        onPressIn={() => pintar('cara')}
      />

      {/* lana de la cabeza */}
      <Path
        d="
          M85 95
          C80 70, 108 55, 128 72
          C135 45, 170 45, 180 72
          C200 55, 232 72, 224 100
          C212 118, 185 118, 178 100
          C165 120, 135 120, 125 100
          C110 118, 90 112, 85 95
          Z
        "
        fill={colorParte('lanaCabeza')}
        stroke="black"
        strokeWidth="8"
        strokeLinejoin="round"
        onPressIn={() => pintar('lanaCabeza')}
      />

      {/* cara detalles */}
      <Circle cx="130" cy="145" r="9" fill="black" />
      <Circle cx="190" cy="145" r="9" fill="black" />
      <Circle cx="126" cy="140" r="3" fill="white" />
      <Circle cx="186" cy="140" r="3" fill="white" />

      <Path
        d="M145 165 Q160 178 175 165"
        fill="none"
        stroke="black"
        strokeWidth="6"
        strokeLinecap="round"
      />

      <Path
        d="M160 165 L160 185"
        fill="none"
        stroke="black"
        strokeWidth="5"
        strokeLinecap="round"
      />
    </>
  );
}

function CerdoSvg({ colorParte, pintar }) {
  return (
    <>
      {/* cola */}
      <Path
        d="M238 180 C285 160, 288 205, 255 198 C282 190, 270 172, 248 185"
        fill="none"
        stroke={colorParte('cola')}
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
        onPressIn={() => pintar('cola')}
      />

      {/* cuerpo */}
      <Path
        d="
          M95 160
          C115 120, 205 120, 240 165
          C270 205, 240 270, 165 270
          C95 270, 55 215, 95 160
          Z
        "
        fill={colorParte('cuerpo')}
        stroke="black"
        strokeWidth="8"
        strokeLinejoin="round"
        onPressIn={() => pintar('cuerpo')}
      />

      {/* patas */}
      <Path
        d="
          M95 238 L95 288 Q95 300 115 300 L125 300 Q140 300 138 285 L135 245
          M195 240 L195 288 Q195 300 215 300 L225 300 Q240 300 238 285 L235 240
        "
        fill={colorParte('patas')}
        stroke="black"
        strokeWidth="8"
        strokeLinejoin="round"
        onPressIn={() => pintar('patas')}
      />

      {/* orejas */}
      <Path
        d="M92 80 C60 55, 45 112, 84 125 C96 110, 105 92, 92 80 Z"
        fill={colorParte('orejaIzquierda')}
        stroke="black"
        strokeWidth="8"
        strokeLinejoin="round"
        onPressIn={() => pintar('orejaIzquierda')}
      />

      <Path
        d="M220 92 C255 60, 270 120, 232 132 C220 120, 212 102, 220 92 Z"
        fill={colorParte('orejaDerecha')}
        stroke="black"
        strokeWidth="8"
        strokeLinejoin="round"
        onPressIn={() => pintar('orejaDerecha')}
      />

      {/* cabeza */}
      <Path
        d="
          M78 115
          C88 60, 180 50, 225 100
          C260 140, 230 205, 160 210
          C95 215, 55 165, 78 115
          Z
        "
        fill={colorParte('cabeza')}
        stroke="black"
        strokeWidth="8"
        strokeLinejoin="round"
        onPressIn={() => pintar('cabeza')}
      />

      {/* hocico */}
      <Ellipse
        cx="155"
        cy="155"
        rx="42"
        ry="25"
        fill={colorParte('hocico')}
        stroke="black"
        strokeWidth="7"
        onPressIn={() => pintar('hocico')}
      />

      {/* detalles */}
      <Circle cx="112" cy="130" r="13" fill="black" />
      <Circle cx="198" cy="142" r="13" fill="black" />
      <Circle cx="108" cy="124" r="4" fill="white" />
      <Circle cx="194" cy="136" r="4" fill="white" />

      <Circle cx="140" cy="155" r="4" fill="black" />
      <Circle cx="170" cy="155" r="4" fill="black" />

      <Path
        d="M135 175 Q155 195 178 175"
        fill="none"
        stroke="black"
        strokeWidth="6"
        strokeLinecap="round"
      />

      <Path
        d="M150 178 C150 205, 180 208, 178 180"
        fill="none"
        stroke="black"
        strokeWidth="5"
        strokeLinecap="round"
      />
    </>
  );
}

function CaballoSvg({ colorParte, pintar }) {
  return (
    <>
      {/* cola */}
      <Path
        d="
          M230 170
          C280 145, 290 210, 250 218
          C278 225, 258 255, 228 232
          C240 210, 242 185, 230 170
          Z
        "
        fill={colorParte('cola')}
        stroke="black"
        strokeWidth="8"
        strokeLinejoin="round"
        onPressIn={() => pintar('cola')}
      />

      {/* cuerpo */}
      <Path
        d="
          M92 165
          C110 125, 205 120, 238 165
          C270 210, 235 270, 160 270
          C90 270, 55 215, 92 165
          Z
        "
        fill={colorParte('cuerpo')}
        stroke="black"
        strokeWidth="8"
        strokeLinejoin="round"
        onPressIn={() => pintar('cuerpo')}
      />

      {/* patas */}
      <Path
        d="
          M95 235 L95 288 Q95 300 115 300 L125 300 Q140 300 138 285 L135 238
          M170 238 L170 290 Q170 303 190 303 L200 303 Q215 303 212 288 L210 238
          M220 235 L220 286 Q220 298 238 298 L248 298 Q263 298 260 284 L255 232
        "
        fill={colorParte('patas')}
        stroke="black"
        strokeWidth="8"
        strokeLinejoin="round"
        onPressIn={() => pintar('patas')}
      />

      {/* orejas */}
      <Path
        d="M100 72 C88 35, 130 35, 124 82 Z"
        fill={colorParte('orejaIzquierda')}
        stroke="black"
        strokeWidth="8"
        strokeLinejoin="round"
        onPressIn={() => pintar('orejaIzquierda')}
      />

      <Path
        d="M198 78 C215 40, 245 70, 215 105 Z"
        fill={colorParte('orejaDerecha')}
        stroke="black"
        strokeWidth="8"
        strokeLinejoin="round"
        onPressIn={() => pintar('orejaDerecha')}
      />

      {/* cabeza */}
      <Path
        d="
          M88 95
          C110 50, 190 55, 215 110
          C240 165, 200 215, 135 205
          C75 195, 55 140, 88 95
          Z
        "
        fill={colorParte('cabeza')}
        stroke="black"
        strokeWidth="8"
        strokeLinejoin="round"
        onPressIn={() => pintar('cabeza')}
      />

      {/* crin */}
      <Path
        d="
          M140 55
          C130 78, 105 78, 100 105
          C122 95, 132 115, 110 130
          C140 128, 145 150, 122 168
          C168 160, 190 130, 185 95
          C178 70, 162 58, 140 55
          Z
        "
        fill={colorParte('crin')}
        stroke="black"
        strokeWidth="7"
        strokeLinejoin="round"
        onPressIn={() => pintar('crin')}
      />

      {/* hocico */}
      <Ellipse
        cx="145"
        cy="155"
        rx="43"
        ry="28"
        fill={colorParte('hocico')}
        stroke="black"
        strokeWidth="7"
        onPressIn={() => pintar('hocico')}
      />

      {/* detalles */}
      <Circle cx="110" cy="125" r="12" fill="black" />
      <Circle cx="185" cy="135" r="12" fill="black" />
      <Circle cx="106" cy="119" r="4" fill="white" />
      <Circle cx="181" cy="129" r="4" fill="white" />

      <Circle cx="132" cy="155" r="4" fill="black" />
      <Circle cx="162" cy="155" r="4" fill="black" />

      <Path
        d="M130 175 Q150 195 174 175"
        fill="none"
        stroke="black"
        strokeWidth="6"
        strokeLinecap="round"
      />
    </>
  );
}

function VacaSvg({ colorParte, pintar }) {
  return (
    <>
      {/* cola */}
      <Path
        d="M235 178 C280 165, 282 220, 250 215"
        fill="none"
        stroke={colorParte('cola')}
        strokeWidth="10"
        strokeLinecap="round"
        onPressIn={() => pintar('cola')}
      />

      <Path
        d="M252 210 C272 220, 270 245, 248 245 C250 232, 242 222, 252 210 Z"
        fill={colorParte('cola')}
        stroke="black"
        strokeWidth="7"
        strokeLinejoin="round"
        onPressIn={() => pintar('cola')}
      />

      {/* cuerpo */}
      <Path
        d="
          M88 165
          C110 120, 205 120, 240 165
          C270 210, 235 270, 160 270
          C90 270, 55 215, 88 165
          Z
        "
        fill={colorParte('cuerpo')}
        stroke="black"
        strokeWidth="8"
        strokeLinejoin="round"
        onPressIn={() => pintar('cuerpo')}
      />

      {/* manchas cuerpo */}
      <Path
        d="M85 205 C100 185, 125 195, 118 222 C100 228, 85 222, 85 205 Z"
        fill={colorParte('manchas')}
        stroke="black"
        strokeWidth="5"
        onPressIn={() => pintar('manchas')}
      />

      <Path
        d="M175 170 C195 150, 225 165, 215 195 C190 205, 172 192, 175 170 Z"
        fill={colorParte('manchas')}
        stroke="black"
        strokeWidth="5"
        onPressIn={() => pintar('manchas')}
      />

      <Path
        d="M175 230 C195 215, 222 230, 210 255 C190 260, 170 250, 175 230 Z"
        fill={colorParte('manchas')}
        stroke="black"
        strokeWidth="5"
        onPressIn={() => pintar('manchas')}
      />

      {/* patas */}
      <Path
        d="
          M95 235 L95 288 Q95 300 115 300 L125 300 Q140 300 138 285 L135 238
          M195 235 L195 288 Q195 300 215 300 L225 300 Q240 300 238 285 L235 238
        "
        fill={colorParte('patas')}
        stroke="black"
        strokeWidth="8"
        strokeLinejoin="round"
        onPressIn={() => pintar('patas')}
      />

      {/* orejas */}
      <Path
        d="M82 88 C35 70, 35 135, 88 128 C100 110, 100 95, 82 88 Z"
        fill={colorParte('orejaIzquierda')}
        stroke="black"
        strokeWidth="8"
        strokeLinejoin="round"
        onPressIn={() => pintar('orejaIzquierda')}
      />

      <Path
        d="M230 92 C278 75, 278 140, 225 130 C214 112, 214 98, 230 92 Z"
        fill={colorParte('orejaDerecha')}
        stroke="black"
        strokeWidth="8"
        strokeLinejoin="round"
        onPressIn={() => pintar('orejaDerecha')}
      />

      {/* cuernos */}
      <Path
        d="M115 60 C105 28, 142 35, 132 72"
        fill={colorParte('cuernos')}
        stroke="black"
        strokeWidth="7"
        strokeLinejoin="round"
        onPressIn={() => pintar('cuernos')}
      />

      <Path
        d="M200 65 C215 35, 245 55, 215 88"
        fill={colorParte('cuernos')}
        stroke="black"
        strokeWidth="7"
        strokeLinejoin="round"
        onPressIn={() => pintar('cuernos')}
      />

      {/* cabeza */}
      <Path
        d="
          M82 105
          C100 55, 200 60, 225 110
          C250 165, 205 215, 145 205
          C85 195, 55 150, 82 105
          Z
        "
        fill={colorParte('cabeza')}
        stroke="black"
        strokeWidth="8"
        strokeLinejoin="round"
        onPressIn={() => pintar('cabeza')}
      />

      {/* mancha cara */}
      <Path
        d="M190 90 C215 105, 210 150, 185 155 C168 135, 168 105, 190 90 Z"
        fill={colorParte('manchas')}
        stroke="black"
        strokeWidth="5"
        onPressIn={() => pintar('manchas')}
      />

      {/* hocico */}
      <Ellipse
        cx="150"
        cy="155"
        rx="45"
        ry="28"
        fill={colorParte('hocico')}
        stroke="black"
        strokeWidth="7"
        onPressIn={() => pintar('hocico')}
      />

      {/* detalles */}
      <Circle cx="112" cy="125" r="12" fill="black" />
      <Circle cx="188" cy="135" r="12" fill="black" />
      <Circle cx="108" cy="119" r="4" fill="white" />
      <Circle cx="184" cy="129" r="4" fill="white" />

      <Circle cx="135" cy="155" r="4" fill="black" />
      <Circle cx="165" cy="155" r="4" fill="black" />

      <Path
        d="M130 175 Q150 193 174 175"
        fill="none"
        stroke="black"
        strokeWidth="6"
        strokeLinecap="round"
      />
    </>
  );
}

function JirafaSvg({ colorParte, pintar }) {
  return (
    <>
      {/* cola */}
      <Path
        d="M235 165 C275 175, 272 220, 246 225"
        fill="none"
        stroke={colorParte('cola')}
        strokeWidth="9"
        strokeLinecap="round"
        onPressIn={() => pintar('cola')}
      />

      <Path
        d="M246 225 C265 230, 260 255, 238 250 C242 238, 238 230, 246 225 Z"
        fill={colorParte('cola')}
        stroke="black"
        strokeWidth="6"
        strokeLinejoin="round"
        onPressIn={() => pintar('cola')}
      />

      {/* cuerpo */}
      <Path
        d="
          M120 180
          C145 145, 230 150, 250 195
          C270 245, 235 285, 160 282
          C105 280, 85 225, 120 180
          Z
        "
        fill={colorParte('cuerpo')}
        stroke="black"
        strokeWidth="8"
        strokeLinejoin="round"
        onPressIn={() => pintar('cuerpo')}
      />

      {/* cuello */}
      <Path
        d="
          M120 160
          C115 120, 115 88, 130 60
          C150 55, 175 60, 185 82
          C168 110, 165 145, 170 185
          C150 195, 130 185, 120 160
          Z
        "
        fill={colorParte('cuello')}
        stroke="black"
        strokeWidth="8"
        strokeLinejoin="round"
        onPressIn={() => pintar('cuello')}
      />

      {/* manchas cuerpo y cuello */}
      <Circle
        cx="152"
        cy="145"
        r="13"
        fill={colorParte('manchas')}
        stroke="black"
        strokeWidth="5"
        onPressIn={() => pintar('manchas')}
      />

      <Circle
        cx="162"
        cy="195"
        r="17"
        fill={colorParte('manchas')}
        stroke="black"
        strokeWidth="5"
        onPressIn={() => pintar('manchas')}
      />

      <Circle
        cx="212"
        cy="205"
        r="18"
        fill={colorParte('manchas')}
        stroke="black"
        strokeWidth="5"
        onPressIn={() => pintar('manchas')}
      />

      <Circle
        cx="190"
        cy="248"
        r="15"
        fill={colorParte('manchas')}
        stroke="black"
        strokeWidth="5"
        onPressIn={() => pintar('manchas')}
      />

      {/* patas */}
      <Path
        d="
          M115 245 L115 300 Q115 312 135 312 L145 312 Q160 312 158 295 L155 250
          M215 245 L215 300 Q215 312 235 312 L245 312 Q260 312 258 295 L255 245
        "
        fill={colorParte('patas')}
        stroke="black"
        strokeWidth="8"
        strokeLinejoin="round"
        onPressIn={() => pintar('patas')}
      />

      {/* orejas */}
      <Path
        d="M95 75 C55 48, 50 112, 100 112 C110 95, 110 82, 95 75 Z"
        fill={colorParte('orejaIzquierda')}
        stroke="black"
        strokeWidth="8"
        strokeLinejoin="round"
        onPressIn={() => pintar('orejaIzquierda')}
      />

      <Path
        d="M215 75 C255 48, 260 112, 210 112 C200 95, 200 82, 215 75 Z"
        fill={colorParte('orejaDerecha')}
        stroke="black"
        strokeWidth="8"
        strokeLinejoin="round"
        onPressIn={() => pintar('orejaDerecha')}
      />

      {/* cuernos */}
      <Path
        d="M128 70 L118 28"
        fill="none"
        stroke="black"
        strokeWidth="8"
        strokeLinecap="round"
      />

      <Circle
        cx="116"
        cy="25"
        r="14"
        fill={colorParte('cuernos')}
        stroke="black"
        strokeWidth="7"
        onPressIn={() => pintar('cuernos')}
      />

      <Path
        d="M188 70 L198 28"
        fill="none"
        stroke="black"
        strokeWidth="8"
        strokeLinecap="round"
      />

      <Circle
        cx="200"
        cy="25"
        r="14"
        fill={colorParte('cuernos')}
        stroke="black"
        strokeWidth="7"
        onPressIn={() => pintar('cuernos')}
      />

      {/* cabeza */}
      <Path
        d="
          M85 105
          C100 55, 195 55, 225 105
          C250 150, 205 205, 145 198
          C85 190, 55 145, 85 105
          Z
        "
        fill={colorParte('cabeza')}
        stroke="black"
        strokeWidth="8"
        strokeLinejoin="round"
        onPressIn={() => pintar('cabeza')}
      />

      {/* hocico */}
      <Ellipse
        cx="150"
        cy="155"
        rx="50"
        ry="30"
        fill={colorParte('hocico')}
        stroke="black"
        strokeWidth="7"
        onPressIn={() => pintar('hocico')}
      />

      {/* pelo */}
      <Path
        d="M145 58 C135 78, 155 82, 145 102 C165 92, 160 72, 175 62"
        fill="none"
        stroke="black"
        strokeWidth="7"
        strokeLinecap="round"
      />

      {/* detalles */}
      <Circle cx="112" cy="125" r="10" fill="black" />
      <Circle cx="188" cy="125" r="10" fill="black" />
      <Circle cx="109" cy="120" r="3" fill="white" />
      <Circle cx="185" cy="120" r="3" fill="white" />

      <Circle cx="135" cy="155" r="4" fill="black" />
      <Circle cx="165" cy="155" r="4" fill="black" />

      <Path
        d="M135 175 Q150 190 168 175"
        fill="none"
        stroke="black"
        strokeWidth="6"
        strokeLinecap="round"
      />
    </>
  );
}

export const dibujosComponentes = {
  oveja: OvejaSvg,
  cerdo: CerdoSvg,
  caballo: CaballoSvg,
  vaca: VacaSvg,
  jirafa: JirafaSvg,
};