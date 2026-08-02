import type { ReactElement, ReactNode, SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

function SvgIcon({ children, ...props }: IconProps & { children: ReactNode }): ReactElement {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  );
}

export function CloseIcon(props: IconProps): ReactElement {
  return (
    <SvgIcon {...props}>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </SvgIcon>
  );
}

export function DownloadIcon(props: IconProps): ReactElement {
  return (
    <SvgIcon {...props}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </SvgIcon>
  );
}

export function FullscreenIcon(props: IconProps): ReactElement {
  return (
    <SvgIcon {...props}>
      <polyline points="15 3 21 3 21 9" />
      <polyline points="9 21 3 21 3 15" />
      <line x1="21" y1="3" x2="14" y2="10" />
      <line x1="3" y1="21" x2="10" y2="14" />
    </SvgIcon>
  );
}

export function FullscreenExitIcon(props: IconProps): ReactElement {
  return (
    <SvgIcon {...props}>
      <polyline points="4 14 10 14 10 20" />
      <polyline points="20 10 14 10 14 4" />
      <line x1="14" y1="10" x2="21" y2="3" />
      <line x1="3" y1="21" x2="10" y2="14" />
    </SvgIcon>
  );
}

export function ZoomInIcon(props: IconProps): ReactElement {
  return (
    <SvgIcon {...props}>
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
      <line x1="11" y1="8" x2="11" y2="14" />
      <line x1="8" y1="11" x2="14" y2="11" />
    </SvgIcon>
  );
}

export function ZoomOutIcon(props: IconProps): ReactElement {
  return (
    <SvgIcon {...props}>
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
      <line x1="8" y1="11" x2="14" y2="11" />
    </SvgIcon>
  );
}

export function RotateLeftIcon(props: IconProps): ReactElement {
  return (
    <SvgIcon {...props}>
      <polyline points="1 4 1 10 7 10" />
      <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
    </SvgIcon>
  );
}

export function RotateRightIcon(props: IconProps): ReactElement {
  return (
    <SvgIcon {...props}>
      <polyline points="23 4 23 10 17 10" />
      <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
    </SvgIcon>
  );
}

export function PrevIcon(props: IconProps): ReactElement {
  return (
    <SvgIcon {...props}>
      <polyline points="15 18 9 12 15 6" />
    </SvgIcon>
  );
}

export function NextIcon(props: IconProps): ReactElement {
  return (
    <SvgIcon {...props}>
      <polyline points="9 18 15 12 9 6" />
    </SvgIcon>
  );
}

export function ResetIcon(props: IconProps): ReactElement {
  return (
    <SvgIcon {...props}>
      <polyline points="23 4 23 10 17 10" />
      <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
    </SvgIcon>
  );
}

export function FileIcon(props: IconProps): ReactElement {
  return (
    <SvgIcon {...props}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </SvgIcon>
  );
}
