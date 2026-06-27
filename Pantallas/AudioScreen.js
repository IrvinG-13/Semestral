import { useEffect, useState, useRef } from 'react';
import {Text,View,StyleSheet,TouchableOpacity,Image,Modal}from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAudioPlayer } from 'expo-audio';
import { ANIMALES } from '../data/animales';

export default function AudioScreen({ habitatSeleccionado, onVolverInicio, navigation }) {
  const animales = habitatSeleccionado ? ANIMALES[habitatSeleccionado] : [];
  const player = useAudioPlayer(null);
  const montado = useRef(true);

  const [cola, setCola] = useState([]);
  const [pregunta, setPregunta] = useState(null);
  const [mostrarExito, setMostrarExito] = useState(false);
  const [mostrarError, setMostrarError] = useState(false);
  const [encontrados, setEncontrados] = useState(0);
  const [rondaCompleta, setRondaCompleta] = useState(false);

  useEffect(() => {
    montado.current = true;
    return () => {
      montado.current = false;
      player.pause();
    };
  }, []);

  useEffect(() => {
    if (animales.length > 0) iniciarRonda();
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
    const debeCoincidir = Math.random() < 0.5;
    const otros = listaCompleta.filter(a => a.id !== animalMostrado.id);
    const audioAnimal = debeCoincidir
      ? animalMostrado
      : otros[Math.floor(Math.random() * otros.length)];
    setPregunta({ animalMostrado, audioAnimal });
    player.replace(audioAnimal.audio); // solo carga, no reproduce
  }

  function reproducirAudio() {
    if (!pregunta) return;
    player.seekTo(0);
    player.play();
  }

  function verificar(respuestaUsuario) {
    const coincide = pregunta.animalMostrado.id === pregunta.audioAnimal.id;
    if (respuestaUsuario === coincide) {
      setEncontrados(prev => prev + 1);
      setMostrarExito(true);
    } else {
      player.pause();
      setMostrarError(true);
    }
  }

  function avanzar() {
    player.pause();
    if (cola.length === 0) {
      setRondaCompleta(true);
    } else {
      const [siguiente, ...resto] = cola;
      setCola(resto);
      crearPregunta(siguiente, animales);
    }
  }

  function handleVolverInicio() {
    player.pause();
    navigation.navigate('Inicio'); // ← usa navegación del tab
  }

  if (!habitatSeleccionado) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.sinHabitat}>
          <Text style={styles.emojiGrande}>🐾</Text>
          <Text style={styles.sinHabitatTexto}>
            Primero elige un hábitat en la pestaña Inicio
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (rondaCompleta) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centrador}>
          <View style={styles.tarjetaJuego}>
            <Text style={styles.emojiGrande}>🏆</Text>
            <Text style={styles.titulo}>¡Ronda completa!</Text>
            <Text style={styles.subtitulo}>
              Encontraste {encontrados} de 5 animales
            </Text>
            <TouchableOpacity style={styles.botonAudio} onPress={iniciarRonda}>
              <Text style={styles.textoBoton}>Jugar otra vez</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.botonVolverLink} onPress={handleVolverInicio}>
              <Text style={styles.textoVolverLink}>Cambiar hábitat</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  if (!pregunta) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={{ marginTop: 100 }}>Cargando...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>

      {/* Botón volver — visible, debajo de la status bar */}
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.botonVolver} onPress={handleVolverInicio}>
          <Text style={styles.textoVolver}>← Inicio</Text>
        </TouchableOpacity>
        <View style={styles.contadorBadge}>
          <Text style={styles.contadorTexto}>⭐ {encontrados}/5</Text>
        </View>
      </View>

      {/* Tarjeta centrada */}
      <View style={styles.centrador}>
        <View style={styles.tarjetaJuego}>
          <Text style={styles.titulo}>Adivina el sonido</Text>
          <Text style={styles.subtitulo}>¿Que sonido hace este animal?</Text>

          <Image
            source={pregunta.animalMostrado.imagen}
            style={styles.imagenAnimal}
          />
          <Text style={styles.nombreAnimal}>
            {pregunta.animalMostrado.nombre.toUpperCase()}
          </Text>

          <TouchableOpacity style={styles.botonAudio} onPress={reproducirAudio}>
            <Text style={styles.textoBoton}>🔊 Escuchar sonido</Text>
          </TouchableOpacity>

          <View style={styles.filaBotones}>
            <TouchableOpacity style={styles.botonSi} onPress={() => verificar(true)}>
              <Text style={styles.textoBotonGrande}>✅</Text>
              <Text style={styles.textoBotonColor}>Sí</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.botonNo} onPress={() => verificar(false)}>
              <Text style={styles.textoBotonGrande}>❌</Text>
              <Text style={styles.textoBotonColor}>No</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* MODAL ÉXITO */}
      <Modal visible={mostrarExito} transparent animationType="fade">
        <View style={styles.modalFondo}>
          <View style={styles.modal}>
            <Text style={styles.emojiGrande}>🎉</Text>
            <Text style={styles.modalTitulo}>¡Muy bien!</Text>
            <Text style={styles.modalTexto}>Encontraste a:</Text>
            <Text style={styles.modalAnimal}>{pregunta.animalMostrado.nombre}</Text>
            <TouchableOpacity
              style={styles.botonAudio}
              onPress={() => { setMostrarExito(false); avanzar(); }}
            >
              <Text style={styles.textoBoton}>Siguiente →</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* MODAL ERROR */}
      <Modal visible={mostrarError} transparent animationType="fade">
        <View style={styles.modalFondo}>
          <View style={styles.modal}>
            <Text style={styles.emojiGrande}>😊</Text>
            <Text style={styles.modalTitulo}>Intenta nuevamente</Text>
            <Text style={styles.modalTexto}>Escucha otra vez el sonido</Text>
            <TouchableOpacity
              style={styles.botonAudio}
              onPress={() => { setMostrarError(false); reproducirAudio(); }}
            >
              <Text style={styles.textoBoton}>🔊 Escuchar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FBC531',
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
    color: 'white',
    fontWeight: '600',
    marginTop: 16,
  },

  // ── Header row ───────────────────────────────────────
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 10,
  },
  botonVolver: {
    backgroundColor: 'rgba(255,255,255,0.35)',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 22,
  },
  textoVolver: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  contadorBadge: {
    backgroundColor: 'rgba(255,255,255,0.35)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 22,
  },
  contadorTexto: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },

  // ── Centrador vertical ───────────────────────────────
  centrador: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },

  // ── Tarjeta juego ────────────────────────────────────
  tarjetaJuego: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 30,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  titulo: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#4DD9E8',
    marginBottom: 4,
  },
  subtitulo: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginBottom: 16,
  },
  imagenAnimal: {
    width: 170,
    height: 170,
    resizeMode: 'contain',
    marginBottom: 8,
  },
  nombreAnimal: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 18,
    letterSpacing: 1,
  },

  // ── Botones ──────────────────────────────────────────
  botonAudio: {
    backgroundColor: '#4DD9E8',
    width: '100%',
    padding: 14,
    borderRadius: 18,
    alignItems: 'center',
    marginBottom: 14,
  },
  textoBoton: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  filaBotones: {
    flexDirection: 'row',
    gap: 14,
    width: '100%',
  },
  botonSi: {
    flex: 1,
    backgroundColor: '#E8F5E9',
    borderRadius: 18,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#66BB6A',
  },
  botonNo: {
    flex: 1,
    backgroundColor: '#FFEBEE',
    borderRadius: 18,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#EF5350',
  },
  textoBotonGrande: {
    fontSize: 30,
  },
  textoBotonColor: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 4,
  },
  botonVolverLink: {
    marginTop: 14,
    padding: 8,
  },
  textoVolverLink: {
    color: '#F5A623',
    fontSize: 15,
    fontWeight: '600',
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
  },
  emojiGrande: {
    fontSize: 65,
  },
  modalTitulo: {
    fontSize: 26,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#333',
  },
  modalTexto: {
    fontSize: 16,
    marginTop: 8,
    textAlign: 'center',
    color: '#666',
  },
  modalAnimal: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#F5A623',
    marginTop: 8,
  },
});