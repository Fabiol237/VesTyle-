import { motion } from 'framer-motion';
import { useCartStore } from '../store/useCartStore';
import { ShoppingCart, Eye, Share2, Star, Package } from 'lucide-react';
import { Link } from 'react-router-dom';

// Formate le prix en FCFA
function formatPrice(amount) {
  return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA';
}

export default function ProductCard({ product, index = 0 }) {
  const addItem = useCartStore((s) => s.addItem);

  const discount = product.oldPrice
    ? Math.round((1 - product.price / product.oldPrice) * 100)
    : null;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    // Animation visuelle (le bouton pulse)
  };

  const handleShare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const text = `🛍️ ${product.name} à ${formatPrice(product.price)} sur VesTyle +++\nVia ${product.vendorName}\nhttps://vestyle.cm/produit/${product.id}`;
    const wa = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(wa, '_blank');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="product-card"
    >
      <Link to={`/produit/${product.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
        <div style={{ position: 'relative', overflow: 'hidden' }}>
          <img
            src={product.image || `https://picsum.photos/seed/${product.id}/400/400`}
            alt={product.name}
            className="product-img"
          />

          {/* Badges */}
          <div style={{ position: 'absolute', top: 10, left: 10, display: 'flex', flexDirection: 'column', gap: 4 }}>
            {discount && <span className="badge-promo">-{discount}%</span>}
            {product.trending && <span className="badge-accent">🔥 Tendance</span>}
            {product.certified && <span className="badge-gold">✓ Certifié</span>}
          </div>

          {/* Actions overlay */}
          <div style={{
            position: 'absolute', top: 10, right: 10, display: 'flex', flexDirection: 'column', gap: 6,
            opacity: 0, transition: 'opacity 0.2s',
          }} className="product-actions">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleShare}
              style={{ width: 32, height: 32, borderRadius: 999, background: 'rgba(255,255,255,0.9)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <Share2 size={14} color="#374151" />
            </motion.button>
          </div>

          {/* Stock indicator */}
          {product.stock !== undefined && (
            <div style={{ position: 'absolute', bottom: 8, left: 10 }}>
              <span style={{ fontSize: '0.68rem', background: 'rgba(0,0,0,0.65)', color: '#fff', padding: '2px 8px', borderRadius: 999, backdropFilter: 'blur(4px)' }}>
                <Package size={9} style={{ display: 'inline', marginRight: 3 }} />
                Stock : {product.stock}
              </span>
            </div>
          )}
        </div>

        <div style={{ padding: '12px 14px 14px' }}>
          {/* Vendeur */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 5 }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 500 }}>
              {product.vendorName}
            </span>
            {product.certified && <span style={{ color: 'var(--accent)', fontSize: '0.65rem' }}>✓</span>}
          </div>

          {/* Nom */}
          <p style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: 8, lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {product.name}
          </p>

          {/* Note */}
          {product.rating && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 3, marginBottom: 8 }}>
              <Star size={11} fill='var(--gold)' color='var(--gold)' />
              <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{product.rating}</span>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>({product.reviews})</span>
            </div>
          )}

          {/* Prix */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
            <div>
              <span style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-primary)' }}>
                {formatPrice(product.price)}
              </span>
              {product.oldPrice && (
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textDecoration: 'line-through', marginLeft: 6 }}>
                  {formatPrice(product.oldPrice)}
                </span>
              )}
            </div>

            {/* Bouton Ajouter */}
            <motion.button
              whileTap={{ scale: 0.85 }}
              whileHover={{ scale: 1.08 }}
              onClick={handleAddToCart}
              style={{
                width: 36, height: 36, borderRadius: 999,
                background: 'var(--accent)', border: 'none',
                cursor: 'pointer', color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(249,115,22,0.3)',
                transition: 'box-shadow 0.2s',
              }}
            >
              <ShoppingCart size={15} />
            </motion.button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
