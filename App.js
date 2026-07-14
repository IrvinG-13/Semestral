import { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Ionicons } from '@expo/vector-icons';


import {SafeAreaProvider,useSafeAreaInsets,} from 'react-native-safe-area-context';

// Importa las pantallas principales de la aplicacion
import BienvenidaScreen from './Pantallas/BienvenidaScreen';
import InicioScreen from './Pantallas/InicioScreen';
import AudioScreen from './Pantallas/AudioScreen';
import ResumenScreen from './Pantallas/ResumenScreen';

// Crea el navegador inferior
const Tab = createBottomTabNavigator();

// Crea el navegador principal tipo Stack
const Stack = createNativeStackNavigator();

/*
  Contiene las cuatro pestanas principales de la aplicacion.

  Tambien mantiene el habitat seleccionado para compartirlo
  entre la pantalla Inicio y la pantalla Audio.
*/
function TabsPrincipales() {
  // Guarda el identificador del habitat seleccionado
  const [habitatSeleccionado, setHabitatSeleccionado] =
    useState(null);

  /*
    Obtiene el espacio seguro inferior del dispositivo.

    Esto evita que la barra de navegacion quede debajo
    de los botones del sistema.
  */
  const insets = useSafeAreaInsets();

  /*
    Usa el espacio seguro del telefono o un minimo de 18.
  */
  const espacioInferior = Math.max(insets.bottom, 18);

  return (
    <Tab.Navigator
      /*
        Configura el aspecto y comportamiento general
        de todas las pestanas.
      */
      screenOptions={({ route }) => ({
        headerShown: false,

        /*
          Selecciona el icono correspondiente
          segun el nombre de cada pantalla.
        */
        tabBarIcon: ({ focused, color }) => {
          // Icono por defecto
          let iconName = 'ellipse-outline';

          // Icono utilizado por la pantalla Inicio
          if (route.name === 'Inicio') {
            iconName = focused
              ? 'home'
              : 'home-outline';

          // Icono utilizado por la pantalla Audio
          } else if (route.name === 'Audio') {
            iconName = focused
              ? 'volume-high'
              : 'volume-high-outline';

          // Icono utilizado por la pantalla Colorear
          } else if (route.name === 'Colorear') {
            iconName = focused
              ? 'color-palette'
              : 'color-palette-outline';

          // Icono utilizado por la pantalla Resumen
          } else if (route.name === 'Resumen') {
            iconName = focused
              ? 'stats-chart'
              : 'stats-chart-outline';
          }

          // Devuelve el icono que se mostrara en la barra inferior
          return (
            <Ionicons
              name={iconName}
              size={26}
              color={color}
            />
          );
        },

        tabBarActiveTintColor: 'orange',
        tabBarInactiveTintColor: 'gray',

        tabBarShowLabel: false,
        tabBarHideOnKeyboard: true,

        tabBarStyle: {
          backgroundColor: 'white',
          height: 62 + espacioInferior,
          paddingTop: 8,
          paddingBottom: espacioInferior,
          borderTopWidth: 1,
          borderTopColor: '#ddd',
        },

        tabBarItemStyle: {
          justifyContent: 'center',
          alignItems: 'center',
        },

        tabBarIconStyle: {
          marginTop: 4,
        },
      })}
    >
      {/*
        Pantalla Inicio.

        Recibe el habitat seleccionado y la funcion
        que permite cambiarlo.
      */}
      <Tab.Screen name="Audio">
        {(props) => (
          <AudioScreen
            {...props}
            habitatSeleccionado={
              habitatSeleccionado
            }
          />
        )}
      </Tab.Screen>

      {/*
        Pantalla Audio.

        Recibe el habitat elegido previamente
        desde la pantalla Inicio.
      */}
      
      <Tab.Screen name="Inicio">
        {(props) => (
          <InicioScreen
            {...props}
            habitatSeleccionado={habitatSeleccionado}
            setHabitatSeleccionado={
              setHabitatSeleccionado
            }
          />
        )}
      </Tab.Screen>

      {/* Pantalla que muestra el progreso del jugador */}
      <Tab.Screen
        name="Resumen"
        component={ResumenScreen}
      />
    </Tab.Navigator>
  );
}

/*
  Componente principal de la aplicacion.

  Configura el proveedor de areas seguras,
  el contenedor de navegacion y las pantallas
  principales del Stack.
*/
export default function App() {
  return (
    /*
      Permite que todas las pantallas puedan conocer
      las areas seguras del dispositivo.
    */
    <SafeAreaProvider>
      {/* Contenedor principal de toda la navegacion */}
      <NavigationContainer>
        {/*
          Navegador principal.

          Primero muestra la pantalla Bienvenida
          y luego permite entrar a las pestanas principales.
        */}
        <Stack.Navigator
          initialRouteName="Bienvenida"
        >
          {/* Primera pantalla que solicita el nombre */}
          <Stack.Screen
            name="Bienvenida"
            component={BienvenidaScreen}
            options={{
              headerShown: false,
            }}
          />

          {/*
            Pantalla que contiene Inicio, Audio,
            Colorear y Resumen.
          */}
          <Stack.Screen
            name="Principal"
            component={TabsPrincipales}
            options={{
              headerShown: false,
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}