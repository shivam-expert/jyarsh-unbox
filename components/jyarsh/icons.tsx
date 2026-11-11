import type { IconName } from "@/lib/content";

const paths: Record<IconName, JSX.Element> = {
  gemCheck: (
    <>
      <path d="M6 4h12l3 4-9 11L3 8z M3 8h18 M9 4 8 8l4 11 4-11-1-4" />
      <circle cx="18.5" cy="18" r="3.5" fill="#F6EEDD" />
      <path d="m17 18 1.2 1.2 2-2.2" />
    </>
  ),
  crown: (
    <>
      <path d="M4 17 3 7l5 4 4-6 4 6 5-4-1 10z M4 20h16" />
      <circle cx="12" cy="13" r="1.2" />
    </>
  ),
  shine: (
    <>
      <circle cx="12" cy="12" r="5.5" />
      <path d="m9.5 12 1.8 1.8 3.4-3.6 M12 2.5v2.5 M12 19v2.5 M2.5 12H5 M19 12h2.5 M5.3 5.3l1.7 1.7 M17 17l1.7 1.7 M5.3 18.7 7 17 M17 7l1.7-1.7" />
    </>
  ),
  leafHeart: (
    <>
      <path d="M12 20s-8-4.8-8-10.5A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 8 2.5C20 15.2 12 20 12 20z" />
      <path d="M8.5 13c1.5-3 4-3.5 7-3.5-.5 3-2 5-5 5.3 M8.5 13l3-1.8" />
    </>
  ),
  smile: (
    <>
      <circle cx="12" cy="10" r="5" />
      <path d="M10 9.2v.1 M14 9.2v.1 M9.8 11.5c1.2 1.3 3.2 1.3 4.4 0 M3 21l3-1.5h5l5-2.5c1-.5 1.8.8.8 1.5L13 21H6 M8 3.2l.3-.7 M16 3.2l-.3-.7 M12 2v-.6" />
    </>
  ),
  gift: (
    <>
      <rect x="4" y="9" width="16" height="11" rx="1" />
      <path d="M3 9h18V6.5H3z M12 6.5V20 M12 6.5C10.5 3 7 3 7.5 5c.3 1.3 3 1.5 4.5 1.5 M12 6.5c1.5-3.5 5-3.5 4.5-1.5-.3 1.3-3 1.5-4.5 1.5" />
    </>
  ),
  shieldDrop: (
    <>
      <path d="M12 2 4 5v6c0 5 3.5 8.5 8 10 4.5-1.5 8-5 8-10V5z" />
      <path d="M12 7c-2 3-3 4.3-3 5.7a3 3 0 0 0 6 0C15 11.3 14 10 12 7z" />
    </>
  ),
  face: (
    <>
      <path d="M7 20v-3.5A6.5 6.5 0 0 1 5.5 12V9a6.5 6.5 0 0 1 13 0v3a6.5 6.5 0 0 1-1.5 4.5V20" />
      <path d="M9 11c.6.5 1.2.5 1.8 0 M13.2 11c.6.5 1.2.5 1.8 0 M10.5 14.5c.9.6 2.1.6 3 0 M20.5 3.5l.5 1.3 1.3.5-1.3.5-.5 1.3-.5-1.3-1.3-.5 1.3-.5z" />
    </>
  ),
  bars: <path d="M6 10h5l1 4H5z M13 10h5l1 4h-7z M9.5 5h5l1 4h-7z M3 20l1.5-5h7L13 20z M11 20l1.5-5h7L21 20z" />,
  warranty: (
    <>
      <path d="M12 2 5 4.5v5.5c0 4 2.8 6.7 7 8 4.2-1.3 7-4 7-8V4.5z" />
      <path d="m9 10 2 2 4-4 M8 17.5 6 22l2.5-1 1.5 2 1.5-4.2 M16 17.5l2 4.5-2.5-1-1.5 2-1.5-4.2" />
    </>
  ),
};

export function Icon({ name, className }: { name: IconName; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="#8A5E22" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      {paths[name]}
    </svg>
  );
}
