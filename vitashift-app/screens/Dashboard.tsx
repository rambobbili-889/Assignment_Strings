import React from 'react';
import { View, Text, Button } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../App';

type Props = NativeStackScreenProps<RootStackParamList, 'Dashboard'>;

export default function Dashboard({ navigation }: Props) {
  return (
    <View style={{ flex: 1, padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 20, fontWeight: '600' }}>Dashboard</Text>
      <Button title="Timeline" onPress={() => navigation.navigate('Timeline')} />
      <Button title="New Simulation" onPress={() => navigation.navigate('SimulationSetup')} />
      <Button title="Insights" onPress={() => navigation.navigate('Insights')} />
      <Button title="Profile" onPress={() => navigation.navigate('Profile')} />
      <Button title="Upgrade" onPress={() => navigation.navigate('Payments')} />
    </View>
  );
}