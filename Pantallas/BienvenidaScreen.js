// Importa React y los hooks para manejar estados y efectos
import React, { useEffect, useState } from 'react';

// Importa los componentes visuales utilizados en la pantalla
import {Text,View,StyleSheet,TouchableOpacity,ImageBackground,Image,TextInput,Alert,KeyboardAvoidingView,Platform,} from 'react-native';

// Permite respetar las areas seguras del telefono
import { SafeAreaView } from 'react-native-safe-area-context';

// Permite guardar y recuperar datos de forma local
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function BienvenidaScreen({ navigation }) {
  // Estado utilizado para almacenar el nombre escrito por el usuario
  const [nombre, setNombre] = useState('');

  /*
    Se ejecuta una sola vez cuando la pantalla se abre.

    Su funcion es buscar si ya existe un nombre guardado
    anteriormente en el dispositivo.
  */
  useEffect(() => {
    cargarNombreGuardado();
  }, []);

  /*
    Limpia el texto escrito por el usuario.

    Solo permite letras, espacios, tildes y la letra ñ.
    No permite numeros ni simbolos.
  */
  function limpiarNombre(texto) {
    return texto.replace(
      /[^a-zA-ZÁÉÍÓÚáéíóúÑñ\s]/g,
      ''
    );
  }

  /*
    Controla lo que el usuario escribe en el campo.

    Si intenta escribir numeros o simbolos,
    estos se eliminan automaticamente.
  */
  function manejarCambioNombre(texto) {
    const nombreLimpio = limpiarNombre(texto);
    setNombre(nombreLimpio);
  }

  /*
    Recupera el nombre almacenado en AsyncStorage.

    Si existe un nombre guardado, lo coloca dentro
    del campo de texto.
  */
  async function cargarNombreGuardado() {
    try {
      // Busca el dato utilizando la clave nombreJugador
      const nombreGuardado =
        await AsyncStorage.getItem('nombreJugador');

      // Actualiza el estado si existe un nombre guardado
      if (nombreGuardado) {
        setNombre(limpiarNombre(nombreGuardado));
      }
    } catch (error) {
      // Muestra el error en la consola si ocurre un problema
      console.log(
        'Error al cargar el nombre:',
        error
      );
    }
  }

  /*
    Valida el nombre, lo guarda localmente
    y permite entrar a la pantalla principal.
  */
  async function jugar() {
    /*
      Elimina los espacios que puedan existir
      al inicio o al final del nombre.
    */
    const nombreLimpio = limpiarNombre(nombre).trim();

    // Impide continuar si el usuario no escribio un nombre
    if (nombreLimpio === '') {
      Alert.alert(
        'Nombre requerido',
        'Debes escribir tu nombre antes de jugar.'
      );

      return;
    }

    // Impide continuar si el nombre tiene menos de tres letras
    if (nombreLimpio.length < 3) {
      Alert.alert(
        'Nombre muy corto',
        'Escribe un nombre de al menos 3 letras.'
      );

      return;
    }

    try {
      /*
        Guarda el nombre dentro del dispositivo
        utilizando la clave nombreJugador.
      */
      await AsyncStorage.setItem(
        'nombreJugador',
        nombreLimpio
      );

      /*
        Reemplaza la pantalla de bienvenida
        por la pantalla principal de la aplicacion.

        Tambien envia el nombre como parametro.
      */
      navigation.replace('Principal', {
        nombreJugador: nombreLimpio,
      });
    } catch (error) {
      // Muestra el error en la consola
      console.log(
        'Error al guardar el nombre:',
        error
      );

      // Informa al usuario que no se pudo guardar el dato
      Alert.alert(
        'Error',
        'No se pudo guardar el nombre.'
      );
    }
  }

  /*
    Comprueba si el campo esta vacio.

    Este valor se utiliza para cambiar el color
    del boton cuando no existe un nombre valido.
  */
  const nombreVacio = nombre.trim() === '';

  return (
    // Imagen utilizada como fondo principal
    <ImageBackground
      source={require('../assets/Fondo.png')}
      style={styles.fondo}
      resizeMode="cover"
    >
      {/* Evita que el contenido quede debajo de la barra del telefono */}
      <SafeAreaView style={styles.safeArea}>
        {/*
          Ajusta la interfaz cuando aparece el teclado,
          especialmente en dispositivos iOS.
        */}
        <KeyboardAvoidingView
          style={styles.capa}
          behavior={
            Platform.OS === 'ios'
              ? 'padding'
              : 'height'
          }
        >
          <View style={styles.contenido}>
            {/* Contenedor del logo de la aplicacion */}
            <View style={styles.centroLogo}>
              <Image
                source={require('../assets/baner.png')}
                style={styles.logo}
              />
            </View>

            {/* Tarjeta que contiene el formulario del nombre */}
            <View style={styles.contenedor}>
              <Text style={styles.pregunta}>
                ¿Cómo te llamas?
              </Text>

              <Text style={styles.indicacion}>
                Escribe tu nombre para comenzar
              </Text>

              {/*
                Campo donde el usuario escribe su nombre.

                El valor del campo esta conectado
                con el estado nombre.
              */}
              <TextInput
                style={styles.input}
                value={nombre}
                onChangeText={manejarCambioNombre}
                placeholder="Tu nombre"
                placeholderTextColor="#888"
                maxLength={20}
                autoCapitalize="words"
                autoCorrect={false}
                keyboardType="default"
                returnKeyType="done"
                onSubmitEditing={jugar}
              />

              {/*
                Boton para comenzar.

                Cuando el nombre esta vacio,
                tambien aplica el estilo botonDesactivado.
              */}
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

// Estilos visuales utilizados en la pantalla
const styles = StyleSheet.create({
  // Hace que el fondo ocupe toda la pantalla
  fondo: {
    flex: 1,
  },

  // Respeta las areas seguras del dispositivo
  safeArea: {
    flex: 1,
  },

  // Agrega una capa oscura sobre la imagen de fondo
  capa: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },

  // Organiza el logo y el formulario
  contenido: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 25,
    paddingBottom: 45,
  },

  // Centra el logo dentro de la parte superior
  centroLogo: {
    width: '100%',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Define el tamaño del logo
  logo: {
    width: '100%',
    height: 260,
    resizeMode: 'contain',
  },

  // Tarjeta blanca donde se encuentra el formulario
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

  // Estilo de la pregunta principal
  pregunta: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },

  // Estilo del texto de ayuda
  indicacion: {
    fontSize: 15,
    color: '#666',
    marginTop: 5,
    marginBottom: 18,
    textAlign: 'center',
  },

  // Estilo del campo donde se escribe el nombre
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

  // Estilo principal del boton JUGAR
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

  // Cambia el color del boton cuando el campo esta vacio
  botonDesactivado: {
    backgroundColor: '#BDBDBD',
  },

  // Estilo del texto dentro del boton
  textoBoton: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
});