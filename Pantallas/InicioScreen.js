import {Text,View,StyleSheet,TouchableOpacity,Image,ScrollView,ImageBackground} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HABITATS,ANIMALES } from '../data/animales';
//Colores utilizados para la aplicación
const COLORES_HABITAT = {
  sabana: { fondo: '#D7EFF9', texto: '#1a6a8a', boton: '#E2AD47' },
  bosque: { fondo: '#E2AD47', texto: '#7a4a00', boton: '#9DCB3C' },
  oceano: { fondo: '#9DCB3C', texto: '#3a5a00', boton: '#5A8400' },
  granja: { fondo: '#5A8400', texto: '#ffffff', boton: '#9DCB3C' },
};



export default function InicioScreen({ navigation, setHabitatSeleccionado }) {
  function seleccionarHabitat(habitatId) {
    setHabitatSeleccionado(habitatId);
    navigation.navigate('Audio');
  }

  function imagenRepresentativa(habitatId) {
    const lista = ANIMALES[habitatId];
    return lista && lista.length > 0 ? lista[0].imagen : null;
  }
return (
    <ImageBackground
      source={require('../assets/FondoInicio.png')}
      style={styles.fondo}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scroll}>

          {/* Logo */}
          <Image
            source={require('../assets/baner.png')}
            style={styles.logo}
          />

          {/* Lista de hábitats */}
          <View style={styles.lista}>
            {HABITATS.map((habitat) => {
              const color = COLORES_HABITAT[habitat.id] ?? {
                fondo: '#D7EFF9',
                texto: '#333',
                boton: '#E2AD47',
              };
              const imagen = imagenRepresentativa(habitat.id);

              return (
                <View
                  key={habitat.id}
                  style={[styles.tarjeta, { backgroundColor: color.fondo }]}
                >
                  {/* Texto izquierda */}
                  <View style={styles.tarjetaInfo}>
                    <Text style={[styles.tarjetaNombre, { color: color.texto }]}>
                      {habitat.nombre}
                    </Text>
                    <Text style={[styles.tarjetaDesc, { color: color.texto }]}>
                      {habitat.descripcion}
                    </Text>
                    <TouchableOpacity
                      style={[styles.botonJugar, { backgroundColor: color.boton }]}
                      onPress={() => seleccionarHabitat(habitat.id)}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.textoBotonJugar}>Jugar</Text>
                    </TouchableOpacity>
                  </View>

                  {/* Imagen animal más grande */}
                  {imagen && (
                    <Image source={imagen} style={styles.imagenAnimal} />
                  )}
                </View>
              );
            })}
          </View>

        </ScrollView>
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
  scroll: {
    alignItems: 'center',
    paddingBottom: 30,
  },
  
logo: {
    width: 260,       // ← más grande
    height: 250,
    resizeMode: 'contain',
    marginBottom:-20,
  },

  lista: {
    width: '92%',
    gap: 14,
  },

  tarjeta: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 22,
    paddingVertical: 16,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  tarjetaInfo: {
    flex: 1,
    justifyContent: 'center',
    gap: 6,
  },
  tarjetaNombre: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  tarjetaDesc: {
    fontSize: 13,
    opacity: 0.85,
  },
  botonJugar: {
    alignSelf: 'flex-start',
    paddingHorizontal: 18,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 6,
  },
  textoBotonJugar: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  
  imagenAnimal: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
    marginLeft: 10,
  },
});