"use client";

import { usePathname } from "next/navigation";

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return <><div className="route-shutter" key={`shutter-${pathname}`} aria-hidden="true" /><div className="page-transition" key={pathname}>{children}</div></>;
}
