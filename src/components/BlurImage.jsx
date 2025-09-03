import React, { useState } from 'react';

export default function BlurImage({ src, alt, className = '', imgProps = {} }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <img
      src={src}
      alt={alt}
      onLoad={() => setLoaded(true)}
      className={`${className} blur-up${loaded ? ' loaded' : ''}`}
      loading={imgProps.loading || 'lazy'}
      decoding={imgProps.decoding || 'async'}
      {...imgProps}
    />
  );
}

