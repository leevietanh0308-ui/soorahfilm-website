"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Minus, Plus } from "lucide-react";
import { faqs } from "@/data/content";

export default function CheatSheet({ compact = false }: { compact?: boolean }) { const [active, setActive] = useState<number | null>(0); return <section className={`cheat-sheet section-pad ${compact ? "compact" : ""}`} id="faq"><div className="section-index"><span>02 / SỔ TAY FILM</span><span>KIẾN THỨC CHO MỌI NGƯỜI</span></div><div className="cheat-grid"><div className="cheat-intro"><span className="eyebrow">MỚI CHỤP 35MM?</span><h2 data-reveal>Hỏi thật dễ.<br /><em>Hiểu thật rõ.</em></h2><p>Những điều bạn thật sự cần biết trước cuộn đầu tiên.</p><Link href="/products" className="text-link">XEM SẢN PHẨM <ArrowUpRight size={16} /></Link></div><div className="accordion">{faqs.map((faq, index) => <div className={`accordion-item ${active === index ? "active" : ""}`} key={faq.question}><button aria-expanded={active === index} aria-controls={`faq-answer-${index}`} onClick={() => setActive(active === index ? null : index)}><span className="faq-index">0{index + 1}</span><span>{faq.question}</span>{active === index ? <Minus size={17} /> : <Plus size={17} />}</button><div id={`faq-answer-${index}`} className="accordion-panel" hidden={active !== index}><p>{faq.answer}</p></div></div>)}</div></div></section>; }
