import { useEffect } from 'react';

type GtmProviderProps = { gtmId?: string };

export const GtmProvider = ({ gtmId }: GtmProviderProps) => {
  const id = gtmId ?? import.meta.env.VITE_GTM_ID;
  const mode = import.meta.env.VITE_MODE;

  useEffect(() => {
    if (!id || mode !== 'production') return;

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'gtm.start': Date.now(),
      event: 'gtm.js',
    });

    const script = document.createElement('script');
    script.async = true;
    const dl = 'dataLayer';
    script.src =
      'https://www.googletagmanager.com/gtm.js?id=' +
      id +
      (dl !== 'dataLayer' ? '&l=' + dl : '');
    document.head.insertBefore(script, document.head.firstChild);
  }, [id]);

  return null;
};
