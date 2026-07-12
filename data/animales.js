// Lista de habitats disponibles en la aplicacion
export const HABITATS = [
  {
    // Identificador interno del habitat
    id: 'sabana',

    // Nombre que se muestra en la pantalla
    nombre: 'Sabana',

    // Descripcion breve del habitat
    descripcion: 'Leones y más',
  },
  {
    id: 'bosque',
    nombre: 'Bosque',
    descripcion: 'Animales del bosque',
  },
  {
    id: 'oceano',
    nombre: 'Océano',
    descripcion: 'Vida marina',
  },
  {
    id: 'granja',
    nombre: 'Granja',
    descripcion: 'Animales de granja',
  },
];

/*
  Objeto que organiza los animales por habitat.

  Cada propiedad del objeto corresponde al id
  de uno de los habitats definidos anteriormente.
*/
export const ANIMALES = {
  // Animales pertenecientes a la sabana
  sabana: [
    {
      // Identificador unico del animal
      id: 'leon',

      // Nombre que se muestra en la aplicacion
      nombre: 'LEON',

      // Archivo de audio con el sonido del animal
      audio: require('../assets/audios/leon.mp3'),

      // Imagen utilizada para representar al animal
      imagen: require('../assets/leon.png'),
    },
    {
      id: 'elefante',
      nombre: 'ELEFANTE',
      audio: require('../assets/audios/elefante.mp3'),
      imagen: require('../assets/elefante.png'),
    },
    {
      id: 'hiena',
      nombre: 'HIENA',
      audio: require('../assets/audios/hiena.mp3'),
      imagen: require('../assets/hiena.png'),
    },
    {
      id: 'jirafa',
      nombre: 'JIRAFA',
      audio: require('../assets/audios/jirafa.mp3'),
      imagen: require('../assets/jirafa.png'),
    },
    {
      id: 'chita',
      nombre: 'CHITA',
      audio: require('../assets/audios/chita.mp3'),
      imagen: require('../assets/chita.png'),
    },
  ],

  // Animales pertenecientes al bosque
  bosque: [
    {
      id: 'zorro',
      nombre: 'ZORRO',
      audio: require('../assets/audios/zorro.mp3'),
      imagen: require('../assets/zorro.png'),
    },
    {
      id: 'oso',
      nombre: 'OSO',
      audio: require('../assets/audios/oso.mp3'),
      imagen: require('../assets/oso.png'),
    },
    {
      id: 'mapache',
      nombre: 'MAPACHE',
      audio: require('../assets/audios/mapache.mp3'),
      imagen: require('../assets/mapache.png'),
    },
    {
      id: 'ardilla',
      nombre: 'ARDILLA',
      audio: require('../assets/audios/ardilla.mp3'),
      imagen: require('../assets/ardilla.png'),
    },
    {
      id: 'pajaro',
      nombre: 'PÁJARO',
      audio: require('../assets/audios/pajaro.mp3'),
      imagen: require('../assets/pajaro.png'),
    },
  ],

  // Animales pertenecientes al oceano
  oceano: [
    {
      id: 'nutria',
      nombre: 'NUTRIA',
      audio: require('../assets/audios/nutria.mp3'),
      imagen: require('../assets/nutria.png'),
    },
    {
      id: 'ballena',
      nombre: 'BALLENA',
      audio: require('../assets/audios/ballena.mp3'),
      imagen: require('../assets/ballena.png'),
    },
    {
      id: 'delfin',
      nombre: 'DELFIN',
      audio: require('../assets/audios/delfin.mp3'),
      imagen: require('../assets/delfin.png'),
    },
  ],

  // Animales pertenecientes a la granja
  granja: [
    {
      id: 'vaca',
      nombre: 'VACA',
      audio: require('../assets/audios/vaca.mp3'),
      imagen: require('../assets/vaca.png'),
    },
    {
      id: 'caballo',
      nombre: 'CABALLO',
      audio: require('../assets/audios/caballo.mp3'),
      imagen: require('../assets/caballo.png'),
    },
    {
      id: 'cerdo',
      nombre: 'CERDO',
      audio: require('../assets/audios/cerdo.mp3'),
      imagen: require('../assets/cerdo.png'),
    },
    {
      id: 'oveja',
      nombre: 'OVEJA',
      audio: require('../assets/audios/oveja.mp3'),
      imagen: require('../assets/oveja.png'),
    },
  ],
};