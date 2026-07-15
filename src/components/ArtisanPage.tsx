'use client';

/* ============================================================
   ARTISAN DOSSIER — /artisans/[slug]

   A documentary spread, not a seller profile. Structure:

     masthead      name, craft, region
     ├ rail        sticky: portrait, THE LEDGER, commission CTA
     └ body        statement → process ladder
     the hand      full-bleed macro band, no text
     the work      catalogue raisonné, 3-up, no cards
     commission    sandstone closing panel

   The rail is position:sticky — no layer-speed differential, so this
   does not break the project's no-parallax rule. Reveals use the
   existing fade (opacity 0→1, y 30→0).
   ============================================================ */

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SiteShell, { useSiteContext, SafeImg } from './SiteShell';
import type { Artisan, Craft } from '@/lib/artisans';
import type { ProductItem } from '@/lib/siteData';

interface ArtisanPageProps {
  artisan: Artisan;
  craft: Craft;
  works: ProductItem[];
  /* Close-ups pulled from this artisan's own product galleries — real
     macro shots of their real work, rather than bought-in texture. */
  macros: string[];
}

function Dossier({ artisan, craft, works, macros }: ArtisanPageProps) {
  const { formatPrice, openBespoke } = useSiteContext();
  const rootRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('[data-ar-reveal]').forEach(el => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 30 },
          {
            opacity: 1, y: 0, duration: 0.9, ease: 'power2.out',
            scrollTrigger: { trigger: el, start: 'top 85%' },
          },
        );
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  const yearsPractising = new Date().getFullYear() - artisan.since;

  return (
    <main className="ar" ref={rootRef}>
      {/* ── Masthead ── */}
      <header className="ar-masthead panel-linen">
        <nav className="ar-breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Hunarkar</Link>
          <span aria-hidden="true">/</span>
          <span>Artisans</span>
          <span aria-hidden="true">/</span>
          <span className="ar-bc-current">{artisan.name}</span>
        </nav>

        <p className="ar-eyebrow">Artisan</p>
        <h1 className="ar-name">{artisan.name}</h1>
        <p className="ar-subtitle">
          {craft.discipline} <span aria-hidden="true">·</span> {artisan.city}, {artisan.region}
        </p>
      </header>

      <div className="ar-split">
        {/* ── Sticky rail ── */}
        <aside className="ar-rail">
          <div className="ar-rail-inner">
            <div className="ar-portrait">
              <SafeImg src={artisan.portrait} alt={`${artisan.name}, ${craft.discipline}`} />
            </div>

            {/* THE LEDGER — a workshop record, not a marketing card */}
            <dl className="ar-ledger">
              <div className="ar-ledger-row">
                <dt>Practising since</dt>
                <dd>{artisan.since}</dd>
              </div>
              <div className="ar-ledger-row">
                <dt>Years at the bench</dt>
                <dd>{yearsPractising}</dd>
              </div>
              <div className="ar-ledger-row">
                <dt>Generation</dt>
                <dd>{artisan.generation}</dd>
              </div>
              <div className="ar-ledger-row">
                <dt>Pieces for Hunarkar</dt>
                <dd>{works.length}</dd>
              </div>
              <div className="ar-ledger-row">
                <dt>Lead time</dt>
                <dd>{artisan.leadTime}</dd>
              </div>
              <div className="ar-ledger-row">
                <dt>Apprentices</dt>
                <dd>{artisan.apprentices}</dd>
              </div>
              <div className="ar-ledger-row">
                <dt>Workshop</dt>
                <dd>{artisan.studio}</dd>
              </div>
            </dl>

            <button
              type="button"
              className="cta-link ar-rail-cta"
              onClick={() => openBespoke(craft.bespoke)}
            >
              Commission {artisan.name}
            </button>
          </div>
        </aside>

        {/* ── Body ── */}
        <div className="ar-body">
          <blockquote className="ar-statement" data-ar-reveal>
            <p>{artisan.statement}</p>
            <cite>— {artisan.name}, {artisan.city}</cite>
          </blockquote>

          {/* ── The process ladder ── */}
          <section className="ar-process" aria-labelledby="ar-process-h">
            <h2 id="ar-process-h" className="ar-section-heading" data-ar-reveal>
              How a piece is made
            </h2>
            <p className="ar-process-lede" data-ar-reveal>{craft.label}</p>

            <ol className="ar-ladder">
              {craft.steps.map((step, i) => (
                <li className="ar-step" key={step.title} data-ar-reveal>
                  <span className="ar-step-num" aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="ar-step-text">
                    <h3 className="ar-step-title">{step.title}</h3>
                    <p className="ar-step-body">{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        </div>
      </div>

      {/* ── The Hand: full-bleed macro band, deliberately wordless ── */}
      {macros.length > 0 && (
        <section className="ar-hand" aria-label={`Details of ${artisan.name}’s work`}>
          <div className="ar-hand-strip">
            {macros.map((src, i) => (
              <div className="ar-hand-cell" key={`${src}-${i}`}>
                <SafeImg src={src} alt="" />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── The Work: catalogue raisonné, not a shop grid ── */}
      <section className="ar-work panel-linen" aria-labelledby="ar-work-h">
        <div className="ar-work-head" data-ar-reveal>
          <h2 id="ar-work-h" className="ar-section-heading">The work</h2>
          <p className="ar-work-count">
            {works.length} {works.length === 1 ? 'piece' : 'pieces'} for Hunarkar
          </p>
        </div>

        {works.length === 0 ? (
          <p className="ar-work-empty">
            No pieces by {artisan.name} are in the collection at present.
          </p>
        ) : (
          <ol className="ar-work-grid">
            {works.map((w, i) => (
              <li className="ar-work-item" key={w.id} data-ar-reveal>
                <Link href={`/shop/product/${w.id}`} className="ar-work-link">
                  <div className="ar-work-img">
                    <SafeImg src={w.img} alt={w.name} />
                  </div>
                  <div className="ar-work-meta">
                    <span className="ar-work-no" aria-hidden="true">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <h3 className="ar-work-name">{w.name}</h3>
                    <p className="ar-work-cat">{w.category}</p>
                    <p className="ar-work-price">{formatPrice(w.usdPrice, w.pkrPrice)}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ol>
        )}
      </section>

      {/* ── Commission: the close ── */}
      <section className="ar-commission panel-sandstone">
        <div className="ar-commission-inner" data-ar-reveal>
          <p className="ar-commission-eyebrow">Bespoke</p>
          <h2 className="ar-commission-title">
            Commission a piece from {artisan.name}
          </h2>
          <p className="ar-commission-body">
            {artisan.name} takes a small number of private commissions each year,
            worked to your dimensions from {artisan.studio} in {artisan.city}.
            Current lead time is {artisan.leadTime}.
          </p>
          <button
            type="button"
            className="cta-link ar-commission-cta"
            onClick={() => openBespoke(craft.bespoke)}
          >
            Begin a commission
          </button>
        </div>
      </section>
    </main>
  );
}

export default function ArtisanPage(props: ArtisanPageProps) {
  return (
    <SiteShell>
      <Dossier {...props} />
    </SiteShell>
  );
}
