import React, { useEffect, useState } from 'react';

import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Image,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function BienvenidaScreen({ navigation }) {
  const [nombre, setNombre] = useState('');

  useEffect(() => {
    cargarNombreGuardado();
  }, []);

  async function cargarNombreGuardado() {
    try {
      const nombreGuardado =
        await AsyncStorage.getItem('nombreJugador');

      if (nombreGuardado) {
        setNombre(nombreGuardado);
      }
    } catch (error) {
      console.log(
        'Error al cargar el nombre:',
        error
      );
    }
  }

  async function jugar() {
    const nombreLimpio = nombre.trim();

    if (nombreLimpio === '') {
      Alert.alert(
        'Nombre requerido',
        'Debes escribir tu nombre antes de jugar.'
      );

      return;
    }

    try {
      await AsyncStorage.setItem(
        'nombreJugador',
        nombreLimpio
      );

      navigation.replace('Principal', {
        nombreJugador: nombreLimpio,
      });
    } catch (error) {
      console.log(
        'Error al guardar el nombre:',
        error
      );

      Alert.alert(
        'Error',
        'No se pudo guardar el nombre.'
      );
    }
  }

  const nombreVacio = nombre.trim() === '';

  return (
    <ImageBackground
      source={require('../assets/Fondo.png')}
      style={styles.fondo}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          style={styles.capa}
          behavior={
            Platform.OS === 'ios'
              ? 'padding'
              : 'height'
          }
        >
          <View style={styles.contenido}>
            <View style={styles.centroLogo}>
              <Image
                source={require('../assets/baner.png')}
                style={styles.logo}
              />
            </View>

            <View style={styles.contenedor}>
              <Text style={styles.pregunta}>
                ¿Cómo te llamas?
              </Text>

              <Text style={styles.indicacion}>
                Escribe tu nombre para comenzar
              </Text>

              <TextInput
                style={styles.input}
                value={nombre}
                onChangeText={setNombre}
                placeholder="Tu nombre"
                placeholderTextColor="#888"
                maxLength={20}
                autoCapitalize="words"
                autoCorrect={false}
                returnKeyType="done"
                onSubmitEditing={jugar}
              />

              <TouchableOpacity
                style={[
                  styles.boton,
                  nombreVacio &&
                    styles.botonDesactivado,
                ]}
                onPress={jugar}
                activeOpacity={0.8}
              >
                <Text style={styles.textoBoton}>
                  JUGAR
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
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

  capa: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },

  contenido: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 25,
    paddingBottom: 45,
  },

  centroLogo: {
    width: '100%',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  logo: {
    width: '100%',
    height: 260,
    resizeMode: 'contain',
  },

  contenedor: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.96)',
    borderRadius: 25,
    padding: 22,
    alignItems: 'center',

    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 4,
    },

    elevation: 8,
  },

  pregunta: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },

  indicacion: {
    fontSize: 15,
    color: '#666',
    marginTop: 5,
    marginBottom: 18,
    textAlign: 'center',
  },

  input: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E2AD47',
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 18,
    color: '#222',
    textAlign: 'center',
    marginBottom: 18,
  },

  boton: {
    width: '100%',
    backgroundColor: '#E2AD47',
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: 'center',

    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: {
      width: 0,
      height: 3,
    },

    elevation: 5,
  },

  botonDesactivado: {
    backgroundColor: '#BDBDBD',
  },

  textoBoton: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
});