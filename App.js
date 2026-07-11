import { useState } from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Ionicons } from '@expo/vector-icons';

import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

import BienvenidaScreen from './Pantallas/BienvenidaScreen';
import InicioScreen from './Pantallas/InicioScreen';
import AudioScreen from './Pantallas/AudioScreen';
import ColorearScreen from './Pantallas/ColorearScreen';
import ResumenScreen from './Pantallas/ResumenScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function TabsPrincipales() {
  const [habitatSeleccionado, setHabitatSeleccionado] =
    useState(null);

  const insets = useSafeAreaInsets();
  const espacioInferior = Math.max(insets.bottom, 18);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,

        tabBarIcon: ({ focused, color }) => {
          let iconName = 'ellipse-outline';

          if (route.name === 'Inicio') {
            iconName = focused
              ? 'home'
              : 'home-outline';
          } else if (route.name === 'Audio') {
            iconName = focused
              ? 'volume-high'
              : 'volume-high-outline';
          } else if (route.name === 'Colorear') {
            iconName = focused
              ? 'color-palette'
              : 'color-palette-outline';
          } else if (route.name === 'Resumen') {
            iconName = focused
              ? 'stats-chart'
              : 'stats-chart-outline';
          }

          return (
            <Ionicons
              name={iconName}
              size={26}
              color={color}
            />
          );
        },

        tabBarActiveTintColor: 'green',
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

      <Tab.Screen
        name="Colorear"
        component={ColorearScreen}
      />

      <Tab.Screen
        name="Resumen"
        component={ResumenScreen}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Bienvenida"
        >
          <Stack.Screen
            name="Bienvenida"
            component={BienvenidaScreen}
            options={{
              headerShown: false,
            }}
          />

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