import React, { useEffect, useState } from 'react';

import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  ImageBackground,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { HABITATS, ANIMALES } from '../data/animales';

const COLORES_HABITAT = {
  sabana: {
    fondo: '#D7EFF9',
    texto: '#1A6A8A',
    boton: '#E2AD47',
  },

  bosque: {
    fondo: '#E2AD47',
    texto: '#7A4A00',
    boton: '#9DCB3C',
  },

  oceano: {
    fondo: '#9DCB3C',
    texto: '#3A5A00',
    boton: '#5A8400',
  },

  granja: {
    fondo: '#5A8400',
    texto: '#FFFFFF',
    boton: '#9DCB3C',
  },
};

export default function InicioScreen({
  navigation,
  setHabitatSeleccionado,
}) {
  const [nombreJugador, setNombreJugador] = useState('');

  useEffect(() => {
    cargarNombre();
  }, []);

  async function cargarNombre() {
    try {
      const nombreGuardado =
        await AsyncStorage.getItem('nombreJugador');

      if (nombreGuardado !== null) {
        setNombreJugador(nombreGuardado);
      }
    } catch (error) {
      console.log(
        'Error al cargar el nombre:',
        error
      );
    }
  }

  function seleccionarHabitat(habitatId) {
    setHabitatSeleccionado(habitatId);
    navigation.navigate('Audio');
  }

  function imagenRepresentativa(habitatId) {
    const lista = ANIMALES[habitatId];

    if (lista && lista.length > 0) {
      return lista[0].imagen;
    }

    return null;
  }

  return (
    <ImageBackground
      source={require('../assets/FondoInicio.png')}
      style={styles.fondo}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          <Image
            source={require('../assets/baner.png')}
            style={styles.logo}
          />

          <View style={styles.bienvenida}>
            <Text style={styles.tituloBienvenida}>
              {nombreJugador
                ? `¡Bienvenido, ${nombreJugador}!`
                : '¡Bienvenido!'}
            </Text>

            <Text style={styles.subtituloBienvenida}>
              ¿Qué hábitat quieres descubrir hoy?
            </Text>
          </View>

          <View style={styles.lista}>
            {HABITATS.map((habitat) => {
              const color =
                COLORES_HABITAT[habitat.id] ?? {
                  fondo: '#D7EFF9',
                  texto: '#333333',
                  boton: '#E2AD47',
                };

              const imagen =
                imagenRepresentativa(habitat.id);

              return (
                <View
                  key={habitat.id}
                  style={[
                    styles.tarjeta,
                    {
                      backgroundColor: color.fondo,
                    },
                  ]}
                >
                  <View style={styles.tarjetaInfo}>
                    <Text
                      style={[
                        styles.tarjetaNombre,
                        {
                          color: color.texto,
                        },
                      ]}
                    >
                      {habitat.nombre}
                    </Text>

                    <Text
                      style={[
                        styles.tarjetaDesc,
                        {
                          color: color.texto,
                        },
                      ]}
                    >
                      {habitat.descripcion ??
                        'Descubre nuevos animales'}
                    </Text>

                    <TouchableOpacity
                      style={[
                        styles.botonJugar,
                        {
                          backgroundColor: color.boton,
                        },
                      ]}
                      onPress={() =>
                        seleccionarHabitat(habitat.id)
                      }
                      activeOpacity={0.8}
                    >
                      <Text style={styles.textoBotonJugar}>
                        Jugar
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {imagen && (
                    <Image
                      source={imagen}
                      style={styles.imagenAnimal}
                    />
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
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 35,
  },

  logo: {
    width: 280,
    height: 220,
    resizeMode: 'contain',
    marginTop: 5,
    marginBottom: -30,
  },

  bienvenida: {
    width: '92%',
    backgroundColor: 'rgba(255,255,255,0.94)',
    borderRadius: 22,
    paddingHorizontal: 18,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 18,

    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 7,
    shadowOffset: {
      width: 0,
      height: 4,
    },

    elevation: 5,
  },

  tituloBienvenida: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'center',
  },

  subtituloBienvenida: {
    fontSize: 15,
    color: '#E2AD47',
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 5,
  },

  lista: {
    width: '92%',
    gap: 14,
  },

  tarjeta: {
    minHeight: 155,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 22,
    paddingVertical: 16,
    paddingHorizontal: 20,

    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 4,
    },

    elevation: 4,
  },

  tarjetaInfo: {
    flex: 1,
    justifyContent: 'center',
  },

  tarjetaNombre: {
    fontSize: 24,
    fontWeight: 'bold',
  },

  tarjetaDesc: {
    fontSize: 13,
    opacity: 0.9,
    marginTop: 5,
    lineHeight: 18,
  },

  botonJugar: {
    alignSelf: 'flex-start',
    paddingHorizontal: 22,
    paddingVertical: 9,
    borderRadius: 20,
    marginTop: 12,
  },

  textoBotonJugar: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 15,
  },

  imagenAnimal: {
    width: 125,
    height: 125,
    resizeMode: 'contain',
    marginLeft: 10,
  },
});