import { Text, View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useEffect } from 'react';
import { useAudioPlayer, useAudioPlayerStatus, setAudioModeAsync } from 'expo-audio';

function InicioScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Inicio</Text>
    </View>
  );
}

function AudioScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Audio</Text>
    </View>
  );
}

function PerfilScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Perfil</Text>
    </View>
  );
}

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Inicio') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Audio') {
              iconName = focused ? 'musical-notes' : 'musical-notes-outline';
            } else if (route.name === 'Perfil') {
              iconName = focused ? 'person' : 'person-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },

          tabBarActiveTintColor: 'blue',
          tabBarInactiveTintColor: 'gray',

          headerStyle: {
            backgroundColor: 'black',
          },
          headerTintColor: 'white',

          tabBarStyle: {
            backgroundColor: 'white',
            height: 60,
            paddingBottom: 6,
          },

          tabBarLabelStyle: {
            fontSize: 12,
          },
        })}
      >
        <Tab.Screen name="Inicio" component={InicioScreen} />
        <Tab.Screen name="Audio" component={AudioScreen} />
        <Tab.Screen name="Perfil" component={PerfilScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold'
  }
});