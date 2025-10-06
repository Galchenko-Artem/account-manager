/// <reference types="vite/client" />
import 'pinia-plugin-persistedstate';

declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
