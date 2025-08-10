import React from 'react';
import { View, Text, Button } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../App';

type Props = NativeStackScreenProps<RootStackParamList, 'Welcome'>;

export default function Welcome({ navigation }: Props) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 24, fontWeight: '600', marginBottom: 16 }}>VitaShift</Text>
      <Text style={{ marginBottom: 24 }}>Relive your past. Redesign your future.</Text>
      <Button title="Sign Up" onPress={() => navigation.navigate('Signup')} />
      <View style={{ height: 8 }} />
      <Button title="Login" onPress={() => navigation.navigate('Login')} />
    </View>
  );
}