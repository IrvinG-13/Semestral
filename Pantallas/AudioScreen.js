import { useEffect, useState, useRef } from 'react';
import {  Text, View, StyleSheet, TouchableOpacity,  Image, Modal, ImageBackground} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAudioPlayer } from 'expo-audio';
import { Ionicons } from '@expo/vector-icons';
import ConfettiCannon from 'react-native-confetti-cannon';
import { ANIMALES } from '../data/animales';

// Fondo por hábitat
const FONDOS = {
  sabana: require('../assets/sabana.jpg'),
  bosque: require('../assets/bosque.jpg'),
  oceano: require('../assets/oceano.jpg'),
  granja: require('../assets/granja.jpg'),
};

export default function AudioScreen({ habitatSeleccionado, navigation }) {
  const animales = habitatSeleccionado ? ANIMALES[habitatSeleccionado] : [];
  const player = useAudioPlayer(null);
  const confettiRef = useRef(null);

  const [cola, setCola] = useState([]);
  const [pregunta, setPregunta] = useState(null);
  const [mostrarExito, setMostrarExito] = useState(false);
  const [mostrarError, setMostrarError] = useState(false);
  const [encontrados, setEncontrados] = useState(0);
  const [rondaCompleta, setRondaCompleta] = useState(false);

  useEffect(() => {
    return () => {
      try { player.pause(); } catch (e) {}
    };
  }, []);

  useEffect(() => {
    if (animales.length > 0) iniciarRonda();
    return () => {
      try { player.pause(); } catch (e) {}
    };
  }, [habitatSeleccionado]);

  function iniciarRonda() {
    const mezclados = [...animales].sort(() => Math.random() - 0.5);
    const ronda = mezclados.slice(0, 5);
    setCola(ronda.slice(1));
    setEncontrados(0);
    setRondaCompleta(false);
    crearPregunta(ronda[0], animales);
  }
  function crearPregunta(animalMostrado, listaCompleta) {
  const otros = listaCompleta.filter(a => a.id !== animalMostrado.id);

  let audioAnimal;

  if (Math.random() < 0.65) {
    audioAnimal = animalMostrado;
  } else {
    const disponibles = otros.filter(a => a.id !== pregunta?.audioAnimal?.id);

    audioAnimal =
      disponibles.length > 0
        ? disponibles[Math.floor(Math.random() * disponibles.length)]
        : otros[Math.floor(Math.random() * otros.length)];
  }

  setPregunta({ animalMostrado, audioAnimal });

  try {
    player.replace(audioAnimal.audio);
  } catch (e) {}
}

  function reproducirAudio() {
    if (!pregunta) return;
    try { player.seekTo(0); player.play(); } catch (e) {}
  }

function verificar(respuestaUsuario) {
  const coincide = pregunta.animalMostrado.id === pregunta.audioAnimal.id;

  if (respuestaUsuario === coincide) {
    setEncontrados(prev => prev + 1);
    setMostrarExito(true);
    setTimeout(() => confettiRef.current?.start(), 100);
  } else {
    try { player.pause(); } catch (e) {}
    setMostrarError(true);
  }
}

  function avanzar() {
    try { player.pause(); } catch (e) {}
    setMostrarExito(false);
    if (cola.length === 0) {
      setRondaCompleta(true);
    } else {
      const [siguiente, ...resto] = cola;
      setCola(resto);
      crearPregunta(siguiente, animales);
    }
  }

  function handleVolverInicio() {
    try { player.pause(); } catch (e) {}
    navigation.navigate('Inicio');
  }

  const fondo = FONDOS[habitatSeleccionado] ?? FONDOS.sabana;

  // ── SIN HÁBITAT ─────────────────────────────────────
  if (!habitatSeleccionado) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.sinHabitat}>
          <Ionicons name="paw" size={60} color="#E2AD47" />
          <Text style={styles.sinHabitatTexto}>
            Primero elige un hábitat en la pestaña Inicio
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // ── RONDA COMPLETA ───────────────────────────────────
  if (rondaCompleta) {
    return (
      <ImageBackground source={fondo} style={styles.fondo} resizeMode="cover">
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.centrador}>
            <View style={styles.tarjetaJuego}>
              <Image
                source={require('../assets/trofeo.png')}
                style={styles.imagenTrofeo}
              />
              <Text style={styles.tituloNaranja}>¡Ronda completada!</Text>
              <Text style={styles.subtitulo}>
                ¡Excelente trabajo!
              </Text>

              <TouchableOpacity
                style={styles.botonVerde}
                onPress={handleVolverInicio}
              >
                <Text style={styles.textoBoton}>Cambiar de hábitat</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.botonNaranja}
                onPress={iniciarRonda}
              >
                <Text style={styles.textoBoton}>Jugar otra vez</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </ImageBackground>
    );
  }

  if (!pregunta) {
    return (
      <ImageBackground source={fondo} style={styles.fondo} resizeMode="cover">
        <SafeAreaView style={styles.safeArea}>
          <Text style={styles.cargando}>Cargando...</Text>
        </SafeAreaView>
      </ImageBackground>
    );
  }

  // ── JUEGO PRINCIPAL ──────────────────────────────────
  return (
    <ImageBackground source={fondo} style={styles.fondo} resizeMode="cover">
      <SafeAreaView style={styles.safeArea}>

        {/* Header */}
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.botonVolver} onPress={handleVolverInicio}>
            <Ionicons name="arrow-back" size={20} color="white" />
          </TouchableOpacity>
          <View style={styles.contadorBadge}>
            <Ionicons name="star" size={16} color="#FFD700" />
            <Text style={styles.contadorTexto}> {encontrados}/5</Text>
          </View>
        </View>

        {/* Tarjeta juego */}
        <View style={styles.centrador}>
          <View style={styles.tarjetaJuego}>
            <Text style={styles.tituloNaranja}>Adivina el sonido</Text>
            <Text style={styles.subtitulo}>¿Que sonido hace este animal?</Text>

            <Text style={styles.nombreAnimal}>
              {pregunta.animalMostrado.nombre}
            </Text>

            <Image
              source={pregunta.animalMostrado.imagen}
              style={styles.imagenAnimal}
            />

            {/* Botón escuchar */}
            <TouchableOpacity style={styles.botonVerde} onPress={reproducirAudio}>
              <Ionicons name="volume-high" size={20} color="white" />
              <Text style={styles.textoBoton}>  Escuchar sonido</Text>
            </TouchableOpacity>

            {/* Botones Sí / No */}
            <View style={styles.filaBotones}>
              <TouchableOpacity
                style={styles.botonSi}
                onPress={() => verificar(true)}
              >
                <Ionicons name="checkmark" size={36} color="white" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.botonNo}
                onPress={() => verificar(false)}
              >
                <Ionicons name="close" size={36} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Confetis — se disparan al acertar */}
        <ConfettiCannon
          ref={confettiRef}
          count={120}
          origin={{ x: -10, y: 0 }}
          autoStart={false}
          fadeOut
        />

        {/* MODAL ÉXITO */}
        <Modal visible={mostrarExito} transparent animationType="fade">
          <View style={styles.modalFondo}>
            <View style={styles.modal}>
            <Text style={styles.modalTitulo}>¡Muy bien!</Text>
              <Text style={styles.modalTexto}>Respuesta correcta</Text>
              <Text style={styles.modalAnimal}>
                {pregunta.animalMostrado.nombre}
              </Text>
              <TouchableOpacity style={styles.botonVerde} onPress={avanzar}>
                <Text style={styles.textoBoton}>Siguiente</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* MODAL ERROR */}
        <Modal visible={mostrarError} transparent animationType="fade">
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
                onPress={() => {
                  setMostrarError(false);
                  reproducirAudio();
                }}
              >
                <Ionicons name="volume-high" size={18} color="white" />
                <Text style={styles.textoBoton}> Escuchar otra vez</Text>
              </TouchableOpacity>
    </View>
  </View>
</Modal>

      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  fondo: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#FBC531',
  },
  cargando: {
    marginTop: 100,
    textAlign: 'center',
    fontSize: 18,
    color: 'white',
  },

  // ── Sin hábitat ──────────────────────────────────────
  sinHabitat: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  sinHabitatTexto: {
    fontSize: 18,
    textAlign: 'center',
    color: '#333',
    fontWeight: '600',
    marginTop: 16,
  },

  // ── Header ───────────────────────────────────────────
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
    backgroundColor: 'rgba(255,255,255,0.3)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 22,
    gap: 6,
  },
  textoVolver: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 15,
  },
  contadorBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.3)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 22,
  },
  contadorTexto: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },

  // ── Centrador ────────────────────────────────────────
  centrador: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },

  // ── Tarjeta ──────────────────────────────────────────
  tarjetaJuego: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 30,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
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
    width: 100,
    height: 100,
    resizeMode: 'contain',
    marginBottom: 10,
  },

  // ── Botones ──────────────────────────────────────────
  botonVerde: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#9DCB3C',
    width: '100%',
    padding: 14,
    borderRadius: 18,
    marginBottom: 10,
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
    backgroundColor: '#E2AD47',
    borderRadius: 18,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  botonNo: {
    flex: 1,
    backgroundColor: '#E2AD47',
    borderRadius: 18,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Modales ──────────────────────────────────────────
  modalFondo: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modal: {
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 25,
    padding: 25,
    alignItems: 'center',
    gap: 8,
  },
  modalTitulo: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#E2AD47',
  },
  modalTexto: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  modalAnimal: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#E2AD47',
  },
  imagenDenuevo: {
  width: 90,
  height: 90,
  resizeMode: 'contain',
  marginBottom: 10,
},
});