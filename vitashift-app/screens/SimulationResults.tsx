import React from 'react';
import { View, Text } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../App';
import { useQuery } from '@tanstack/react-query';
import { apiGetScenarioResults } from '../services/api';

type Props = NativeStackScreenProps<RootStackParamList, 'SimulationResults'>;

export default function SimulationResults({ route }: Props) {
  const id = route.params?.id || '';
  const { data } = useQuery({
    queryKey: ['scenario', id],
    queryFn: () => apiGetScenarioResults(id),
    refetchInterval: 1000,
    enabled: !!id,
  });

  return (
    <View style={{ flex: 1, padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 20, fontWeight: '600' }}>Results</Text>
      <Text>{JSON.stringify(data)}</Text>
    </View>
  );
}