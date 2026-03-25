import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Star, Share2, MessageCircle, MapPin, ShoppingCart, Package, ChevronLeft } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { PageWrapper } from '../components/PageWrapper';

import { supabase } from '../lib/supabaseClient';

function formatPrice(amount) {
  return new Intl.NumberFormat('fr-FR').format(amount ?? 0) + ' FCFA';
}

export default function ProductPage() {
  const { id } = useParams();
  const addItem = useCartStore((s) => s.addItem);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*, vendors(*)')
          .eq('id', id)
          .single();

        if (error) throw error;

        // Remapping pour l'UI
        const mapped = {
          ...data,
          vendorName: data.vendors?.name || 'Vendeur Inconnu',
          vendorWhatsapp: data.vendors?.whatsapp || '237600000000',
          certified: data.vendors?.is_certified || false,
          image: data.images?.[0] || `https://picsum.photos/seed/${data.id}/400/400`,
          oldPrice: data.old_price,
          rating: 4.8, // Mocké car pas encore de système d'avis complet
          reviews: 12
        };
        setProduct(mapped);
      } catch (err) {
        console.error('Erreur produit:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  if (loading) return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-base)' }}>
      <motion.p animate={{ opacity: [0.4, 0.8, 0.4] }} transition={{ repeat: Infinity, duration: 1.5 }}>
        Chargement de l'article...
      </motion.p>
    </div>
  );

  if (!product) return <div style={{ padding: 100, textAlign: 'center' }}>Produit introuvable.</div>;

  const images = product.images || [product.image];
  const discount = product.oldPrice ? Math.round((1 - product.price / product.oldPrice) * 100) : null;

  const handleAdd = () => {
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const whatsappMsg = `Bonjour ${product.vendorName}, je suis intéressé par "${product.name}" à ${formatPrice(product.price)} sur VesTyle +++. Référence produit: #${product.id}`;

  return (
    <PageWrapper variant="slideUp">
      <div style={{ paddingTop: 80, maxWidth: 1100, margin: '0 auto', padding: '80px 20px 100px' }}>

        {/* Retour */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Link to={-1} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', fontSize: '0.85rem', textDecoration: 'none', marginBottom: 24 }}>
            <ChevronLeft size={16} /> Retour
          </Link>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'start' }}>
          {/* ─── Galerie Images ─── */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <div style={{ borderRadius: 24, overflow: 'hidden', background: 'var(--bg-surface)', border: '1px solid var(--border)', marginBottom: 12, position: 'relative' }}>
              <motion.img
                key={activeImg}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                src={images[activeImg]}
                alt={product.name}
                style={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover' }}
              />
              {discount && (
                <span className="badge-promo" style={{ position: 'absolute', top: 16, left: 16, fontSize: '0.8rem', padding: '4px 12px' }}>
                  -{discount}%
                </span>
              )}
            </div>
            {images.length > 1 && (
              <div style={{ display: 'flex', gap: 8 }}>
                {images.map((img, i) => (
                  <button key={i} onClick={() => setActiveImg(i)}
                    style={{ width: 70, height: 70, borderRadius: 12, overflow: 'hidden', border: `2px solid ${activeImg === i ? 'var(--accent)' : 'var(--border)'}`, cursor: 'pointer', padding: 0, background: 'none' }}>
                    <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* ─── Infos Produit ─── */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <p className="label" style={{ marginBottom: 6 }}>{product.category}</p>
              <h1 style={{ fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.2, color: 'var(--text-primary)', marginBottom: 12 }}>{product.name}</h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {product.rating && <>
                  <Star size={13} fill='var(--gold)' color='var(--gold)' />
                  <span style={{ fontWeight: 700, color: 'var(--text-secondary)' }}>{product.rating}</span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.84rem' }}>({product.reviews} avis)</span>
                </>}
                {product.certified && <span className="badge-gold" style={{marginLeft: 8}}>✓ Certifié</span>}
              </div>
            </div>

            {/* Prix */}
            <div style={{ padding: '20px', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
                <span style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-primary)' }}>{formatPrice(product.price)}</span>
                {product.oldPrice && <span style={{ fontSize: '1rem', textDecoration: 'line-through', color: 'var(--text-muted)' }}>{formatPrice(product.oldPrice)}</span>}
              </div>
              {product.oldPrice && <p style={{ fontSize: '0.82rem', color: 'var(--success)', fontWeight: 600 }}>Vous économisez {formatPrice(product.oldPrice - product.price)}</p>}
              {product.stock !== undefined && (
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 8, display: 'flex', alignItems: 'center', gap: 5 }}>
                  <Package size={12} /> Stock exact : <strong>{product.stock} pièces</strong>
                </p>
              )}
            </div>

            {/* Vendeur */}
            <Link to={`/boutique/${product.vendorId}`} className="surface" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px' }}>
              <img src={`https://picsum.photos/seed/${product.vendorId}/60/60`} alt={product.vendorName} style={{ width: 44, height: 44, borderRadius: 12, objectFit: 'cover' }} />
              <div>
                <p style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{product.vendorName}</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--accent)' }}>Voir la boutique →</p>
              </div>
              {product.certified && <span className="badge-gold" style={{ marginLeft: 'auto' }}>✓ Certifié</span>}
            </Link>

            {/* Description */}
            {product.description && (
              <div>
                <p className="label" style={{ marginBottom: 8 }}>Description</p>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>{product.description}</p>
              </div>
            )}

            {/* CTAs */}
            <div style={{ display: 'flex', gap: 10 }}>
              <motion.button
                className="btn-primary"
                style={{ flex: 1 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleAdd}
              >
                <ShoppingCart size={16} />
                {added ? '✓ Ajouté au panier !' : 'Ajouter au panier'}
              </motion.button>

              <motion.a
                whileTap={{ scale: 0.97 }}
                href={`https://wa.me/${product.vendorWhatsapp || '237600000000'}?text=${encodeURIComponent(whatsappMsg)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline"
                style={{ padding: '12px 16px' }}
              >
                <MessageCircle size={16} />
                WhatsApp
              </motion.a>
            </div>
          </motion.div>
        </div>
      </div>
    </PageWrapper>
  );
}
