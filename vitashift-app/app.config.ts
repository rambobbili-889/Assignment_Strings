import { ExpoConfig } from 'expo/config';

const API_BASE = process.env.API_BASE ?? 'http://localhost:4000';

export default ({ config }: { config: ExpoConfig }) => ({
  ...config,
  name: 'VitaShift',
  slug: 'vitashift',
  extra: { apiBase: API_BASE },
  ios: { supportsTablet: true },
  android: {},
  web: {},
});