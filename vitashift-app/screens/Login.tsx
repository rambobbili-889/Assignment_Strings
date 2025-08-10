import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../App';
import { apiLogin } from '../services/api';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function Login({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function onSubmit() {
    setLoading(true); setError('');
    try {
      await apiLogin(email, password);
      navigation.replace('Dashboard');
    } catch (e: any) {
      setError('Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={{ flex: 1, padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 20, fontWeight: '600' }}>Login</Text>
      <TextInput placeholder="Email" autoCapitalize='none' value={email} onChangeText={setEmail} style={{ borderWidth: 1, padding: 8 }} />
      <TextInput placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} style={{ borderWidth: 1, padding: 8 }} />
      {error ? <Text style={{ color: 'red' }}>{error}</Text> : null}
      <Button title={loading ? '...' : 'Login'} onPress={onSubmit} />
    </View>
  );
}