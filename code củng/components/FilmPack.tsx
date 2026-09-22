import Image from "next/image";

export default function FilmPack() {
  return <div className="film-pack-scene"><Image className="film-pack-photo" src="/images/kodak-ultramax-400.jpeg" alt="Ảnh Kodak Ultramax 400 do SOORAH cung cấp: hộp film trên nền hai ảnh phong cảnh" fill sizes="(max-width: 760px) 100vw, 50vw" quality={88} /></div>;
}
