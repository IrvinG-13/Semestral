// Importa los hooks necesarios para manejar estados, efectos y referencias
import { useEffect, useRef, useState } from 'react';

// Importa los componentes visuales utilizados en la pantalla
import {Text,View,StyleSheet,TouchableOpacity,Image,Modal,ImageBackground,} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { useAudioPlayer } from 'expo-audio';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import ConfettiCannon from 'react-native-confetti-cannon';

import { ANIMALES } from '../data/animales';

// Relaciona cada habitat con su imagen de fondo
const FONDOS = {
  sabana: require('../assets/sabana.jpg'),
  bosque: require('../assets/bosque.jpg'),
  oceano: require('../assets/oceano.jpg'),
  granja: require('../assets/granja.jpg'),
};

// Estructura inicial utilizada cuando todavia no existe progreso guardado
const PROGRESO_INICIAL = {
  rondasJugadas: 0,
  mejorPuntaje: 0,
  ultimoPuntaje: 0,
  totalPuntos: 0,
  totalErrores: 0,
  ultimoHabitat: '',
};

export default function AudioScreen({habitatSeleccionado,navigation,}) {
  // Obtiene los animales correspondientes al habitat seleccionado
  const animales = habitatSeleccionado
    ? ANIMALES[habitatSeleccionado] ?? []:[];

  // Crea el reproductor utilizado para los sonidos de los animales
  const player = useAudioPlayer(null);

  // Referencia utilizada para iniciar el efecto de confeti
  const confettiRef = useRef(null);

  // Indica si el usuario ya fallo en la pregunta actual
  const falloEnPreguntaRef = useRef(false);

  // Evita que el usuario responda varias veces rapidamente
  const respuestaBloqueadaRef = useRef(false);

  // Evita guardar dos veces el resultado de la misma ronda
  const rondaGuardadaRef = useRef(false);

  // Cola de animales que faltan por mostrar durante la ronda
  const [cola, setCola] = useState([]);

  // Contiene el animal mostrado y el animal del audio reproducido
  const [pregunta, setPregunta] = useState(null);

  // Controlan la visibilidad de los mensajes de exito y error
  const [mostrarExito, setMostrarExito] = useState(false);
  const [mostrarError, setMostrarError] = useState(false);

  // Cantidad de preguntas completadas durante la ronda
  const [encontrados, setEncontrados] = useState(0);

  // Puntaje obtenido respondiendo correctamente al primer intento
  const [puntaje, setPuntaje] = useState(0);

  // Cantidad de errores cometidos durante la ronda actual
  const [erroresRonda, setErroresRonda] = useState(0);

  // Indica si las cinco preguntas de la ronda terminaron
  const [rondaCompleta, setRondaCompleta] = useState(false);

  /*
    Detiene el audio cuando el usuario sale de la pantalla
    o cuando el componente deja de estar activo.
  */
  useEffect(() => {
    return () => {
      try {
        player.pause();
      } catch (error) {
        console.log('No se pudo detener el audio:', error);
      }
    };
  }, []);

  /*
    Inicia una nueva ronda cada vez que cambia
    el habitat seleccionado.
  */
  useEffect(() => {
    if (animales.length > 0) {
      iniciarRonda();
    } else {
      setPregunta(null);
    }

    return () => {
      try {
        player.pause();
      } catch (error) {
        console.log('No se pudo detener el audio:', error);
      }
    };
  }, [habitatSeleccionado]);

  /*
    Prepara una nueva ronda.

    Mezcla los animales, selecciona cinco y reinicia
    el puntaje, los errores, los mensajes y las referencias.
  */
  function iniciarRonda() {
    try {
      player.pause();
    } catch (error) {
      console.log('No se pudo detener el audio:', error);
    }

    // Crea una copia mezclada de la lista de animales
    const mezclados = [...animales].sort(
      () => Math.random() - 0.5
    );

    // Selecciona como maximo cinco animales para la ronda
    const ronda = mezclados.slice(0, 5);

    // Detiene el proceso si no existen animales disponibles
    if (ronda.length === 0) {
      setPregunta(null);
      return;
    }

    // Guarda los animales restantes dentro de la cola
    setCola(ronda.slice(1));

    // Reinicia todos los contadores
    setEncontrados(0);
    setPuntaje(0);
    setErroresRonda(0);

    // Cierra los mensajes y vuelve al modo de juego
    setMostrarExito(false);
    setMostrarError(false);
    setRondaCompleta(false);

    // Reinicia los controles internos de la ronda
    falloEnPreguntaRef.current = false;
    respuestaBloqueadaRef.current = false;
    rondaGuardadaRef.current = false;

    // Crea la primera pregunta de la ronda
    crearPregunta(ronda[0], animales);
  }

  /*
    Crea una pregunta utilizando un animal mostrado
    y un sonido que puede coincidir o no con ese animal.
  */
  function crearPregunta(animalMostrado, listaCompleta) {
    // Obtiene todos los animales diferentes al animal mostrado
    const otrosAnimales = listaCompleta.filter(
      (animal) => animal.id !== animalMostrado.id
    );

    // Por defecto utiliza el sonido correcto
    let audioAnimal = animalMostrado;

    // Existe un 65 por ciento de posibilidad de que coincidan
    const debeCoincidir = Math.random() < 0.65;

    /*
      Cuando no deben coincidir, selecciona aleatoriamente
      el sonido de otro animal.
    */
    if (!debeCoincidir && otrosAnimales.length > 0) {
      const posicionAleatoria = Math.floor(
        Math.random() * otrosAnimales.length
      );

      audioAnimal = otrosAnimales[posicionAleatoria];
    }

    // Reinicia los controles de la nueva pregunta
    falloEnPreguntaRef.current = false;
    respuestaBloqueadaRef.current = false;

    // Guarda la imagen mostrada y el audio seleccionado
    setPregunta({
      animalMostrado,
      audioAnimal,
    });

    // Carga el sonido dentro del reproductor
    try {
      player.replace(audioAnimal.audio);
    } catch (error) {
      console.log('No se pudo cargar el audio:', error);
    }
  }

  /*
    Reinicia el sonido desde el principio
    y comienza su reproduccion.
  */
  function reproducirAudio() {
    if (!pregunta) {
      return;
    }

    try {
      player.seekTo(0);
      player.play();
    } catch (error) {
      console.log('No se pudo reproducir el audio:', error);
    }
  }

  /*
    Compara la respuesta del usuario con la respuesta correcta.

    respuestaUsuario recibe true cuando se presiona Si
    y false cuando se presiona No.
  */
  function verificar(respuestaUsuario) {
    // Evita verificar si no existe pregunta o el boton esta bloqueado
    if (!pregunta || respuestaBloqueadaRef.current) {
      return;
    }

    // Bloquea temporalmente los botones de respuesta
    respuestaBloqueadaRef.current = true;

    // Comprueba si la imagen y el sonido pertenecen al mismo animal
    const coincide =
      pregunta.animalMostrado.id ===
      pregunta.audioAnimal.id;

    // Compara la respuesta correcta con la respuesta del jugador
    const respuestaCorrecta =
      respuestaUsuario === coincide;

    if (respuestaCorrecta) {
      // Aumenta la cantidad de preguntas completadas
      setEncontrados((cantidadAnterior) => {
        return cantidadAnterior + 1;
      });

      /*
        Solo suma un punto cuando el jugador responde
        correctamente en el primer intento.
      */
      if (!falloEnPreguntaRef.current) {
        setPuntaje((puntajeAnterior) => {
          return puntajeAnterior + 1;
        });
      }

      // Detiene el sonido actual
      try {
        player.pause();
      } catch (error) {
        console.log('No se pudo detener el audio:', error);
      }

      // Muestra el mensaje de respuesta correcta
      setMostrarExito(true);

      // Inicia el efecto de confeti
      setTimeout(() => {
        confettiRef.current?.start();
      }, 100);
    } else {
      // Registra que el jugador fallo en esta pregunta
      falloEnPreguntaRef.current = true;

      // Aumenta la cantidad de errores de la ronda
      setErroresRonda((erroresAnteriores) => {
        return erroresAnteriores + 1;
      });

      // Detiene el sonido actual
      try {
        player.pause();
      } catch (error) {
        console.log('No se pudo detener el audio:', error);
      }

      // Muestra el mensaje para volver a intentarlo
      setMostrarError(true);
    }
  }

  /*
    Cierra el mensaje de error, desbloquea los botones
    y reproduce nuevamente el sonido.
  */
  function intentarNuevamente() {
    setMostrarError(false);
    respuestaBloqueadaRef.current = false;
    reproducirAudio();
  }

  /*
    Avanza hacia el siguiente animal de la cola.

    Si la cola esta vacia, termina la ronda
    y guarda el progreso.
  */
  async function avanzar() {
    try {
      player.pause();
    } catch (error) {
      console.log('No se pudo detener el audio:', error);
    }

    // Cierra el mensaje de respuesta correcta
    setMostrarExito(false);

    // Finaliza la ronda cuando no quedan animales
    if (cola.length === 0) {
      await finalizarRonda();
      return;
    }

    // Extrae el siguiente animal y conserva los restantes
    const [siguienteAnimal, ...animalesRestantes] = cola;

    setCola(animalesRestantes);

    // Crea la siguiente pregunta
    crearPregunta(siguienteAnimal, animales);
  }

  /*
    Guarda el resultado una sola vez y cambia
    la pantalla al resumen final de la ronda.
  */
  async function finalizarRonda() {
    if (!rondaGuardadaRef.current) {
      rondaGuardadaRef.current = true;

      await guardarProgreso(
        puntaje,
        erroresRonda
      );
    }

    setRondaCompleta(true);
  }

  /*
    Recupera el progreso anterior, agrega los resultados
    de la nueva ronda y guarda todo en AsyncStorage.
  */
  async function guardarProgreso(
    puntajeFinal,
    erroresFinales
  ) {
    try {
      // Busca el progreso guardado anteriormente
      const progresoGuardado =
        await AsyncStorage.getItem(
          'progresoJugador'
        );

      // Usa los valores iniciales cuando no existe progreso
      let progresoAnterior = PROGRESO_INICIAL;

      if (progresoGuardado) {
        try {
          /*
            Convierte el texto guardado en un objeto
            y completa cualquier propiedad faltante.
          */
          progresoAnterior = {
            ...PROGRESO_INICIAL,
            ...JSON.parse(progresoGuardado),
          };
        } catch (error) {
          console.log(
            'El progreso guardado no tenía un formato válido.'
          );
        }
      }

      // Construye el nuevo progreso acumulado
      const nuevoProgreso = {
        rondasJugadas:
          progresoAnterior.rondasJugadas + 1,

        mejorPuntaje: Math.max(
          progresoAnterior.mejorPuntaje,
          puntajeFinal
        ),

        ultimoPuntaje: puntajeFinal,

        totalPuntos:
          progresoAnterior.totalPuntos +
          puntajeFinal,

        totalErrores:
          progresoAnterior.totalErrores +
          erroresFinales,

        ultimoHabitat: habitatSeleccionado,
      };

      // Guarda el objeto convertido en texto
      await AsyncStorage.setItem(
        'progresoJugador',
        JSON.stringify(nuevoProgreso)
      );
    } catch (error) {
      console.log(
        'Error al guardar el progreso:',
        error
      );
    }
  }

  /*
    Detiene el audio y regresa a la pantalla Inicio.
  */
  function handleVolverInicio() {
    try {
      player.pause();
    } catch (error) {
      console.log('No se pudo detener el audio:', error);
    }

    navigation.navigate('Inicio');
  }

  // Selecciona el fondo correspondiente al habitat actual
  const fondo =
    FONDOS[habitatSeleccionado] ?? FONDOS.sabana;

  /*
    Se muestra cuando el jugador entra a Audio
    sin haber seleccionado primero un habitat.
  */
  if (!habitatSeleccionado) {
    return (
      <SafeAreaView style={styles.containerSinHabitat}>
        <View style={styles.sinHabitat}>
          <View style={styles.iconoSinHabitat}>
            <Ionicons
              name="paw"
              size={60}
              color="#E2AD47"
            />
          </View>

          <Text style={styles.sinHabitatTexto}>
            Primero elige un hábitat en la pestaña Inicio
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  /*
    Se muestra al completar las cinco preguntas.
  */
  if (rondaCompleta) {
    return (
      <ImageBackground
        source={fondo}
        style={styles.fondo}
        resizeMode="cover"
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.centrador}>
            <View style={styles.tarjetaJuego}>
              <Image
                source={require('../assets/trofeo.png')}
                style={styles.imagenTrofeo}
              />

              <Text style={styles.tituloNaranja}>
                ¡Ronda completada!
              </Text>

              <Text style={styles.subtituloResultado}>
                Puntaje obtenido
              </Text>

              <Text style={styles.puntajeFinal}>
                {puntaje}
                <Text style={styles.puntajeDeCinco}>
                  /5
                </Text>
              </Text>

              <View style={styles.filaErrores}>
                <Ionicons
                  name="close-circle"
                  size={22}
                  color="#EF5350"
                />

                <Text style={styles.textoErrores}>
                  Errores cometidos: {erroresRonda}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.botonVerde}
                onPress={iniciarRonda}
                activeOpacity={0.8}
              >
                <Ionicons
                  name="refresh"
                  size={21}
                  color="white"
                />

                <Text style={styles.textoBoton}>
                  Jugar otra vez
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.botonNaranja}
                onPress={handleVolverInicio}
                activeOpacity={0.8}
              >
                <Ionicons
                  name="home"
                  size={21}
                  color="white"
                />

                <Text style={styles.textoBoton}>
                  Cambiar de hábitat
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </ImageBackground>
    );
  }

  /*
    Se muestra mientras todavia no existe una pregunta.
  */
  if (!pregunta) {
    return (
      <ImageBackground
        source={fondo}
        style={styles.fondo}
        resizeMode="cover"
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.cargandoContenedor}>
            <Ionicons
              name="hourglass-outline"
              size={48}
              color="white"
            />

            <Text style={styles.cargando}>
              Cargando animales...
            </Text>
          </View>
        </SafeAreaView>
      </ImageBackground>
    );
  }

  // Interfaz principal del juego
  return (
    <ImageBackground
      source={fondo}
      style={styles.fondo}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Encabezado con volver y contador */}
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.botonVolver}
            onPress={handleVolverInicio}
            activeOpacity={0.8}
          >
            <Ionicons
              name="arrow-back"
              size={20}
              color="white"
            />

            <Text style={styles.textoVolver}>
              Inicio
            </Text>
          </TouchableOpacity>

          <View style={styles.contadorBadge}>
            <Ionicons
              name="star"
              size={18}
              color="#FFD700"
            />

            <Text style={styles.contadorTexto}>
              {encontrados}/5
            </Text>
          </View>
        </View>

        {/* Tarjeta principal de la pregunta */}
        <View style={styles.centrador}>
          <View style={styles.tarjetaJuego}>
            <Text style={styles.tituloNaranja}>
              Adivina el sonido
            </Text>

            <Text style={styles.subtitulo}>
              ¿Qué sonido hace este animal?
            </Text>

            <Text style={styles.nombreAnimal}>
              {pregunta.animalMostrado.nombre}
            </Text>

            <Image
              source={pregunta.animalMostrado.imagen}
              style={styles.imagenAnimal}
            />

            <TouchableOpacity
              style={styles.botonVerde}
              onPress={reproducirAudio}
              activeOpacity={0.8}
            >
              <Ionicons
                name="volume-high"
                size={21}
                color="white"
              />

              <Text style={styles.textoBoton}>
                Escuchar sonido
              </Text>
            </TouchableOpacity>

            {/* Botones para responder Si o No */}
            <View style={styles.filaBotones}>
              <TouchableOpacity
                style={styles.botonSi}
                onPress={() => verificar(true)}
                activeOpacity={0.8}
              >
                <Ionicons
                  name="checkmark"
                  size={38}
                  color="white"
                />

                <Text style={styles.textoRespuesta}>
                  Sí
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.botonNo}
                onPress={() => verificar(false)}
                activeOpacity={0.8}
              >
                <Ionicons
                  name="close"
                  size={38}
                  color="white"
                />

                <Text style={styles.textoRespuesta}>
                  No
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Efecto visual mostrado al responder correctamente */}
        <ConfettiCannon
          ref={confettiRef}
          count={120}
          origin={{ x: -10, y: 0 }}
          autoStart={false}
          fadeOut
        />

        {/* Mensaje de respuesta correcta */}
        <Modal
          visible={mostrarExito}
          transparent
          animationType="fade"
          onRequestClose={() => {}}
        >
          <View style={styles.modalFondo}>
            <View style={styles.modal}>
              <View style={styles.iconoExito}>
                <Ionicons
                  name="checkmark-done"
                  size={54}
                  color="white"
                />
              </View>

              <Text style={styles.modalTitulo}>
                ¡Muy bien!
              </Text>

              <Text style={styles.modalTexto}>
                Respuesta correcta
              </Text>

              <Text style={styles.modalAnimal}>
                {pregunta.animalMostrado.nombre}
              </Text>

              <TouchableOpacity
                style={styles.botonVerde}
                onPress={avanzar}
                activeOpacity={0.8}
              >
                <Text style={styles.textoBoton}>
                  Siguiente
                </Text>

                <Ionicons
                  name="arrow-forward"
                  size={21}
                  color="white"
                />
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Mensaje mostrado cuando la respuesta es incorrecta */}
        <Modal
          visible={mostrarError}
          transparent
          animationType="fade"
          onRequestClose={() => {}}
        >
          <View style={styles.modalFondo}>
            <View style={styles.modal}>
              <Image
                source={require('../assets/denuevo.png')}
                style={styles.imagenDenuevo}
              />

              <Text style={styles.modalTitulo}>
                ¡Ups!
              </Text>

              <Text style={styles.modalTexto}>
                Inténtalo de nuevo
              </Text>

              <TouchableOpacity
                style={styles.botonVerde}
                onPress={intentarNuevamente}
                activeOpacity={0.8}
              >
                <Ionicons
                  name="volume-high"
                  size={20}
                  color="white"
                />

                <Text style={styles.textoBoton}>
                  Escuchar otra vez
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </ImageBackground>
  );
}

// Estilos visuales utilizados por la pantalla
const styles = StyleSheet.create({
  fondo: {
    flex: 1,
  },

  safeArea: {
    flex: 1,
  },

  containerSinHabitat: {
    flex: 1,
    backgroundColor: '#FBC531',
  },

  sinHabitat: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },

  iconoSinHabitat: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },

  sinHabitatTexto: {
    fontSize: 18,
    textAlign: 'center',
    color: '#333',
    fontWeight: '600',
    marginTop: 16,
  },

  cargandoContenedor: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  cargando: {
    marginTop: 12,
    textAlign: 'center',
    fontSize: 18,
    color: 'white',
    fontWeight: '600',
  },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },

  botonVolver: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.28)',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 22,
  },

  textoVolver: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 15,
    marginLeft: 6,
  },

  contadorBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.28)',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 22,
  },

  contadorTexto: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 6,
  },

  centrador: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },

  tarjetaJuego: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.94)',
    borderRadius: 30,
    padding: 24,
    alignItems: 'center',

    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: {
      width: 0,
      height: 6,
    },

    elevation: 8,
  },

  tituloNaranja: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#E2AD47',
    marginBottom: 4,
    textAlign: 'center',
  },

  subtitulo: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginBottom: 10,
  },

  subtituloResultado: {
    fontSize: 15,
    color: '#777',
    marginTop: 4,
  },

  puntajeFinal: {
    fontSize: 46,
    fontWeight: 'bold',
    color: '#E2AD47',
    marginBottom: 8,
  },

  puntajeDeCinco: {
    fontSize: 26,
    color: '#888',
  },

  filaErrores: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 22,
  },

  textoErrores: {
    fontSize: 15,
    color: '#666',
    marginLeft: 7,
  },

  nombreAnimal: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#E2AD47',
    marginBottom: 6,
    letterSpacing: 1,
  },

  imagenAnimal: {
    width: 160,
    height: 160,
    resizeMode: 'contain',
    marginBottom: 16,
  },

  imagenTrofeo: {
    width: 105,
    height: 105,
    resizeMode: 'contain',
    marginBottom: 10,
  },

  botonVerde: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#9DCB3C',
    width: '100%',
    padding: 14,
    borderRadius: 18,
    marginBottom: 10,
    gap: 8,
  },

  botonNaranja: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E2AD47',
    width: '100%',
    padding: 14,
    borderRadius: 18,
    marginBottom: 10,
    gap: 8,
  },

  textoBoton: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },

  filaBotones: {
    flexDirection: 'row',
    gap: 16,
    width: '100%',
    marginTop: 4,
  },

  botonSi: {
    flex: 1,
    backgroundColor: '#66BB6A',
    borderRadius: 18,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },

  botonNo: {
    flex: 1,
    backgroundColor: '#EF5350',
    borderRadius: 18,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },

  textoRespuesta: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 2,
  },

  modalFondo: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.45)',
  },

  modal: {
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 25,
    padding: 25,
    alignItems: 'center',
  },

  iconoExito: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#66BB6A',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },

  modalTitulo: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#E2AD47',
    textAlign: 'center',
  },

  modalTexto: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 6,
  },

  modalAnimal: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#E2AD47',
    marginTop: 8,
    marginBottom: 18,
  },

  imagenDenuevo: {
    width: 90,
    height: 90,
    resizeMode: 'contain',
    marginBottom: 10,
  },
});