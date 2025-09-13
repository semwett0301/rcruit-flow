interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_GTM_ID: string;
  readonly VITE_MODE: 'development' | 'production';
  readonly VITE_ROUTER_BASE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
