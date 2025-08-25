declare global {
  interface Window {
    dataLayer: Record<string, string | number>[];
  }
}

export {};
