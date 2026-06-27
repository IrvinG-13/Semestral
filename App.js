import { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import BienvenidaScreen from './Pantallas/BienvenidaScreen';
import InicioScreen from './Pantallas/InicioScreen';
import AudioScreen from './Pantallas/AudioScreen';
import NombreScreen from './Pantallas/NombreScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function TabsPrincipales() {
  const [habitatSeleccionado, setHabitatSeleccionado] = useState(null);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = 'ellipse';

          if (route.name === 'Inicio') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Audio') {
            iconName = focused ? 'volume-high' : 'volume-high-outline';
          } else if (route.name === 'Nombre') {
            iconName = focused ? 'create' : 'create-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },

        tabBarActiveTintColor: '#F5A623',
        tabBarInactiveTintColor: '#BBBBBB',

        headerShown: false,

        tabBarStyle: {
          backgroundColor: 'white',
          height: 65,
          paddingBottom: 8,
          paddingTop: 6,
          borderTopWidth: 0,
          shadowColor: '#000',
          shadowOpacity: 0.08,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: -3 },
          elevation: 10,
        },

        tabBarLabelStyle: {
         fontSize: 12,
          fontWeight: '600',
        },
      })}
    >
      <Tab.Screen name="Inicio">
        {(props) => (
          <InicioScreen
            {...props}
            habitatSeleccionado={habitatSeleccionado}
            setHabitatSeleccionado={setHabitatSeleccionado}
          />
        )}
      </Tab.Screen>

      <Tab.Screen name="Audio">
        {(props) => (
          <AudioScreen
            {...props}
            habitatSeleccionado={habitatSeleccionado}
          />
        )}
      </Tab.Screen>

      <Tab.Screen name="Nombre">
        {(props) => (
          <NombreScreen
            {...props}
            habitatSeleccionado={habitatSeleccionado}
          />
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Bienvenida">
        <Stack.Screen
          name="Bienvenida"
          component={BienvenidaScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Principal"
          component={TabsPrincipales}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}