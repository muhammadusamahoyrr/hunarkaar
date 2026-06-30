'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function ShopTheRoom() {
  const [hovered, setHovered] = useState(false);
  const router = useRouter();

  return (
    <section
      id="shop-the-room"
      style={{
        background: '#1a1512',
        borderTop: '1px solid rgba(241,237,232,0.08)',
        borderBottom: '1px solid rgba(241,237,232,0.08)',
      }}
    >
      {/* Section header */}
      <motion.div
        style={{
          padding: '64px 8% 40px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <span
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.6rem',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: '#b8935a',
            marginBottom: 14,
          }}
        >
          Curated Interiors
        </span>
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 400,
            color: '#f1ede8',
            lineHeight: 1.1,
            marginBottom: 14,
          }}
        >
          Shop the Room
        </h2>
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.82rem',
            color: '#8a7d72',
            maxWidth: 480,
            lineHeight: 1.75,
          }}
        >
          Discover every piece in this curated Hunarkar interior — from hand-carved cabinetry to woven leather ottomans.
        </p>
      </motion.div>

      {/* Clickable room image */}
      <motion.div
        style={{ position: 'relative', cursor: 'pointer', lineHeight: 0 }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.8, delay: 0.15 }}
        onClick={() => router.push('/rooms')}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <img
          src="/room.png"
          alt="Hunarkar — Shop the Room"
          draggable={false}
          style={{ width: '100%', display: 'block', userSelect: 'none' }}
        />

        {/* Hover overlay */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(26,21,18,0.38)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <motion.div
                initial={{ scale: 0.94, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.94, opacity: 0 }}
                transition={{ duration: 0.22 }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 12,
                }}
              >
                {/* Plus circle */}
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: '50%',
                    border: '1px solid rgba(241,237,232,0.7)',
                    background: 'rgba(241,237,232,0.12)',
                    backdropFilter: 'blur(6px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '1.5rem',
                      fontWeight: 200,
                      color: '#f1ede8',
                      lineHeight: 1,
                    }}
                  >
                    +
                  </span>
                </div>
                <span
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.65rem',
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: '#f1ede8',
                  }}
                >
                  Shop the Room
                </span>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Footer */}
      <motion.div
        style={{
          padding: '28px 8% 56px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 20,
        }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <span
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.62rem',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: '#8a7d72',
          }}
        >
          12 pieces featured
        </span>
        <span style={{ width: 1, height: 12, background: 'rgba(138,125,114,0.4)' }} />
        <button
          onClick={() => router.push('/rooms')}
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.62rem',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: '#b8935a',
            background: 'none',
            border: 'none',
            borderBottom: '1px solid #b8935a',
            paddingBottom: 1,
            cursor: 'pointer',
          }}
        >
          Explore All Pieces
        </button>
      </motion.div>
    </section>
  );
}
