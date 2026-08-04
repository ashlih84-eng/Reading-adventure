/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PREVIEW_REVIEW?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
