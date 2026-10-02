import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';

// Screens
import HomeScreen from '../screens/dashboard/HomeScreen';
import InspectionsListScreen from '../screens/inspections/InspectionsListScreen';
import InspectionDetailScreen from '../screens/inspections/InspectionDetailScreen';
import CheckInScreen from '../screens/inspections/CheckInScreen';
import ChecklistScreen from '../screens/inspections/ChecklistScreen';
import ObservationsScreen from '../screens/inspections/ObservationsScreen';
import ReportScreen from '../screens/inspections/ReportScreen';
import JointInspectionScreen from '../screens/inspections/JointInspectionScreen';
import CameraScreen from '../screens/camera/CameraScreen';
import NotificationsScreen from '../screens/notifications/NotificationsScreen';

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
          else if (route.name === 'Notifications') iconName = focused ? 'notifications' : 'notifications-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.saffron,
        tabBarInactiveTintColor: COLORS.slate,
        tabBarStyle: { backgroundColor: COLORS.white, borderTopColor: COLORS.line, height: 60, paddingBottom: 8 },
        headerStyle: { backgroundColor: COLORS.ink },
        headerTintColor: COLORS.white,
        headerTitleStyle: { fontWeight: 'bold' },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Dashboard' }} />
      <Tab.Screen name="Inspections" component={InspectionsListScreen} options={{ title: 'My Inspections' }} />
      <Tab.Screen name="Notifications" component={NotificationsScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: COLORS.ink },
        headerTintColor: COLORS.white,
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Stack.Screen name="MainTabs" component={TabNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="InspectionDetail" component={InspectionDetailScreen} options={{ title: 'Inspection Overview' }} />
      <Stack.Screen name="CheckIn" component={CheckInScreen} options={{ title: 'Officer Check-In' }} />
      <Stack.Screen name="ChecklistScreen" component={ChecklistScreen} options={{ title: 'Verification Checklist' }} />
      <Stack.Screen name="ObservationsScreen" component={ObservationsScreen} options={{ title: 'Field Observations' }} />
      <Stack.Screen name="ReportScreen" component={ReportScreen} options={{ title: 'Inspection Report' }} />
      <Stack.Screen name="JointInspectionScreen" component={JointInspectionScreen} options={{ title: 'Joint Inspection' }} />
      <Stack.Screen name="CameraScreen" component={CameraScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}
