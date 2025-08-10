import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../App';
import { apiCreateScenario } from '../services/api';

type Props = NativeStackScreenProps<RootStackParamList, 'SimulationSetup'>;

export default function SimulationSetup({ navigation }: Props) {
  const [desc, setDesc] = useState('Move to Canada');
  const [loading, setLoading] = useState(false);

  async function onSubmit() {
    setLoading(true);
    try {
      const resp = await apiCreateScenario({ decision_type: 'career', input_scenario: desc, variables: { incomeChange: 20 } });
      navigation.navigate('SimulationResults', { id: resp.scenario_id });
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={{ flex: 1, padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 20, fontWeight: '600' }}>Parallel Life Setup</Text>
      <TextInput value={desc} onChangeText={setDesc} style={{ borderWidth: 1, padding: 8 }} />
      <Button title={loading ? '...' : 'Run Simulation'} onPress={onSubmit} />
    </View>
  );
}