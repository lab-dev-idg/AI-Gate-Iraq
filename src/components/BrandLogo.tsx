import { memo } from 'react';

interface BrandLogoProps {
  className?: string;
  size?: number;
  eager?: boolean;
}

function BrandLogo({ className = '', size = 40, eager = false }: BrandLogoProps) {
  return (
    <img
      src="/assets/logo.svg"
      alt="AI Gate Iraq"
      width={size}
      height={size}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      className={`shrink-0 object-contain ${className}`}
    />
  );
}

export default memo(BrandLogo);
