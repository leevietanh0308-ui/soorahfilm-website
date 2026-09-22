"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function PageExperience() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const pathname = usePathname();
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.documentElement.classList.add("motion-ready");
    const timer = window.setTimeout(() => setLoading(false), reduced ? 0 : 560);
    return () => { window.clearTimeout(timer); document.documentElement.classList.remove("motion-ready"); };
  }, []);
  useEffect(() => {
    const onScroll = () => { const max = document.documentElement.scrollHeight - window.innerHeight; setProgress(max > 0 ? window.scrollY / max * 100 : 0); };
    onScroll(); window.addEventListener("scroll", onScroll, { passive: true }); return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);
  useEffect(() => {
    const reveal = () => {
      const elements = document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-visible)");
      const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add("is-visible"); observer.unobserve(entry.target); } }), { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
      elements.forEach((element) => observer.observe(element));
      return observer;
    };
    let observer = reveal();
    const timer = window.setTimeout(() => { observer.disconnect(); observer = reveal(); }, 100);
    return () => { window.clearTimeout(timer); observer.disconnect(); };
  }, [pathname]);
  return <><div className="scroll-progress" style={{ width: `${progress}%` }} aria-hidden="true" /><div className={`intro-screen ${loading ? "is-loading" : ""}`} aria-hidden="true"><div className="intro-count"><span>00</span><span>08</span><span>16</span><span>24</span><span>36</span></div><span className="intro-brand">SOORAH / 35MM</span></div></>;
}
