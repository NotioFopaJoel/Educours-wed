import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import * as SecureStore from 'expo-secure-store';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const API_URL = 'https://educours-backend.onrender.com/api';

function AuthScreen() {
  return null;
}

function StudentDashboard() {
  return null;
}

function TeacherDashboard() {
  return null;
}

function AdminDashboard() {
  return null;
}

function StudentTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Dashboard" component={StudentDashboard} />
    </Tab.Navigator>
  );
}

function TeacherTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Dashboard" component={TeacherDashboard} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = await SecureStore.getItemAsync('accessToken');
      const userStr = await SecureStore.getItemAsync('user');
      if (token && userStr) {
        const user = JSON.parse(userStr);
        setIsAuthenticated(true);
        setUserRole(user.role);
      }
    } catch { }
    setIsLoading(false);
  };

  if (isLoading) return null;

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {!isAuthenticated ? (
            <Stack.Screen name="Auth" component={AuthScreen} />
          ) : userRole === 'student' ? (
            <Stack.Screen name="Student" component={StudentTabs} />
          ) : userRole === 'teacher' ? (
            <Stack.Screen name="Teacher" component={TeacherTabs} />
          ) : (
            <Stack.Screen name="Admin" component={() => null} options={{ title: 'Admin (Web Only)' }} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}
