import { useCallback, useState } from 'react';
import {Alert,ScrollView,StyleSheet,Text,TouchableOpacity,View,} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const PROGRESO_INICIAL = {
  rondasJugadas: 0,
  mejorPuntaje: 0,
  ultimoPuntaje: 0,
  totalPuntos: 0,
  totalErrores: 0,
  ultimoHabitat: '',
};

const NOMBRES_HABITAT = {
  sabana: 'Sabana',
  bosque: 'Bosque',
  oceano: 'Océano',
  granja: 'Granja',
};

function TarjetaDato({
  icono,
  colorIcono,
  fondoIcono,
  valor,
  descripcion,
  valorPequeno = false,
}) {
  return (
    <View style={styles.tarjeta}>
      <View
        style={[
          styles.iconoCircular,
          {
            backgroundColor: fondoIcono,
          },
        ]}
      >
        <Ionicons
          name={icono}
          size={30}
          color={colorIcono}
        />
      </View>

      <Text
        style={[
          styles.numero,
          valorPequeno && styles.numeroPequeno,
        ]}
        numberOfLines={1}
      >
        {valor}
      </Text>

      <Text style={styles.descripcion}>
        {descripcion}
      </Text>
    </View>
  );
}

export default function ResumenScreen() {
  const [nombreJugador, setNombreJugador] = useState('');
  const [progreso, setProgreso] = useState(PROGRESO_INICIAL);

  useFocusEffect(
    useCallback(() => {
      cargarProgreso();
    }, [])
  );

  async function cargarProgreso() {
    try {
      const nombreGuardado =
        await AsyncStorage.getItem('nombreJugador');

      const progresoGuardado =
        await AsyncStorage.getItem('progresoJugador');

      if (nombreGuardado) {
        setNombreJugador(nombreGuardado);
      } else {
        setNombreJugador('');
      }

      if (progresoGuardado) {
        const datos = JSON.parse(progresoGuardado);

        setProgreso({
          ...PROGRESO_INICIAL,
          ...datos,
        });
      } else {
        setProgreso(PROGRESO_INICIAL);
      }
    } catch (error) {
      console.log(
        'Error al cargar el progreso:',
        error
      );
    }
  }

  function confirmarReinicio() {
    Alert.alert(
      'Reiniciar progreso',
      '¿Seguro que deseas borrar todos los puntajes?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Borrar',
          style: 'destructive',
          onPress: reiniciarProgreso,
        },
      ]
    );
  }

  async function reiniciarProgreso() {
    try {
      await AsyncStorage.removeItem(
        'progresoJugador'
      );

      setProgreso(PROGRESO_INICIAL);

      Alert.alert(
        'Progreso reiniciado',
        'Los puntajes fueron eliminados.'
      );
    } catch (error) {
      console.log(
        'Error al reiniciar el progreso:',
        error
      );
    }
  }

  const porcentaje =
    progreso.rondasJugadas > 0
      ? Math.round(
          (progreso.totalPuntos /
            (progreso.rondasJugadas * 5)) *
            100
        )
      : 0;

  const nombreHabitat =
    NOMBRES_HABITAT[progreso.ultimoHabitat] ||
    'Ninguno';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.contenido}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.encabezado}>
          <View style={styles.iconoEncabezado}>
            <Ionicons
              name="analytics"
              size={30}
              color="#4DD9E8"
            />
          </View>

          <View style={styles.textosEncabezado}>
            <Text style={styles.titulo}>
              Mi progreso
            </Text>

            <Text style={styles.saludo}>
              {nombreJugador
                ? `Sigue aprendiendo, ${nombreJugador}`
                : 'Sigue aprendiendo'}
            </Text>
          </View>
        </View>

        {progreso.rondasJugadas === 0 ? (
          <View style={styles.sinProgreso}>
            <View style={styles.iconoSinProgreso}>
              <Ionicons
                name="paw"
                size={58}
                color="#4DD9E8"
              />
            </View>

            <Text style={styles.sinProgresoTitulo}>
              Aún no tienes puntajes
            </Text>

            <Text style={styles.sinProgresoTexto}>
              Completa una ronda de sonidos para ver
              aquí tus resultados.
            </Text>
          </View>
        ) : (
          <>
            <View style={styles.tarjetaPrincipal}>
              <View style={styles.circuloTrofeo}>
                <Ionicons
                  name="trophy"
                  size={48}
                  color="#F5A623"
                />
              </View>

              <View style={styles.informacionPrincipal}>
                <Text style={styles.textoMejor}>
                  Mejor puntaje
                </Text>

                <Text style={styles.numeroPrincipal}>
                  {progreso.mejorPuntaje}
                  <Text style={styles.numeroDeCinco}>
                    /5
                  </Text>
                </Text>

                <Text style={styles.mensajePrincipal}>
                  Tu mejor resultado hasta ahora
                </Text>
              </View>
            </View>

            <Text style={styles.tituloSeccion}>
              Resumen general
            </Text>

            <View style={styles.grid}>
              <TarjetaDato
                icono="star"
                colorIcono="#F5A623"
                fondoIcono="#FFF4D6"
                valor={`${progreso.ultimoPuntaje}/5`}
                descripcion="Último puntaje"
              />

              <TarjetaDato
                icono="game-controller"
                colorIcono="#8E44AD"
                fondoIcono="#F2E5F7"
                valor={progreso.rondasJugadas}
                descripcion="Rondas jugadas"
              />

              <TarjetaDato
                icono="checkmark-circle"
                colorIcono="#2E7D52"
                fondoIcono="#E4F4EA"
                valor={progreso.totalPuntos}
                descripcion="Puntos totales"
              />

              <TarjetaDato
                icono="close-circle"
                colorIcono="#E74C3C"
                fondoIcono="#FCE8E6"
                valor={progreso.totalErrores}
                descripcion="Errores"
              />

              <TarjetaDato
                icono="stats-chart"
                colorIcono="#1565C0"
                fondoIcono="#E3F2FD"
                valor={`${porcentaje}%`}
                descripcion="Rendimiento"
              />

              <TarjetaDato
                icono="earth"
                colorIcono="#0097A7"
                fondoIcono="#E0F7FA"
                valor={nombreHabitat}
                descripcion="Último hábitat"
                valorPequeno
              />
            </View>

            <View style={styles.consejo}>
              <Ionicons
                name="bulb"
                size={25}
                color="#E6A800"
              />

              <Text style={styles.textoConsejo}>
                Sigue practicando para superar tu mejor
                puntaje.
              </Text>
            </View>

            <TouchableOpacity
              style={styles.botonReiniciar}
              onPress={confirmarReinicio}
              activeOpacity={0.8}
            >
              <Ionicons
                name="refresh"
                size={21}
                color="white"
              />

              <Text style={styles.textoBotonReiniciar}>
                Reiniciar progreso
              </Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4DD9E8',
  },

  contenido: {
    flexGrow: 1,
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 40,
  },

  encabezado: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 22,
  },

  iconoEncabezado: {
    width: 58,
    height: 58,
    borderRadius: 18,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',

    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: {
      width: 0,
      height: 3,
    },

    elevation: 4,
  },

  textosEncabezado: {
    flex: 1,
    marginLeft: 14,
  },

  titulo: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
  },

  saludo: {
    fontSize: 15,
    color: 'white',
    fontWeight: '600',
    marginTop: 2,
  },

  tarjetaPrincipal: {
    width: '100%',
    backgroundColor: '#FBC531',
    borderRadius: 28,
    padding: 22,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,

    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 9,
    shadowOffset: {
      width: 0,
      height: 5,
    },

    elevation: 7,
  },

  circuloTrofeo: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },

  informacionPrincipal: {
    flex: 1,
    marginLeft: 18,
  },

  textoMejor: {
    fontSize: 16,
    color: '#765900',
    fontWeight: '700',
  },

  numeroPrincipal: {
    fontSize: 42,
    fontWeight: 'bold',
    color: 'white',
    lineHeight: 48,
  },

  numeroDeCinco: {
    fontSize: 25,
    fontWeight: '600',
  },

  mensajePrincipal: {
    fontSize: 12,
    color: '#765900',
    fontWeight: '600',
  },

  tituloSeccion: {
    fontSize: 19,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 13,
  },

  grid: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  tarjeta: {
    width: '48%',
    minHeight: 156,
    backgroundColor: 'white',
    borderRadius: 22,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,

    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: {
      width: 0,
      height: 3,
    },

    elevation: 4,
  },

  iconoCircular: {
    width: 57,
    height: 57,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 9,
  },

  numero: {
    fontSize: 27,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },

  numeroPequeno: {
    fontSize: 20,
  },

  descripcion: {
    fontSize: 13,
    color: '#777',
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 4,
  },

  sinProgreso: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 28,
    paddingHorizontal: 28,
    paddingVertical: 38,
    alignItems: 'center',
    marginTop: 30,

    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 4,
    },

    elevation: 5,
  },

  iconoSinProgreso: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#E1F8FA',
    alignItems: 'center',
    justifyContent: 'center',
  },

  sinProgresoTitulo: {
    fontSize: 23,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 18,
  },

  sinProgresoTexto: {
    fontSize: 15,
    color: '#777',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 21,
  },

  consejo: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E1',
    borderRadius: 18,
    padding: 15,
    marginTop: 4,
  },

  textoConsejo: {
    flex: 1,
    fontSize: 14,
    color: '#765900',
    fontWeight: '600',
    marginLeft: 11,
    lineHeight: 19,
  },

  botonReiniciar: {
    width: '100%',
    backgroundColor: '#EF5350',
    borderRadius: 18,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: 16,

    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 5,
    shadowOffset: {
      width: 0,
      height: 3,
    },

    elevation: 4,
  },

  textoBotonReiniciar: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});