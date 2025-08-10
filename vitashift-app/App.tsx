import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import Welcome from './screens/Welcome';
import Login from './screens/Login';
import Signup from './screens/Signup';
import Dashboard from './screens/Dashboard';
import Timeline from './screens/Timeline';
import SimulationSetup from './screens/SimulationSetup';
import SimulationResults from './screens/SimulationResults';
import Insights from './screens/Insights';
import Profile from './screens/Profile';
import Payments from './screens/Payments';

export type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Signup: undefined;
  Dashboard: undefined;
  Timeline: undefined;
  SimulationSetup: undefined;
  SimulationResults: { id: string } | undefined;
  Insights: undefined;
  Profile: undefined;
  Payments: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Welcome">
          <Stack.Screen name="Welcome" component={Welcome} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Signup" component={Signup} />
          <Stack.Screen name="Dashboard" component={Dashboard} />
          <Stack.Screen name="Timeline" component={Timeline} />
          <Stack.Screen name="SimulationSetup" component={SimulationSetup} />
          <Stack.Screen name="SimulationResults" component={SimulationResults} />
          <Stack.Screen name="Insights" component={Insights} />
          <Stack.Screen name="Profile" component={Profile} />
          <Stack.Screen name="Payments" component={Payments} />
        </Stack.Navigator>
        <StatusBar style="auto" />
      </NavigationContainer>
    </QueryClientProvider>
  );
}