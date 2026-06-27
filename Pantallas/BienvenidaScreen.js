import { Text, View, StyleSheet, TouchableOpacity,ImageBackground } from 'react-native';

export default function BienvenidaScreen({ navigation }) {
  return (
    <ImageBackground
      source={require('../assets/Fondo.png')}
      style={styles.fondo}
      resizeMode="cover"
    >
      <View style={styles.capa}>

        <TouchableOpacity
          style={styles.boton}
          onPress={() => navigation.replace('Principal')}
        >
          <Text style={styles.textoBoton}>JUGAR</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  fondo: {
    flex: 1,
  },
  capa: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingBottom: 80,
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 30,
  },
  boton: {
    backgroundColor: '#FFAE00',
    paddingVertical: 12,
    paddingHorizontal: 35,
    borderRadius: 8,
  },
  textoBoton: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
});