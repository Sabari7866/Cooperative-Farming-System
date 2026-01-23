import React from 'react';
import * as Lucide from 'lucide-react';

type IconProps = React.SVGProps<SVGSVGElement> & { name: string; className?: string };

export default function Icon({ name, className, ...rest }: IconProps) {
  // lucide-react exports components with PascalCase names, e.g., 'Zap', 'Mail'
  const Comp = (Lucide as any)[name];
  if (Comp) {
    return (<Comp className={className} {...rest} />) as any;
  }
  // Fallback: simple circle SVG pretending as icon
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...rest}
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v4l2 2" />
    </svg>
  );
}
