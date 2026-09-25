import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';

// Screens
import HomeScreen from '../screens/dashboard/HomeScreen';
import InspectionsListScreen from '../screens/inspections/InspectionsListScreen';
import InspectionDetailScreen from '../screens/inspections/InspectionDetailScreen';
import CameraScreen from '../screens/camera/CameraScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'Inspections') iconName = focused ? 'list' : 'list-outline';
          else if (route.name === 'Settings') iconName = focused ? 'settings' : 'settings-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.saffron,
        tabBarInactiveTintColor: COLORS.slate,
        tabBarStyle: { backgroundColor: COLORS.white, borderTopColor: COLORS.line },
        headerStyle: { backgroundColor: COLORS.ink },
        headerTintColor: COLORS.white,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Dashboard' }} />
      <Tab.Screen name="Inspections" component={InspectionsListScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: COLORS.ink }, headerTintColor: COLORS.white }}>
      <Stack.Screen name="MainTabs" component={TabNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="InspectionDetail" component={InspectionDetailScreen} options={{ title: 'Inspection Details' }} />
      <Stack.Screen name="CameraScreen" component={CameraScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}
