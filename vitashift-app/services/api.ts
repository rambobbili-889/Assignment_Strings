import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const api = axios.create({ baseURL: 'http://localhost:4000/api' });

api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('auth_token');
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export async function apiRegister(name: string, email: string, password: string) {
  const { data } = await api.post('/auth/register', { name, email, password });
  await SecureStore.setItemAsync('auth_token', data.token);
  return data;
}

export async function apiLogin(email: string, password: string) {
  const { data } = await api.post('/auth/login', { email, password });
  await SecureStore.setItemAsync('auth_token', data.token);
  return data;
}

export async function apiCreateScenario(payload: { decision_type: string; input_scenario: string; variables: any; }) {
  const { data } = await api.post('/parallel-life/setup', payload);
  return data as { scenario_id: string; status: string };
}

export async function apiGetScenarioResults(id: string) {
  const { data } = await api.get(`/parallel-life/results/${id}`);
  return data;
}