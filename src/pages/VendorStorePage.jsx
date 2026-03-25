import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { MapPin, MessageCircle, Star, Package, ChevronLeft, ExternalLink } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { PageWrapper } from '../components/PageWrapper';
import { useCartStore } from '../store/useCartStore';


export default function VendorStorePage() {
  const { vendorId } = useParams();
  const vendor = MOCK_VENDORS[vendorId] || MOCK_VENDORS.v1;
  const city = useCartStore((s) => s.selectedCity);

  return (
    <PageWrapper variant="zoomSlide">
      <div style={{ paddingBottom: 100, minHeight: '100dvh' }}>

        {/* ─── Hero Bannière (Parallax-ready) ─── */}
        <div style={{ position: 'relative', height: 280, overflow: 'hidden' }}>
          <motion.img
            src={vendor.banner}
            alt={vendor.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 30%, rgba(0,0,0,0.7))' }} />

          {/* Retour */}
          <Link to={-1} style={{ position: 'absolute', top: 80, left: 20, color: '#fff', display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', textDecoration: 'none', background: 'rgba(0,0,0,0.3)', padding: '6px 12px', borderRadius: 999, backdropFilter: 'blur(8px)' }}>
            <ChevronLeft size={14} /> Retour
          </Link>

          {/* Avatar positionné sur la bannière */}
          <div style={{ position: 'absolute', bottom: -30, left: 32, display: 'flex', alignItems: 'flex-end', gap: 14 }}>
            <img src={vendor.avatar} alt={vendor.name} style={{ width: 80, height: 80, borderRadius: 20, border: '4px solid var(--bg-base)', objectFit: 'cover' }} />
          </div>
        </div>

        {/* ─── Info Boutique ─── */}
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ marginTop: 44, marginBottom: 32, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                <h1 style={{ fontSize: '1.7rem', fontWeight: 800, letterSpacing: '-0.02em' }}>{vendor.name}</h1>
                {vendor.certified && <span className="badge-gold">✓ Certifié</span>}
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: 6 }}>{vendor.category}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.82rem' }}>
                  <Star size={12} fill='var(--gold)' color='var(--gold)' />
                  <strong>{vendor.rating}</strong>
                  <span style={{ color: 'var(--text-muted)' }}>({vendor.reviews} avis)</span>
                </span>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  👁 {vendor.clicks.toLocaleString()} visites cette semaine
                </span>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  <Package size={12} style={{ display: 'inline', marginRight: 3 }} />
                  {vendor.totalSoldThisWeek} ventes cette semaine
                </span>
              </div>
            </div>

            {/* CTA WhatsApp */}
            <motion.a
              href={`https://wa.me/${vendor.whatsapp}?text=${encodeURIComponent(`Bonjour ${vendor.name}, j'ai trouvé votre boutique sur VesTyle +++.`)}`}
              target="_blank" rel="noopener noreferrer"
              className="btn-primary"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              <MessageCircle size={16} />
              Contacter sur WhatsApp
            </motion.a>
          </div>

          {/* ─── Panels d'Infos ─── */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14, marginBottom: 40 }}>
            <div className="surface" style={{ padding: '18px 20px' }}>
              <p className="label" style={{ marginBottom: 6 }}>À propos</p>
              <p style={{ fontSize: '0.88rem', lineHeight: 1.7, color: 'var(--text-secondary)' }}>{vendor.bio}</p>
            </div>
            <div className="surface" style={{ padding: '18px 20px' }}>
              <p className="label" style={{ marginBottom: 12 }}>Infos pratiques</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', gap: 8, fontSize: '0.84rem', color: 'var(--text-secondary)', alignItems: 'flex-start' }}>
                  <MapPin size={14} color='var(--accent)' style={{ flexShrink: 0, marginTop: 2 }} />
                  {vendor.address}
                </div>
                <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>🕐 {vendor.hours}</div>
              </div>
            </div>
          </div>

          {/* ─── Catalogue ─── */}
          <h2 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: 20 }}>Catalogue de la boutique</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
            {VENDOR_PRODUCTS.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
