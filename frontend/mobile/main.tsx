// Primary mobile entry is now expo-router (see package.json "main": "expo-router/entry"),
// which auto-discovers routes under ../app. This file is kept only as a fallback for any
// tooling that still points directly at mobile/main.tsx, registering the same root App shell
// used by the Vite web build.
import { registerRootComponent } from 'expo';
import App from '../src/App';

registerRootComponent(App);
