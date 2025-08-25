interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_G_TAG: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
