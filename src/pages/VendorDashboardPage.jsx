import { motion } from 'framer-motion';
import { useState } from 'react';
import { PageWrapper } from '../components/PageWrapper';
import { LayoutDashboard, Package, Store, Settings, QrCode, ChevronRight, Star, Eye, ShoppingBag, Calendar, Plus } from 'lucide-react';
import { PRODUCT_CATEGORIES } from '../data/cities';

const NAV_ITEMS = [
  { id: 'overview', label: 'Tableau de Bord', icon: <LayoutDashboard size={16} /> },
  { id: 'products', label: 'Mes Produits', icon: <Package size={16} /> },
  { id: 'promos', label: 'Promotions', icon: <Calendar size={16} /> },
  { id: 'storefront', label: 'Ma Boutique', icon: <Store size={16} /> },
  { id: 'settings', label: 'Paramètres', icon: <Settings size={16} /> },
];

function StatCard({ label, value, icon, color }) {
  return (
    <motion.div whileHover={{ y: -3 }} className="surface" style={{ padding: '20px 22px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
        <p className="label">{label}</p>
        <span style={{ color: color || 'var(--accent)' }}>{icon}</span>
      </div>
      <p style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.04em' }}>{value}</p>
    </motion.div>
  );
}

function OverviewSection() {
  return (
    <div>
      {/* Certification Score */}
      <div className="surface" style={{ padding: '20px 24px', marginBottom: 24, background: 'linear-gradient(135deg, var(--accent-light), var(--bg-surface))' }}>
        <p className="label" style={{ marginBottom: 8 }}>Score de Certification Élite</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ flex: 1, background: 'var(--border)', borderRadius: 999, height: 8, overflow: 'hidden' }}>
            <motion.div initial={{ width: 0 }} animate={{ width: '87%' }} transition={{ delay: 0.3, duration: 1 }}
              style={{ height: '100%', background: 'var(--accent)', borderRadius: 999 }} />
          </div>
          <span style={{ fontWeight: 800, color: 'var(--accent)', minWidth: 45 }}>87/100</span>
        </div>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 8 }}>Basé sur la rapidité de traitement et les avis clients — entièrement public et vérifiable</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14, marginBottom: 24 }}>
        <StatCard label="Visites aujourd'hui" value="142" icon={<Eye size={18} />} />
        <StatCard label="Commandes en attente" value="3" icon={<ShoppingBag size={18} />} color="var(--gold)" />
        <StatCard label="Note moyenne" value="4.9★" icon={<Star size={18} />} color="var(--gold)" />
        <StatCard label="Ventes cette semaine" value="34" icon={<Package size={18} />} color="var(--success)" />
      </div>

      <div className="surface" style={{ padding: '18px 22px' }}>
        <p style={{ fontWeight: 700, marginBottom: 14 }}>Livreurs disponibles autour de vous</p>
        {[
          { name: 'Rodrigue M.', note: 4.8, distance: '1.2 km', active: true },
          { name: 'Paul E.', note: 4.6, distance: '2.8 km', active: true },
        ].map((l) => (
          <div key={l.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <div style={{ width: 36, height: 36, borderRadius: 999, background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>🛵</div>
              <div>
                <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{l.name}</p>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{l.distance} · ⭐ {l.note}</p>
              </div>
            </div>
            <button className="btn-outline" style={{ padding: '6px 14px', fontSize: '0.78rem' }}>Assigner</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function AddProductForm() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ name: '', category: '', price: '', oldPrice: '', stock: '', description: '' });

  return (
    <div className="surface" style={{ padding: '24px', maxWidth: 560 }}>
      <div style={{ display: 'flex', gap: 6, marginBottom: 24 }}>
        {['Catégorie', 'Informations', 'Prix & Stock'].map((s, i) => (
          <div key={i} style={{ flex: 1, height: 4, borderRadius: 999, background: i <= step ? 'var(--accent)' : 'var(--border)', transition: 'background 0.3s' }} />
        ))}
      </div>

      {step === 0 && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <p style={{ fontWeight: 700, marginBottom: 4 }}>Choisissez une catégorie</p>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 16 }}>Les catégories sont standardisées pour garder le catalogue clair.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
            {PRODUCT_CATEGORIES.map((c) => (
              <button key={c.id} onClick={() => { setForm({ ...form, category: c.id }); setStep(1); }}
                style={{ padding: '12px', border: `1px solid ${form.category === c.id ? 'var(--accent)' : 'var(--border)'}`, borderRadius: 12, background: form.category === c.id ? 'var(--accent-light)' : 'var(--bg-surface)', cursor: 'pointer', textAlign: 'left', display: 'flex', gap: 8, alignItems: 'center' }}>
                <span style={{ fontSize: '1.2rem' }}>{c.icon}</span>
                <span style={{ fontSize: '0.82rem', fontWeight: 500, color: 'var(--text-primary)' }}>{c.name}</span>
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {step === 1 && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <p style={{ fontWeight: 700, marginBottom: 4 }}>Informations du produit</p>
          <input className="input-field" placeholder="Nom du produit" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <textarea className="input-field" rows={4} placeholder="Description détaillée..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} style={{ resize: 'none' }} />
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn-outline" onClick={() => setStep(0)}>← Retour</button>
            <button className="btn-primary" onClick={() => setStep(2)} style={{ flex: 1 }}>Continuer →</button>
          </div>
        </motion.div>
      )}

      {step === 2 && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <p style={{ fontWeight: 700, marginBottom: 4 }}>Prix & Stock</p>
          <input className="input-field" placeholder="Prix (FCFA)" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
          <input className="input-field" placeholder="Ancien prix si promotion (FCFA)" type="number" value={form.oldPrice} onChange={(e) => setForm({ ...form, oldPrice: e.target.value })} />
          <input className="input-field" placeholder="Stock disponible" type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
          <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Le stock exact sera affiché aux clients en toute transparence.</p>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn-outline" onClick={() => setStep(1)}>← Retour</button>
            <button className="btn-primary" style={{ flex: 1 }}>Publier le produit ✓</button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default function VendorDashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddProduct, setShowAddProduct] = useState(false);

  return (
    <PageWrapper variant="fade">
      <div style={{ paddingTop: 80, display: 'flex', minHeight: '100dvh' }}>
        {/* Sidebar */}
        <aside style={{ width: 220, flexShrink: 0, borderRight: '1px solid var(--border)', padding: '24px 16px', position: 'sticky', top: 64, height: 'calc(100dvh - 64px)', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {NAV_ITEMS.map((item) => (
            <button key={item.id} onClick={() => setActiveTab(item.id)}
              style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 12, border: 'none', background: activeTab === item.id ? 'var(--accent-light)' : 'transparent', color: activeTab === item.id ? 'var(--accent)' : 'var(--text-secondary)', cursor: 'pointer', textAlign: 'left', fontWeight: activeTab === item.id ? 600 : 400, fontSize: '0.88rem', transition: 'all 0.2s' }}>
              {item.icon} {item.label}
            </button>
          ))}
        </aside>

        {/* Main */}
        <main style={{ flex: 1, padding: '32px 32px', overflowY: 'auto' }}>
          <motion.div key={activeTab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            {activeTab === 'overview' && <OverviewSection />}
            {activeTab === 'products' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                  <h2 style={{ fontWeight: 700 }}>Mes Produits</h2>
                  <button className="btn-primary" onClick={() => setShowAddProduct(!showAddProduct)}>
                    <Plus size={14} /> Ajouter un produit
                  </button>
                </div>
                {showAddProduct && <AddProductForm />}
              </div>
            )}
            {activeTab === 'promos' && (
              <div>
                <h2 style={{ fontWeight: 700, marginBottom: 20 }}>Programmation des Promotions</h2>
                <div className="surface" style={{ padding: '24px', maxWidth: 560 }}>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: 16 }}>Planifiez une promotion avec une durée précise. Elle sera automatiquement activée et clôturée au moment choisi.</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <input className="input-field" placeholder="Produit concerné" />
                    <input className="input-field" placeholder="Nouveau prix FCFA" type="number" />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                      <div>
                        <p className="label" style={{ marginBottom: 4 }}>Début</p>
                        <input className="input-field" type="datetime-local" />
                      </div>
                      <div>
                        <p className="label" style={{ marginBottom: 4 }}>Fin</p>
                        <input className="input-field" type="datetime-local" />
                      </div>
                    </div>
                    <button className="btn-primary">Planifier la promotion</button>
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'storefront' && (
              <div>
                <h2 style={{ fontWeight: 700, marginBottom: 20 }}>Personnalisation de la Boutique</h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, maxWidth: 700 }}>
                  <div className="surface" style={{ padding: 20 }}>
                    <p className="label" style={{ marginBottom: 8 }}>Bannière de couverture</p>
                    <div style={{ height: 120, background: 'var(--border)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '0.82rem', color: 'var(--text-muted)' }}>📷 Changer la bannière</div>
                  </div>
                  <div className="surface" style={{ padding: 20 }}>
                    <p className="label" style={{ marginBottom: 8 }}>QR Code de votre boutique</p>
                    <div style={{ height: 120, background: 'var(--border)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '0.82rem', color: 'var(--text-muted)' }}>🔳 Générer & Télécharger</div>
                  </div>
                  <div className="surface" style={{ padding: 20, gridColumn: 'span 2' }}>
                    <p className="label" style={{ marginBottom: 8 }}>Message de bienvenue</p>
                    <textarea className="input-field" rows={3} placeholder="Ex : Bienvenue dans ma boutique. Spécialiste en téléphones certifiés depuis 2019..." style={{ resize: 'none' }} />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 10 }}>
                      <input className="input-field" placeholder="Heure d'ouverture (ex: 8h)" />
                      <input className="input-field" placeholder="Heure de fermeture (ex: 20h)" />
                    </div>
                    <button className="btn-primary" style={{ marginTop: 12 }}>Sauvegarder</button>
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'settings' && (
              <div>
                <h2 style={{ fontWeight: 700, marginBottom: 20 }}>Paramètres Avancés</h2>
                <div className="surface" style={{ padding: '24px', maxWidth: 560, display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <input className="input-field" placeholder="Numéro WhatsApp (+237...)" />
                  <input className="input-field" placeholder="Adresse de la boutique" />
                  <input className="input-field" placeholder="Email de contact" />
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderTop: '1px solid var(--border)' }}>
                    <div>
                      <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>Gestion des accès employé</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Invitez un gestionnaire de stock</p>
                    </div>
                    <button className="btn-outline" style={{ fontSize: '0.82rem', padding: '8px 14px' }}>Inviter</button>
                  </div>
                  <button className="btn-primary">Enregistrer les modifications</button>
                </div>
              </div>
            )}
          </motion.div>
        </main>
      </div>
    </PageWrapper>
  );
}
