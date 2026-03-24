import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';
import { CAMEROON_CITIES } from '../data/cities';
import { MapPin, ChevronRight, Package, Star } from 'lucide-react';
import { PageWrapper } from '../components/PageWrapper';

// Phrases d'explication de la plateforme — affichées séquentiellement
const PLATFORM_PHRASES = [
  'Connectez-vous aux meilleurs vendeurs de votre ville.',
  'Transparence totale. Classement basé sur les vraies performances.',
  'Livraison suivie à la seconde près sur carte satellite.',
  'Zéro frais cachés. Zéro intermédiaires financiers.',
];

// Messages du "Live Feed" (ticker du bas)
const LIVE_FEED = [
  '📦 Une commande livrée à Akwa (Douala) il y a 2 min',
  '⭐ La boutique "TechZone Yaoundé" vient d\'être certifiée Élite',
  '📦 3 commandes dispatch\u00e9es à Bafoussam cette heure',
  '🛵 15 livreurs actifs en ce moment à Douala',
  '⭐ "Mode & Chic" a reçu sa 100e évaluation 5 étoiles',
  '📦 Livraison confirmée à Bonapriso il y a 5 min',
];

export default function CitySelectPage() {
  const navigate = useNavigate();
  const setCity = useCartStore((s) => s.setCity);
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [selected, setSelected] = useState(null);

  // Rotation des phrases
  useEffect(() => {
    const t = setInterval(() => setPhraseIdx((i) => (i + 1) % PLATFORM_PHRASES.length), 3500);
    return () => clearInterval(t);
  }, []);

  const handleCitySelect = (city) => {
    setSelected(city.id);
    setTimeout(() => {
      setCity(city);
      navigate(`/ville/${city.id}`);
    }, 500);
  };

  return (
    <PageWrapper variant="zoom">
      <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>

        {/* ─── Header supérieur ─── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 32px' }}>
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <span style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--accent)', letterSpacing: '-0.04em' }}>
              VesTyle<span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginLeft: 2 }}>+++</span>
            </span>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <button
              onClick={() => navigate('/auth?role=vendor')}
              className="btn-primary"
              style={{ fontSize: '0.85rem', padding: '10px 20px' }}
            >
              Devenir Vendeur <ChevronRight size={14} />
            </button>
          </motion.div>
        </div>

        {/* ─── Zone Centrale ─── */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 24px', textAlign: 'center' }}>

          {/* Phrase animée */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6 }}
            style={{ marginBottom: 12, minHeight: 28 }}
          >
            <AnimatePresence mode="wait">
              <motion.p
                key={phraseIdx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
                className="label"
                style={{ color: 'var(--accent)' }}
              >
                {PLATFORM_PHRASES[phraseIdx]}
              </motion.p>
            </AnimatePresence>
          </motion.div>

          {/* Titre principal */}
          <motion.h1
            className="display"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            style={{ marginBottom: 16 }}
          >
            Où êtes-vous ?
          </motion.h1>

          <motion.p
            className="subheading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            style={{ maxWidth: 460, marginBottom: 56 }}
          >
            Choisissez votre ville pour découvrir les meilleurs vendeurs qui vous entourent.
          </motion.p>

          {/* Grille des villes */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
              gap: 12,
              width: '100%',
              maxWidth: 720,
            }}
          >
            {CAMEROON_CITIES.map((city, i) => (
              <motion.button
                key={city.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.55 + i * 0.04 }}
                whileHover={{ scale: 1.04, y: -3 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleCitySelect(city)}
                style={{
                  background: selected === city.id ? 'var(--accent)' : 'var(--bg-surface)',
                  border: `1px solid ${selected === city.id ? 'var(--accent)' : 'var(--border)'}`,
                  borderRadius: 16,
                  padding: '18px 12px',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.25s cubic-bezier(0.34,1.56,0.64,1)',
                  boxShadow: selected === city.id ? '0 8px 24px rgba(249,115,22,0.3)' : 'none',
                }}
              >
                <div style={{ fontSize: '2rem', marginBottom: 6 }}>{city.emoji}</div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: selected === city.id ? '#fff' : 'var(--text-primary)' }}>{city.name}</div>
                <div style={{ fontSize: '0.7rem', color: selected === city.id ? 'rgba(255,255,255,0.8)' : 'var(--text-muted)', marginTop: 2 }}>{city.region}</div>
              </motion.button>
            ))}
          </motion.div>

          {/* Badge Anti-Arnaque */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
            style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 40, padding: '10px 20px', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 999 }}
          >
            <Star size={12} color='var(--gold)' fill='var(--gold)' />
            <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              100% Transparent · Certification vérifiée · Zéro frais cachés
            </span>
            <Star size={12} color='var(--gold)' fill='var(--gold)' />
          </motion.div>
        </div>

        {/* ─── Mini carte GPS preview ─── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          style={{
            margin: '0 auto 32px', maxWidth: 360, width: '90%',
            background: 'var(--bg-surface)', border: '1px solid var(--border)',
            borderRadius: 20, padding: '16px 20px',
            display: 'flex', alignItems: 'center', gap: 14,
          }}
        >
          {/* Pseudo carte animée */}
          <div style={{ width: 50, height: 50, borderRadius: 12, background: 'linear-gradient(135deg,#1a3a4a,#0f2a3a)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', flexShrink: 0 }}>
            <motion.div
              animate={{ x: [0, 8, 4, 12, 6], y: [0, -4, -8, -2, -6] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
              style={{ position: 'absolute' }}
            >
              <span style={{ fontSize: '1.2rem' }}>🛵</span>
            </motion.div>
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-primary)' }}>Suivi en temps réel</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>Votre livreur mis à jour toutes les 30s sur la carte</div>
          </div>
        </motion.div>

        {/* ─── Live Ticker ─── */}
        <div style={{ overflow: 'hidden', borderTop: '1px solid var(--border)', padding: '10px 0', background: 'var(--bg-surface)' }}>
          <div className="ticker-inner" style={{ display: 'flex', gap: '60px' }}>
            {[...LIVE_FEED, ...LIVE_FEED].map((msg, i) => (
              <span key={i} style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', flexShrink: 0 }}>{msg}</span>
            ))}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
