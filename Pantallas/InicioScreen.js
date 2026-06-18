import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { HABITATS } from '../data/animales';

export default function InicioScreen({
  navigation,
  habitatSeleccionado,
  setHabitatSeleccionado,
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Elige un hábitat</Text>

      {HABITATS.map((habitat) => (
        <TouchableOpacity
          key={habitat.id}
          style={[
            styles.boton,
            habitatSeleccionado === habitat.id && styles.botonSeleccionado,
          ]}
          onPress={() => setHabitatSeleccionado(habitat.id)}
        >
          <Text style={styles.textoBoton}>{habitat.nombre}</Text>
        </TouchableOpacity>
      ))}

      {habitatSeleccionado && (
        <View style={styles.caja}>
          <Text style={styles.texto}>
            Hábitat seleccionado: {habitatSeleccionado}
          </Text>

          <TouchableOpacity
            style={styles.botonSecundario}
            onPress={() => navigation.navigate('Audio')}
          >
            <Text style={styles.textoBoton}>Ir al juego de audio</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.botonSecundario}
            onPress={() => navigation.navigate('Nombre')}
          >
            <Text style={styles.textoBoton}>Ir al juego de nombres</Text>
          </TouchableOpacity>
        </View>
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
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 25,
  },
  boton: {
    backgroundColor: '#2e7d32',
    width: '90%',
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
    alignItems: 'center',
  },
  botonSeleccionado: {
    backgroundColor: '#1b5e20',
    borderWidth: 3,
    borderColor: '#ffd700',
  },
  botonSecundario: {
    backgroundColor: '#1565c0',
    width: '100%',
    padding: 13,
    borderRadius: 10,
    marginTop: 10,
    alignItems: 'center',
  },
  textoBoton: {
    color: 'white',
    fontSize: 17,
    fontWeight: 'bold',
  },
  caja: {
    marginTop: 25,
    width: '90%',
    alignItems: 'center',
  },
  texto: {
    fontSize: 16,
    marginBottom: 10,
  },
});