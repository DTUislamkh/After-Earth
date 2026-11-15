import fs from 'node:fs';
import path from 'node:path';
import { defineConfig, Plugin } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';

function nasaManifestsPlugin(): Plugin {
  const audioId = 'virtual:audio-manifest';
  const resolvedAudioId = '\0' + audioId;
  const mediaId = 'virtual:media-manifest';
  const resolvedMediaId = '\0' + mediaId;
  const molaId = 'virtual:mola-data';
  const resolvedMolaId = '\0' + molaId;

  const toPngDataUri = (filePath: string): string => {
    if (!fs.existsSync(filePath)) return '';
    const buf = fs.readFileSync(filePath);
    return `data:image/png;base64,${buf.toString('base64')}`;
  };

  return {
    name: 'marscraft-nasa-manifests',
    resolveId(id) {
      if (id === audioId) return resolvedAudioId;
      if (id === mediaId) return resolvedMediaId;
      if (id === molaId) return resolvedMolaId;
    },
    load(id) {
      if (id === resolvedAudioId) {
        const audioDir = path.resolve(__dirname, 'public/audio');
        const hasLobby = fs.existsSync(path.join(audioDir, 'lobby_ambient.mp3'));
        const hasGameplay = fs.existsSync(path.join(audioDir, 'gameplay_ambient.mp3'));
        return `export const AVAILABLE_AUDIO = { lobby: ${hasLobby}, gameplay: ${hasGameplay} };`;
      }
      if (id === resolvedMediaId) {
        const mediaDir = path.resolve(__dirname, 'public/media');
        const hasIntroVideo = fs.existsSync(path.join(mediaDir, 'mars_intro.mp4'));
        const hasLogo = fs.existsSync(path.join(mediaDir, 'after_earth_logo.jpg'));
        return `export const AVAILABLE_MEDIA = { introVideo: ${hasIntroVideo}, logo: ${hasLogo} };`;
      }
      if (id === resolvedMolaId) {
        const dataDir = path.resolve(__dirname, 'public/data');
        const jezeroUri = toPngDataUri(path.join(dataDir, 'mars_mola_dem.png'));
        const globalUri = toPngDataUri(path.join(dataDir, 'mars_global_mola.png'));
        return `export const JEZERO_DEM_DATA_URI = ${JSON.stringify(jezeroUri)};\nexport const GLOBAL_MOLA_DATA_URI = ${JSON.stringify(globalUri)};`;
      }
    }
  };
}

export default defineConfig({
  base: './',
  plugins: [nasaManifestsPlugin(), viteSingleFile()],
  build: {
    target: 'esnext',
    assetsInlineLimit: 100000000,
    cssCodeSplit: false
  },
  server: {
    port: 5173,
    host: true,
    watch: {
      ignored: ['**/public/media/**', '**/public/audio/**']
    }
  },
  worker: {
    format: 'iife'
  }
});
