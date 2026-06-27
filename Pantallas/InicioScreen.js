import {Text,View,StyleSheet,TouchableOpacity,Image,ScrollView} from 'react-native';
import { HABITATS } from '../data/animales';
import { ANIMALES } from '../data/animales';

export default function InicioScreen({ navigation, setHabitatSeleccionado }) {
  function seleccionarHabitat(habitatId) {
    setHabitatSeleccionado(habitatId);
    navigation.navigate('Audio');
  }

  function imagenRepresentativa(habitatId) {
    const lista = ANIMALES[habitatId];
    return lista && lista.length > 0 ? lista[0].imagen : null;
  }

  const colores = {
    sabana: { fondo: '#FFF8E1', nombre: '#E6A800', sub: '#8B6914' },
    bosque: { fondo: '#E8F5E9', nombre: '#2E7D52', sub: '#5A8A6A' },
    oceano: { fondo: '#E3F2FD', nombre: '#1565C0', sub: '#5A82B0' },
    granja: { fondo: '#F3E5F5', nombre: '#7B1FA2', sub: '#9C6AB0' },
  };

  return (
    // Fondo azul/turquesa como tu diseño original
    <View style={styles.fondoAzul}>
      <ScrollView contentContainerStyle={styles.scroll}>

        {/* Logo grande */}
        <Image
          source={require('../assets/baner.png')}
          style={styles.logo}
        />

        {/* Tarjeta blanca contenedora */}
        <View style={styles.tarjetaContenedor}>
          <Text style={styles.titulo}>¡Bienvenido!</Text>
          <Text style={styles.subtitulo}>¿Qué hábitat quieres descubrir hoy?</Text>

          {/* Grid 2x2 */}
          <View style={styles.grid}>
            {HABITATS.map((habitat) => {
              const color = colores[habitat.id] ?? { fondo: '#F5F5F5', nombre: '#333', sub: '#777' };
              const imagen = imagenRepresentativa(habitat.id);

              return (
                <TouchableOpacity
                  key={habitat.id}
                  style={[styles.tarjeta, { backgroundColor: color.fondo }]}
                  onPress={() => seleccionarHabitat(habitat.id)}
                  activeOpacity={0.8}
                >
                  {imagen && (
                    <Image source={imagen} style={styles.imagenAnimal} />
                  )}
                  <Text style={[styles.nombreHabitat, { color: color.nombre }]}>
                    {habitat.nombre}
                  </Text>
                  <Text style={[styles.subHabitat, { color: color.sub }]}>
                    {habitat.descripcion ?? 'Descúbrelo'}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  fondoAzul: {
    flex: 1,
    backgroundColor: '#4DD9E8', // ← fondo turquesa como tu diseño
  },
  scroll: {
    flexGrow: 1,
    alignItems: 'center',
    paddingBottom: 30,
  },

  // ── Logo ────────────────────────────────────────────
  logo: {
    width: 400,       // ← más grande
    height: 120,
    resizeMode: 'contain',
    marginTop: 30,
    marginBottom: 20,
  },

  // ── Tarjeta blanca contenedora ───────────────────────
  tarjetaContenedor: {
    width: '92%',
    backgroundColor: 'white',
    borderRadius: 30,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },

  titulo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 4,
  },
  subtitulo: {
    fontSize: 15,
    color: '#E6A800',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
  },

  // ── Grid ────────────────────────────────────────────
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 14,
    width: '100%',
  },

  // ── Tarjeta hábitat ──────────────────────────────────
  tarjeta: {
    width: '46%',
    borderRadius: 22,
    paddingVertical: 18,
    paddingHorizontal: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  imagenAnimal: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  nombreHabitat: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  subHabitat: {
    fontSize: 12,
    marginTop: 3,
    textAlign: 'center',
    color: '#888',
  },
});