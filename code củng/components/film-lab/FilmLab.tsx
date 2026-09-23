"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowDownToLine, ArrowRight, ArrowUpRight, Check, Cloud, Coffee, House, Lightbulb, MoonStar, Music2, PartyPopper, RotateCcw, Share2, Sun, Sunset, Trees } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { featuredProduct, formatPrice } from "@/data/products";
import { track } from "@/lib/analytics";
import { assessShot, evaluateShot, initialShot, scenePresets } from "@/lib/film-lab";
import type { CameraType, FlashMode, RiskBand, SceneId, ShotInput, ShotSignal, ShotResult } from "@/lib/film-lab";

const cameraOptions: { value: CameraType; label: string; detail: string }[] = [
  { value: "auto", label: "Máy tự động", detail: "Máy tự đo sáng" },
  { value: "manual", label: "Máy chỉnh tay", detail: "Bạn tự chọn thông số" },
];
const sceneIcons: Record<SceneId, LucideIcon> = {
  sunny: Sun, cloudy: Cloud, golden: Sunset, shade: Trees, window: House,
  cafe: Coffee, night: MoonStar, party: PartyPopper, concert: Music2, backlit: Sun,
};
const lightLabels = ["", "Rất tối", "Thiếu sáng", "Vừa", "Sáng", "Rất sáng"];
const distances = [0.5, 1, 2, 3, 5, 10, 20];
const riskLabels: Record<RiskBand, string> = { low: "THẤP", moderate: "VỪA", high: "CAO" };

function RiskRow({ label, signal }: { label: string; signal: ShotSignal }) {
  const detail = signal.status === "high" && label === "ÁNH SÁNG" ? "CAO · THIẾU SÁNG" : signal.status === "high" && label === "ĐỘ NÉT" ? "CAO · DỄ NHÒE" : signal.status === "high" && label === "FLASH" ? "CAO · QUÁ XA" : signal.status === "neutral" ? "KHÔNG DÙNG" : riskLabels[signal.status];
  return <div className={`lab-risk-row lab-risk-${signal.status}`}><span className="lab-signal-dot" aria-hidden="true" /><div><strong>{label}</strong><small>{signal.finding}</small></div><span className="lab-signal-level">{detail}</span></div>;
}

function drawShotCard(shot: ShotInput, result: ShotResult, sceneLabel: string) {
  const canvas = document.createElement("canvas");
  canvas.width = 1200;
  canvas.height = 680;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  ctx.fillStyle = "#eee9dd";
  ctx.fillRect(0, 0, 1200, 680);
  ctx.fillStyle = "#b54635";
  ctx.fillRect(0, 0, 16, 680);
  ctx.fillStyle = "#171613";
  ctx.font = "700 30px Arial, sans-serif";
  ctx.fillText("SOORAH / FILM LAB", 68, 82);
  ctx.font = "22px monospace";
  ctx.fillText("THẺ GHI NHỚ TRƯỚC KHI CHỤP", 68, 127);
  ctx.fillStyle = "#b54635";
  ctx.font = "italic 76px Georgia, serif";
  ctx.fillText(result.headline, 68, 236, 1060);
  ctx.fillStyle = "#171613";
  ctx.font = "28px Arial, sans-serif";
  ctx.fillText(`KODAK ULTRAMAX 400  /  ${sceneLabel.toUpperCase()}`, 68, 316, 1060);
  ctx.font = "23px monospace";
  ctx.fillText(`ÁNH SÁNG: ${lightLabels[shot.light].toUpperCase()}    KHOẢNG CÁCH: ${shot.distance} M    FLASH: ${shot.flash.toUpperCase()}`, 68, 367, 1060);
  ctx.fillText(`THIẾU SÁNG: ${riskLabels[result.exposureRisk]}    NHÒE: ${riskLabels[result.motionRisk]}`, 68, 412);
  ctx.fillStyle = "#b54635";
  ctx.fillRect(68, 452, 1060, 2);
  ctx.fillStyle = "#171613";
  ctx.font = "25px Arial, sans-serif";
  const advice = result.suggestions[0] || "Tìm ánh sáng tốt trước khi chụp.";
  const words = advice.split(" ");
  let line = "";
  let y = 505;
  for (const word of words) {
    const next = `${line}${word} `;
    if (ctx.measureText(next).width > 1000 && line) { ctx.fillText(line.trim(), 68, y); y += 36; line = `${word} `; }
    else line = next;
  }
  if (line) ctx.fillText(line.trim(), 68, y);
  ctx.fillStyle = "#625b52";
  ctx.font = "18px monospace";
  ctx.fillText("ƯỚC TÍNH ĐỂ HỌC, KHÔNG BẢO ĐẢM ẢNH CUỐI", 68, 638);
  return canvas.toDataURL("image/png");
}

export default function FilmLab() {
  const [shot, setShot] = useState<ShotInput>(initialShot);
  const [notice, setNotice] = useState("");
  const [compare, setCompare] = useState(50);
  const compareDragging = useRef(false);
  const firstChange = useRef(false);
  const result = useMemo(() => evaluateShot(shot), [shot]);
  const assessment = useMemo(() => assessShot(shot, result), [shot, result]);
  const scene = scenePresets.find((item) => item.id === shot.scene) || scenePresets[0];

  useEffect(() => { track("film_lab_start"); }, []);

  function update<K extends keyof ShotInput>(field: K, value: ShotInput[K]) {
    setShot((current) => ({ ...current, [field]: value }));
    track("film_lab_change", { field, value: String(value) });
    if (!firstChange.current) { firstChange.current = true; track("film_lab_result"); }
  }

  function chooseScene(id: SceneId) {
    const preset = scenePresets.find((item) => item.id === id);
    if (!preset) return;
    setShot((current) => ({ ...current, scene: id, light: preset.defaultLight }));
    track("film_lab_change", { field: "scene", value: id });
    if (!firstChange.current) { firstChange.current = true; track("film_lab_result"); }
  }

  function moveComparison(event: ReactPointerEvent<HTMLDivElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    setCompare(Math.max(0, Math.min(100, Math.round((event.clientX - bounds.left) / bounds.width * 100))));
  }

  function downloadCard() {
    const data = drawShotCard(shot, result, scene.label);
    if (!data) { setNotice("Không thể tạo ảnh trên trình duyệt này."); return; }
    const link = document.createElement("a");
    link.download = "soorah-film-lab-shot-card.png";
    link.href = data;
    document.body.appendChild(link);
    link.click();
    link.remove();
    track("film_lab_save");
    setNotice("Đã tạo thẻ ghi nhớ để lưu về máy.");
  }

  async function shareSetup() {
    const message = `SOORAH FILM LAB\n${scene.label} · Ultramax 400 · ${lightLabels[shot.light]} · ${shot.distance} m · Flash ${shot.flash}\n${result.headline}\n${result.suggestions[0]}\nĐây là ước tính để học, không bảo đảm ảnh cuối.`;
    try {
      if (navigator.share) await navigator.share({ title: "SOORAH Film Lab", text: message, url: window.location.href });
      else if (navigator.clipboard) { await navigator.clipboard.writeText(`${message}\n${window.location.href}`); setNotice("Đã sao chép thẻ ghi nhớ."); }
      else { setNotice("Trình duyệt chưa hỗ trợ chia sẻ. Bạn có thể lưu thẻ ảnh."); return; }
      track("film_lab_share");
    } catch { setNotice("Chưa chia sẻ được. Bạn có thể lưu thẻ ảnh."); }
  }

  return <div className="film-lab-page">
    <section className="lab-hero section-pad" aria-labelledby="lab-title">
      <div className="section-index"><span>SOORAH / FILM LAB</span><span>THỬ TRƯỚC KHI BẤM MÁY</span></div>
      <div className="lab-hero-grid"><div><span className="eyebrow">LESS GUESSING. MORE UNDERSTANDING.</span><h1 id="lab-title">Một cú chụp.<br /><em>Ít may rủi hơn.</em></h1><p>Chọn tình huống bạn sắp chụp. Film Lab giúp bạn nhìn ra rủi ro về ánh sáng, chuyển động và flash, rồi gợi ý một điều có thể đổi ngay.</p><a href="#kiem-tra" className="button button-red">KIỂM TRA CÚ CHỤP <ArrowRight size={17} /></a></div><div className="lab-hero-note" aria-hidden="true"><span>01 / 36</span><span>LIGHT<br />FILM<br />CAMERA<br />TIME</span><strong>?</strong><span>TRƯỚC KHUNG HÌNH ĐẦU TIÊN</span></div></div>
    </section>

    <section className="lab-workbench section-pad" id="kiem-tra" aria-labelledby="workbench-title">
      <div className="lab-workbench-bar"><span>01 / SOORAH FILM LAB</span><h2 id="workbench-title">Kiểm tra cú chụp</h2><span>ULTRAMAX 400 · ĐỔI MỘT ĐIỀU, XEM NGAY</span></div>
      <div className="lab-grid">
        <div className="lab-controls">
          <div className="lab-controls-scroll">
          <div className="lab-film-card"><span>CUỘN FILM / 001</span><strong>Kodak Ultramax <em>400</em></strong><small>35MM · ISO {featuredProduct.iso} · {featuredProduct.exposures} TẤM</small><p>Trong bản thử này, ISO cố định theo cuộn film; bạn không đổi ISO sau mỗi tấm như máy số.</p></div>

          <fieldset className="lab-fieldset"><legend><span>01</span> Bạn đang dùng máy nào?</legend><div className="lab-camera-grid">{cameraOptions.map((option) => <button key={option.value} type="button" className={`lab-choice ${shot.camera === option.value ? "selected" : ""}`} aria-pressed={shot.camera === option.value} onClick={() => update("camera", option.value)}><strong>{option.label}</strong><small>{option.detail}</small></button>)}</div></fieldset>

          <fieldset className="lab-fieldset"><legend><span>02</span> Bạn chụp ở đâu?</legend><div className="lab-scene-grid">{scenePresets.map((option) => { const Icon = sceneIcons[option.id]; return <button key={option.id} type="button" className={`lab-scene ${shot.scene === option.id ? "selected" : ""}`} aria-pressed={shot.scene === option.id} onClick={() => chooseScene(option.id)}><Icon size={20} strokeWidth={1.5} aria-hidden="true" /><span>{option.label}</span></button>; })}</div><p className="lab-field-hint">{scene.note}</p></fieldset>

          <div className="lab-fieldset"><label htmlFor="lab-light" className="lab-legend"><span>03</span> Ánh sáng thực tế <strong>{lightLabels[shot.light]}</strong></label><input id="lab-light" type="range" min="1" max="5" step="1" value={shot.light} onChange={(event) => update("light", Number(event.target.value))} /><div className="lab-range-labels"><span>RẤT TỐI</span><span>RẤT SÁNG</span></div><p className="lab-field-hint">Chỉnh theo mắt bạn: cùng một quán có thể sáng gần cửa sổ và tối ở góc phòng.</p></div>

          <fieldset className="lab-fieldset"><legend><span>04</span> Chủ thể có di chuyển không?</legend><div className="lab-toggle-row"><button type="button" aria-pressed={shot.subject === "still"} className={shot.subject === "still" ? "selected" : ""} onClick={() => update("subject", "still")}>Đứng yên</button><button type="button" aria-pressed={shot.subject === "moving"} className={shot.subject === "moving" ? "selected" : ""} onClick={() => update("subject", "moving")}>Đang chuyển động</button></div></fieldset>

          <fieldset className="lab-fieldset"><legend><span>05</span> Bạn đứng cách chủ thể bao xa?</legend><div className="lab-distance-grid">{distances.map((distance) => <button type="button" key={distance} aria-pressed={shot.distance === distance} className={shot.distance === distance ? "selected" : ""} onClick={() => update("distance", distance)}>{distance === 20 ? "20m+" : `${distance}m`}</button>)}</div><div className="lab-reach"><div><span className="eyebrow">VÙNG FLASH GẦN / MINH HỌA</span><strong>{shot.distance === 20 ? "20 m trở lên" : `${shot.distance} m`}</strong></div><div className="lab-reach-track" aria-hidden="true"><div className="lab-reach-near" /><span className="lab-reach-marker" style={{ left: `${({ 0.5: 7, 1: 13, 2: 25, 3: 36, 5: 53, 10: 75, 20: 94 } as Record<number, number>)[shot.distance]}%` }} /></div><div className="lab-reach-labels"><span>0 — 3 M / GẦN</span><span>XA HƠN</span></div><p>Khoảng 3 m chỉ là mốc tham khảo. Hiệu quả thật phụ thuộc từng máy, pin và điều kiện chụp.</p></div></fieldset>

          <fieldset className="lab-fieldset"><legend><span>06</span> Flash của máy</legend><div className="lab-toggle-row">{([{ value: "off", label: "Tắt" }, { value: "auto", label: "Tự động" }, { value: "on", label: "Bật" }] as { value: FlashMode; label: string }[]).map((option) => <button type="button" key={option.value} aria-pressed={shot.flash === option.value} className={shot.flash === option.value ? "selected" : ""} onClick={() => update("flash", option.value)}>{option.label}</button>)}</div><p className="lab-field-hint">Flash AUTO có thể bật hoặc không; Film Lab không giả định máy sẽ đánh flash.</p></fieldset>
          <button className="lab-reset" type="button" onClick={() => { setShot(initialShot); track("film_lab_change", { field: "reset", value: "initial" }); }}><RotateCcw size={14} aria-hidden="true" /> THỬ LẠI TỪ ĐẦU</button>
          </div>
          <div className="lab-quick-actions"><button type="button" disabled={shot.light >= 5} onClick={() => update("light", Math.min(5, shot.light + 1))}><Lightbulb size={16} aria-hidden="true" /> THÊM SÁNG</button><button type="button" disabled={shot.flash === "on"} onClick={() => update("flash", "on")}>✳ BẬT FLASH</button><button type="button" disabled={shot.distance <= 0.5} onClick={() => update("distance", shot.distance > 3 ? 3 : shot.distance > 1 ? 1 : 0.5)}>↘ LẠI GẦN</button></div>
        </div>

        <div className="lab-output" role="region" aria-label="Ảnh minh họa và kết quả ước tính">
          <div className="lab-preview-header"><span>02 / SO MÀU VÀ ÁNH SÁNG MINH HỌA</span><span>LIVE ESTIMATE <span className="lab-live-dot" aria-hidden="true" /></span></div>
          <div className={`lab-preview lab-tone-${result.previewTone}`} style={{ "--compare": `${compare}%` } as CSSProperties} onPointerDown={(event) => { compareDragging.current = true; event.currentTarget.setPointerCapture(event.pointerId); moveComparison(event); }} onPointerMove={(event) => { if (compareDragging.current) moveComparison(event); }} onPointerUp={() => { compareDragging.current = false; }} onPointerCancel={() => { compareDragging.current = false; }}><Image className="lab-preview-base" src="/images/film/frame-17.webp" alt="Ảnh film mẫu của SOORAH: một nhóm người ngoài trời" fill sizes="(max-width: 850px) 100vw, 48vw" quality={78} draggable={false} /><div className="lab-preview-estimate"><Image src="/images/film/frame-17.webp" alt="" fill sizes="(max-width: 850px) 100vw, 48vw" quality={78} draggable={false} /></div><div className="lab-preview-shade" /><span className="lab-compare-line" aria-hidden="true" /><span className="lab-preview-index">SOORAH / 01—36</span><span className="lab-preview-original">ẢNH MẪU GỐC</span><span className="lab-preview-caption">MINH HỌA ƯỚC TÍNH</span></div>
          <div className="lab-preview-foot"><label htmlFor="lab-compare">KÉO ĐỂ SO SÁNH ẢNH MẪU <span>{compare}%</span></label><input id="lab-compare" type="range" min="0" max="100" value={compare} onChange={(event) => setCompare(Number(event.target.value))} /><p>Độ sáng và màu chỉ để minh họa; không dự đoán màu film sau tráng quét.</p></div>

          <div className="lab-verdict"><div className="lab-verdict-top"><span className="eyebrow">KẾT QUẢ / {scene.short}</span><div className="lab-overall"><span>RỦI RO CHUNG</span><div className="lab-traffic" role="img" aria-label={`Đánh giá chung: rủi ro ${riskLabels[assessment.overall].toLowerCase()}`}>{(["low", "moderate", "high"] as RiskBand[]).map((band) => <span key={band} className={`lab-traffic-dot lab-traffic-${band} ${assessment.overall === band ? "active" : ""}`} aria-hidden="true" />)}</div><strong>{riskLabels[assessment.overall]}</strong></div></div><div className="lab-verdict-message" aria-live="polite"><h3>{result.headline}</h3><p>{assessment.primaryFinding}</p></div><div className="lab-risk-list"><RiskRow label="ÁNH SÁNG" signal={assessment.exposure} /><RiskRow label="ĐỘ NÉT" signal={assessment.motion} /><RiskRow label="FLASH" signal={assessment.flash} /></div><p className="lab-certainty">{result.certainty === "limited" ? "Máy chưa rõ hoặc flash AUTO: kết quả chỉ mang tính gợi ý." : "Thông số máy và quá trình tráng quét vẫn có thể làm ảnh khác đi."}</p></div>
        </div>
      </div>
    </section>

    <section className="lab-understanding section-pad" aria-labelledby="understanding-title"><div className="section-index"><span>02 / HIỂU KẾT QUẢ</span><span>PHYSICS × CHEMISTRY × TIMING</span></div><div className="lab-understanding-grid"><div><span className="eyebrow">VÌ SAO LẠI NHƯ VẬY?</span><h2 id="understanding-title">Ánh sáng đi đâu<br /><em>trong một tấm film?</em></h2><p>Ánh sáng đi qua ống kính và chạm vào lớp nhũ tương nhạy sáng. Khẩu độ quyết định lượng ánh sáng, màn trập quyết định thời gian. Tráng film làm hình ảnh tiềm ẩn hiện ra; máy quét và cách chỉnh màu tiếp tục ảnh hưởng tấm ảnh bạn nhận.</p><p className="lab-science-note">Film ISO 400 không biến cảnh tối thành cảnh sáng. ISO thường cố định trong suốt cuộn film.</p></div><div><div className="lab-why-list">{result.reasons.map((reason, index) => <div key={reason}><span>0{index + 1}</span><p>{reason}</p></div>)}</div></div></div></section>

    <section className="lab-actions section-pad" aria-labelledby="actions-title"><div className="section-index"><span>03 / TRƯỚC KHI BẤM</span><span>THAY MỘT ĐIỀU</span></div><div className="lab-actions-head"><div><span className="eyebrow">HOW TO IMPROVE THIS SHOT?</span><h2 id="actions-title">Bạn có thể<br /><em>đổi điều gì?</em></h2></div><p>Ba gợi ý cụ thể cho thiết lập bạn vừa chọn. Bạn có thể quay lại khung thử nghiệm để đổi điều khiển.</p></div><div className="lab-suggestions">{result.suggestions.map((suggestion, index) => <article key={suggestion}><span>0{index + 1} / GỢI Ý</span><p>{suggestion}</p><Check size={19} aria-hidden="true" /></article>)}</div></section>

    <section className="lab-save section-pad" aria-labelledby="save-title"><div className="lab-save-grid"><div><span className="eyebrow">SOORAH / SHOT CARD</span><h2 id="save-title">Mang lời nhắc<br /><em>theo bạn.</em></h2><p>Lưu thiết lập và một gợi ý quan trọng trước khi ra ngoài chụp. Không cần tài khoản.</p><div className="lab-save-buttons"><button className="button button-red" type="button" onClick={downloadCard}>LƯU THẺ ẢNH <ArrowDownToLine size={17} /></button><button className="button button-outline-dark" type="button" onClick={shareSetup}>CHIA SẺ <Share2 size={17} /></button></div><p className="lab-save-notice" role="status">{notice}</p></div><div className="lab-paper-card"><span>SOORAH / FILM LAB</span><strong>{scene.label}</strong><p>ULTRAMAX 400 · {lightLabels[shot.light].toUpperCase()} · {shot.distance} M · FLASH {shot.flash.toUpperCase()}</p><div><span>THIẾU SÁNG / {riskLabels[result.exposureRisk]}</span><span>NHÒE / {riskLabels[result.motionRisk]}</span></div><small>ƯỚC TÍNH ĐỂ HỌC, KHÔNG BẢO ĐẢM ẢNH CUỐI.</small></div></div></section>

    <section className="lab-disclosure section-pad"><div><span className="eyebrow">MỘT LƯU Ý TRƯỚC KHI CHỤP</span><h2>Đây là một phép thử,<br /><em>không phải lời hứa.</em></h2><p>Film Lab đánh giá theo thông tin bạn chọn. Ảnh thật có thể khác vì máy đo sáng, ống kính, độ ổn định, tình trạng film, tráng và quét. Hai tiệm có thể quét cùng một âm bản theo hai cách khác nhau.</p></div><div className="lab-product-cta"><span>ĐANG THỬ VỚI</span><strong>{featuredProduct.name}</strong><p>{formatPrice(featuredProduct.price)} / {featuredProduct.exposures} tấm · chưa gồm tráng, quét và vận chuyển.</p><Link href={`/product/${featuredProduct.slug}`} className="button button-light" onClick={() => track("shop_from_simulator", { product: featuredProduct.id })}>XEM CUỘN FILM <ArrowUpRight size={17} /></Link></div></section>
  </div>;
}
