import { Text,View,StyleSheet,TouchableOpacity,ImageBackground,Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
export default function BienvenidaScreen({ navigation }) {
  return (
    <ImageBackground
      source={require('../assets/Fondo.png')}
      style={styles.fondo}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.contenido}>
          <View style={styles.centroLogo}>
          <Image source={require('../assets/baner.png')}
          style={styles.logo}>
          </Image>
          </View>
          <TouchableOpacity style={styles.boton}
          onPress={()=>navigation.replace('Principal')}
          activeOpacity={0.8}>
          <Text style={styles.textoBoton}>JUGAR</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  fondo: {
    flex: 1,
  },
  safeArea:{
    flex: 1,
  },
  contenido:{
    flex: 1,
    alignItems:'center',
    justifyContent:'space-between',
    paddingTop:'54%',
    paddingBottom: '15%',
  },
  centroLogo: {
    alignItems:'center',
  },
  logo:{
    width:400,
    height:327,
    resizeMode:'contain',
  },
  //Verificar si me sale mejor tener el logo de afuera que el de adentro 
  boton:{
    backgroundColor:'#E2AD47',
    paddingVertical:18,
    paddingHorizontal:50,
    borderRadius:20,
    shadowColor:'#000',
    shadowOpacity:0.3,
    shadowRadius:8,
    textShadowOffset:{width:0,height:4},
    elevation:6,
  },
  textoBoton:{
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
    letterSpacing: 3,
  },
});