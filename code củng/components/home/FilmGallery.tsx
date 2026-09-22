"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { gallery } from "@/data/content";
import { track } from "@/lib/analytics";
import { trapFocus } from "@/lib/focus";

const landscapes = gallery.filter((shot) => shot.width >= shot.height);
const portraits = gallery.filter((shot) => shot.width < shot.height);
const orderedGallery: typeof gallery = [];
for (let index = 0; index < Math.max(landscapes.length, portraits.length); index++) {
  if (landscapes[index]) orderedGallery.push(landscapes[index]);
  if (portraits[index]) orderedGallery.push(portraits[index]);
}

export default function FilmGallery() {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const lightboxOpen = activeIndex !== null;
  const changePhoto = (direction: number) => {
    setActiveIndex((current) => current === null ? null : (current + direction + orderedGallery.length) % orderedGallery.length);
    track("gallery_interaction", { direction });
  };
  const openPhoto = (index: number) => {
    setActiveIndex(index);
    track("gallery_interaction", { photo: orderedGallery[index].id });
  };

  useEffect(() => {
    if (!lightboxOpen) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    const background = Array.from(document.querySelectorAll<HTMLElement>("header, main, footer"));
    const previousInert = background.map((element) => element.inert);
    background.forEach((element) => { element.inert = true; });
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveIndex(null);
      else if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        event.preventDefault();
        const direction = event.key === "ArrowLeft" ? -1 : 1;
        setActiveIndex((current) => current === null ? null : (current + direction + orderedGallery.length) % orderedGallery.length);
      }
      trapFocus(event, dialogRef.current);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
      background.forEach((element, index) => { element.inert = previousInert[index]; });
      if (previousFocus?.isConnected) previousFocus.focus();
    };
  }, [lightboxOpen]);

  const activeShot = activeIndex === null ? null : orderedGallery[activeIndex];

  return <><section className="gallery-section" id="gallery">
    <div className="gallery-head section-pad">
      <div className="section-index"><span>02 / ẢNH FILM SOORAH</span><span>KHÔNG CẦN QUÁ HOÀN HẢO</span></div>
      <div className="gallery-title-row"><h2 data-reveal>Những khung hình<br /><em>ngoài dự định.</em></h2></div>
      <p>Những khoảnh khắc chụp bằng máy film trong bộ sưu tập của SOORAH. Cuộn xuống để xem hết và chạm vào ảnh để phóng to.</p>
    </div>
    <div className="film-strip" aria-label="Thư viện ảnh film">
      {orderedGallery.map((shot, index) => <figure className={`film-frame ${shot.width < shot.height ? "portrait" : "landscape"}`} key={shot.id}><div className="frame-top"><span>SOORAH / FILM</span><span>{shot.id}A</span></div><button className="frame-image" onClick={() => openPhoto(index)} aria-label={`Phóng to ảnh: ${shot.alt}`}><Image src={shot.image} alt={shot.alt} width={shot.width} height={shot.height} sizes="(max-width: 760px) 100vw, (max-width: 1100px) 50vw, 33vw" loading="eager" quality={82} /></button><figcaption><strong>{shot.caption}</strong><span>XEM LỚN ↗</span></figcaption></figure>)}
    </div>
    <div className="gallery-footer section-pad"><span>ĐÃ XEM HẾT BỘ ẢNH SOORAH</span><span>{String(gallery.length).padStart(2, "0")} KHUNG HÌNH</span></div>
  </section>{activeShot && createPortal(<div className="film-lightbox" onMouseDown={(event) => { if (event.target === event.currentTarget) setActiveIndex(null); }}><div className="film-lightbox-dialog" ref={dialogRef} role="dialog" aria-modal="true" aria-label={`Ảnh film phóng to: ${activeShot.caption}`}><button ref={closeRef} className="film-lightbox-close" onClick={() => setActiveIndex(null)} aria-label="Đóng ảnh phóng to"><X size={22} /><span>ĐÓNG</span></button><div className="film-lightbox-stage"><Image className="film-lightbox-photo" src={activeShot.image} alt={activeShot.alt} width={activeShot.width} height={activeShot.height} sizes="(max-width: 760px) 100vw, 90vw" quality={90} /></div><div className="film-lightbox-bottom"><div><span>{String((activeIndex ?? 0) + 1).padStart(2, "0")} / {String(orderedGallery.length).padStart(2, "0")} · {activeShot.meta}</span><strong>{activeShot.caption}</strong></div><div className="film-lightbox-controls"><button onClick={() => changePhoto(-1)} aria-label="Ảnh trước"><ArrowLeft size={20} /></button><button onClick={() => changePhoto(1)} aria-label="Ảnh tiếp theo"><ArrowRight size={20} /></button></div></div></div></div>, document.body)}</>;
}
