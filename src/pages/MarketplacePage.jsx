import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';
import { PRODUCT_CATEGORIES } from '../data/cities';
import ProductCard from '../components/ProductCard';
import { PageWrapper } from '../components/PageWrapper';
import { Search, SlidersHorizontal, Zap, TrendingUp, Star, Flame } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';


function formatPrice(amount) {
  return new Intl.NumberFormat('fr-FR').format(amount ?? 0) + ' FCFA';
}

// Algorithme de classement des promotions : max économie absolue
function sortByDiscount(products) {
  return [...products]
    .filter((p) => p.old_price)
    .sort((a, b) => (b.old_price - b.price) - (a.old_price - a.price));
}

const FILTERS = [
  { id: 'all', label: 'Tout', icon: <TrendingUp size={13} /> },
  { id: 'trending', label: 'En Feu', icon: <Flame size={13} /> },
  { id: 'electronique', label: 'Tech', icon: null },
  { id: 'mode', label: 'Mode', icon: null },
  { id: 'alimentation', label: 'Food', icon: null },
];

export default function MarketplacePage() {
  const { cityId } = useParams();
  const selectedCity = useCartStore((s) => s.selectedCity);
  const city = selectedCity || { name: cityId };

  const [activeFilter, setActiveFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [vendors, setVendors] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        // 1. Fetch Vendors in this city
        const { data: vData, error: vErr } = await supabase
          .from('vendors')
          .select('*')
          .eq('city_id', cityId)
          .eq('is_active', true)
          .order('click_count', { ascending: false });

        if (vErr) throw vErr;
        setVendors(vData || []);

        // 2. Fetch Products for these vendors (via join)
        const { data: pData, error: pErr } = await supabase
          .from('products')
          .select('*, vendors(name, is_certified)')
          .eq('is_published', true);
        
        if (pErr) throw pErr;

        // On filtre par ville côté client car le join eq sur nested table est plus complexe en select simple
        const cityProducts = (pData || []).filter(p => vendors.some(v => v.id === p.vendor_id) || vData.some(v => v.id === p.vendor_id));
        
        // Remapping pour compatibilité ProductCard
        const mappedProducts = cityProducts.map(p => ({
          ...p,
          vendorName: p.vendors?.name || 'Vendeur Inconnu',
          certified: p.vendors?.is_certified || false,
          image: p.images?.[0] || `https://picsum.photos/seed/${p.id}/400/400`,
          oldPrice: p.old_price, // Compatibilité avec l'ancien code
          trending: p.is_trending
        }));

        setProducts(mappedProducts);
      } catch (err) {
        console.error('Erreur Supabase:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [cityId]);

  // La marketplace affiche les vendeurs & produits filtrés
  const filteredProducts = products.filter((p) => {
    const matchFilter = activeFilter === 'all' ? true
      : activeFilter === 'trending' ? p.trending
      : p.category_id === activeFilter;
    const matchSearch = search
      ? p.name.toLowerCase().includes(search.toLowerCase()) || p.vendorName.toLowerCase().includes(search.toLowerCase())
      : true;
    return matchFilter && matchSearch;
  });

  const promoProducts = sortByDiscount(products).slice(0, 4);

  return (
    <PageWrapper variant="zoom">
      <div style={{ paddingTop: 80, paddingBottom: 100, minHeight: '100dvh' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>

          {loading ? (
            <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
              <motion.div
                animate={{ opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                Initialisation de la marketplace à {city.name}...
              </motion.div>
            </div>
          ) : (
            <>
              {/* ─── Hero de la ville ─── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ marginBottom: 32 }}
          >
            <p className="label" style={{ marginBottom: 6 }}>Marketplace locale</p>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
              <h1 className="heading">{city.emoji || ''} {city.name || cityId}</h1>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', gap: 16 }}>
                <span><span style={{ fontWeight: 700, color: 'var(--text-secondary)' }}>{vendors.length}</span> boutiques actives</span>
                <span><span style={{ fontWeight: 700, color: 'var(--text-secondary)' }}>{products.length}</span> produits</span>
                <span style={{ color: 'var(--success)' }}>● 5 livreurs actifs</span>
              </div>
            </div>
          </motion.div>

          {/* ─── Barre de Recherche ─── */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            style={{ position: 'relative', marginBottom: 24 }}
          >
            <Search size={18} color='var(--text-muted)' style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)' }} />
            <input
              className="input-field"
              style={{ paddingLeft: 48, borderRadius: 999 }}
              placeholder={`Chercher un produit ou vendeur à ${city.name || cityId}...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </motion.div>

          {/* ─── Section : Boutiques d'Élite ─── */}
          <section style={{ marginBottom: 48 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div>
                <h2 style={{ fontWeight: 700, fontSize: '1.15rem', marginBottom: 2 }}>Les Élites Locales</h2>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Classées par nombre de visites uniques cette semaine</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 14, overflowX: 'auto', paddingBottom: 8 }}>
              {vendors.map((v, i) => (
                <motion.a
                  key={v.id}
                  href={`/boutique/${v.id}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 + i * 0.06 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  className="surface"
                  style={{ flexShrink: 0, padding: '16px 20px', textDecoration: 'none', cursor: 'pointer', minWidth: 180 }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                    <img src={v.image} alt={v.name} style={{ width: 40, height: 40, borderRadius: 12, objectFit: 'cover' }} />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-primary)' }}>{v.name}</div>
                      {v.certified && <span className="badge-gold" style={{ fontSize: '0.62rem' }}>✓ Certifié</span>}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Star size={11} fill='var(--gold)' color='var(--gold)' />
                    <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{v.rating}</span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>({v.reviews})</span>
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 4 }}>
                    👁 {v.clicks.toLocaleString()} visites cette semaine
                  </div>
                </motion.a>
              ))}
            </div>
          </section>

          {/* ─── Section : Affaires en Or (Algorithme Promos) ─── */}
          {promoProducts.length > 0 && (
            <section style={{ marginBottom: 48 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                <h2 style={{ fontWeight: 700, fontSize: '1.15rem' }}>Les Affaires en Or</h2>
                <span className="badge-promo">🔥 {promoProducts.length} offres</span>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 16 }}>
                Classées par économie maximale garantie — formule : (prix initial × réduction%)
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14 }}>
                {promoProducts.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
              </div>
            </section>
          )}

          {/* ─── Section : Filtres + Catalogue ─── */}
          <section>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20, overflowX: 'auto', paddingBottom: 4 }}>
              {FILTERS.map((f) => (
                <motion.button
                  key={f.id}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveFilter(f.id)}
                  style={{
                    padding: '8px 18px', borderRadius: 999, border: '1px solid',
                    borderColor: activeFilter === f.id ? 'var(--accent)' : 'var(--border)',
                    background: activeFilter === f.id ? 'var(--accent)' : 'var(--bg-surface)',
                    color: activeFilter === f.id ? '#fff' : 'var(--text-secondary)',
                    cursor: 'pointer', fontWeight: 500, fontSize: '0.85rem',
                    flexShrink: 0, display: 'flex', alignItems: 'center', gap: 5,
                    transition: 'all 0.2s',
                  }}
                >
                  {f.icon}{f.label}
                </motion.button>
              ))}
            </div>

            {filteredProducts.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
                <p style={{ fontSize: '2rem', marginBottom: 12 }}>🔍</p>
                <p>Aucun produit trouvé pour votre recherche.</p>
              </motion.div>
            ) : (
              <motion.div
                layout
                style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}
              >
                {filteredProducts.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
              </motion.div>
            )}
          </section>

            </>
          )}
        </div>
      </div>
    </PageWrapper>
  );
}
