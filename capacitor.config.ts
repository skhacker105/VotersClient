import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'publicvoter.com',
  appName: 'VotersClient',
  webDir: 'dist/voters-client',
  server: {
    androidScheme: 'https'
  }
};

export default config;
