import { useEffect, useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { useAudioPlayer } from 'expo-audio';
import { ANIMALES } from '../data/animales';

export default function AudioScreen({ habitatSeleccionado }) {
  const animales = habitatSeleccionado ? ANIMALES[habitatSeleccionado] : [];
  const player = useAudioPlayer(null);

  const [pregunta, setPregunta] = useState(null);
  const [resultado, setResultado] = useState('');

  useEffect(() => {
    if (animales.length > 0) {
      nuevaPregunta();
    }
  }, [habitatSeleccionado]);

  useEffect(() => {
    if (pregunta) {
      player.replace(pregunta.audioAnimal.audio);
    }
  }, [pregunta]);

  function aleatorio(lista) {
    const indice = Math.floor(Math.random() * lista.length);
    return lista[indice];
  }

  function nuevaPregunta() {
    const animalMostrado = aleatorio(animales);

    const debeCoincidir = Math.random() < 0.5;
    const audioAnimal = debeCoincidir ? animalMostrado : aleatorio(animales);

    setPregunta({
      animalMostrado,
      audioAnimal,
    });

    setResultado('');
  }

  function reproducirAudio() {
    if (!pregunta) return;

    player.seekTo(0);
    player.play();
  }

  function verificar(respuestaUsuario) {
    const coincide =
      pregunta.animalMostrado.id === pregunta.audioAnimal.id;

    if (respuestaUsuario === coincide) {
      setResultado('Correcto');
    } else {
      setResultado(
        `Incorrecto. El sonido era de: ${pregunta.audioAnimal.nombre}`
      );
    }
  }

  if (!habitatSeleccionado) {
    return (
      <View style={styles.container}>
        <Text style={styles.titulo}>Primero elige un hábitat</Text>
        <Text style={styles.texto}>Ve a la pestaña Inicio.</Text>
      </View>
    );
  }

  if (!pregunta) {
    return (
      <View style={styles.container}>
        <Text style={styles.titulo}>Cargando pregunta...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Juego de audio</Text>

      <Text style={styles.pregunta}>
        ¿Este sonido pertenece a este animal?
      </Text>

      <Text style={styles.animal}>
        {pregunta.animalMostrado.nombre}
      </Text>

      <TouchableOpacity style={styles.botonAudio} onPress={reproducirAudio}>
        <Text style={styles.textoBoton}>Reproducir sonido</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.botonCorrecto}
        onPress={() => verificar(true)}
      >
        <Text style={styles.textoBoton}>Sí, es correcto</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.botonIncorrecto}
        onPress={() => verificar(false)}
      >
        <Text style={styles.textoBoton}>No, es incorrecto</Text>
      </TouchableOpacity>

      {resultado !== '' && (
        <>
          <Text style={styles.resultado}>{resultado}</Text>

          <TouchableOpacity style={styles.botonSiguiente} onPress={nuevaPregunta}>
            <Text style={styles.textoBoton}>Siguiente</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titulo: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  pregunta: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 15,
  },
  animal: {
    fontSize: 34,
    fontWeight: 'bold',
    marginBottom: 25,
  },
  botonAudio: {
    backgroundColor: '#1565c0',
    width: '90%',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  botonCorrecto: {
    backgroundColor: '#2e7d32',
    width: '90%',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  botonIncorrecto: {
    backgroundColor: '#c62828',
    width: '90%',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  botonSiguiente: {
    backgroundColor: '#6a1b9a',
    width: '90%',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 15,
  },
  textoBoton: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultado: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 15,
    textAlign: 'center',
  },
  texto: {
    fontSize: 16,
  },
});