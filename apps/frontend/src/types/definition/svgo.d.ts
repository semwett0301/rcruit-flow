declare module '*.svg' {
  const src: string;
  export default src;
}

declare module '*.svg?component' {
  import React from 'react';
  const SVG: React.VFC<React.SVGProps<SVGSVGElement>>;
  export default SVG;
}

declare module '*.png' {
  const src: string;
  export default src;
}
