import { useEffect, useState } from 'react';
import {Text,View,StyleSheet,TouchableOpacity,TextInput,} from 'react-native';
import { ANIMALES } from '../data/animales';

export default function NombreScreen({ habitatSeleccionado }) {
  const animales = habitatSeleccionado ? ANIMALES[habitatSeleccionado] : [];

  const [pregunta, setPregunta] = useState(null);
  const [letraIngresada, setLetraIngresada] = useState('');
  const [resultado, setResultado] = useState('');

  useEffect(() => {
    if (animales.length > 0) {
      nuevaPregunta();
    }
  }, [habitatSeleccionado]);

  function aleatorio(lista) {
    const indice = Math.floor(Math.random() * lista.length);
    return lista[indice];
  }

  function nuevaPregunta() {
    const animal = aleatorio(animales);
    const nombre = animal.nombre;

    const posicion = Math.floor(Math.random() * nombre.length);
    const letraFaltante = nombre[posicion];

    const nombreOculto =
      nombre.substring(0, posicion) +
      '_' +
      nombre.substring(posicion + 1);

    setPregunta({
      animal,
      nombreOculto,
      letraFaltante,
    });

    setLetraIngresada('');
    setResultado('');
  }

  function verificar() {
    const letra = letraIngresada.trim().toUpperCase();

    if (letra === pregunta.letraFaltante) {
      setResultado('Correcto');
    } else {
      setResultado(`Incorrecto. La letra era: ${pregunta.letraFaltante}`);
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
      <Text style={styles.titulo}>Completa el nombre</Text>

      <Text style={styles.nombreOculto}>
        {pregunta.nombreOculto}
      </Text>

      <TextInput
        style={styles.input}
        value={letraIngresada}
        onChangeText={setLetraIngresada}
        placeholder="Escribe la letra faltante"
        maxLength={1}
        autoCapitalize="characters"
      />

      <TouchableOpacity style={styles.boton} onPress={verificar}>
        <Text style={styles.textoBoton}>Verificar</Text>
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
    marginBottom: 25,
  },
  nombreOculto: {
    fontSize: 40,
    fontWeight: 'bold',
    letterSpacing: 6,
    marginBottom: 25,
  },
  input: {
    width: '80%',
    borderWidth: 2,
    borderColor: '#333',
    borderRadius: 10,
    padding: 12,
    fontSize: 22,
    textAlign: 'center',
    marginBottom: 15,
  },
  boton: {
    backgroundColor: '#2e7d32',
    width: '80%',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  botonSiguiente: {
    backgroundColor: '#1565c0',
    width: '80%',
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
    marginTop: 20,
    textAlign: 'center',
  },
  texto: {
    fontSize: 16,
  },
});