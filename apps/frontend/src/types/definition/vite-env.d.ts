interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_GTM_ID: string;
  readonly VITE_MODE: 'development' | 'production';
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
