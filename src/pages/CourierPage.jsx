import { motion } from 'framer-motion';
import { useState } from 'react';
import { PageWrapper } from '../components/PageWrapper';
import { MapPin, Package, Star, Camera, CheckCircle } from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({ iconRetinaUrl: markerIcon2x, iconUrl: markerIcon, shadowUrl: markerShadow });

const MOCK_ORDERS = [
  { id: '#C231', client: 'Mireille A.', address: 'Bonapriso, Rue Flatters', items: 'iPhone 15 Pro Max', vendor: 'TechZone Douala', coords: [4.0495, 9.7381], status: 'ready' },
  { id: '#C198', client: 'Jean-Baptiste N.', address: 'Akwa, Rue Joffre', items: 'Casque Sony WH-1000XM5', vendor: 'TechZone Douala', coords: [4.0611, 9.7259], status: 'ready' },
];

export default function CourierPage() {
  const [online, setOnline] = useState(false);
  const [activeOrder, setActiveOrder] = useState(null);

  return (
    <PageWrapper variant="fade">
      <div style={{ paddingTop: 80, maxWidth: 740, margin: '0 auto', padding: '90px 20px 100px' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
          <div>
            <h1 style={{ fontWeight: 800, fontSize: '1.5rem', marginBottom: 4 }}>Espace Livreur</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.82rem' }}>
                <Star size={12} fill='var(--gold)' color='var(--gold)' /> <strong>4.8</strong> note moyenne
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>· 127 livraisons effectuées</span>
            </div>
          </div>

          {/* Toggle En Ligne */}
          <motion.button
            onClick={() => setOnline(!online)}
            whileTap={{ scale: 0.95 }}
            style={{
              padding: '12px 24px', borderRadius: 999, border: 'none', cursor: 'pointer', fontWeight: 700,
              background: online ? 'var(--success)' : 'var(--border)',
              color: online ? '#fff' : 'var(--text-secondary)',
              boxShadow: online ? '0 6px 20px rgba(5,150,105,0.35)' : 'none',
              transition: 'all 0.3s',
            }}
          >
            {online ? '● En ligne' : '◯ Hors ligne'}
          </motion.button>
        </div>

        {!online ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="surface" style={{ textAlign: 'center', padding: '60px 24px' }}>
            <p style={{ fontSize: '2.5rem', marginBottom: 12 }}>🛵</p>
            <h2 style={{ fontWeight: 700, marginBottom: 8 }}>Vous êtes hors ligne</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>Activez le mode En Ligne pour recevoir des courses et partager votre position.</p>
            <button className="btn-primary" onClick={() => setOnline(true)}>Me mettre en ligne</button>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {/* Courses disponibles */}
            <h2 style={{ fontWeight: 700, marginBottom: 16 }}>Courses disponibles</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
              {MOCK_ORDERS.map((order) => (
                <motion.div key={order.id} whileHover={{ y: -2 }} className="surface" style={{ padding: '18px 20px', cursor: 'pointer' }}
                  onClick={() => setActiveOrder(activeOrder?.id === order.id ? null : order)}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
                    <div>
                      <p style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: 2 }}>{order.id} — {order.client}</p>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{order.items}</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4, fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        <MapPin size={11} /> {order.address}
                      </div>
                    </div>
                    <button className="btn-primary" style={{ fontSize: '0.82rem', padding: '8px 14px' }}>Accepter</button>
                  </div>
                  {activeOrder?.id === order.id && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} style={{ marginTop: 12, borderTop: '1px solid var(--border)', paddingTop: 12 }}>
                      <div style={{ borderRadius: 16, overflow: 'hidden', height: 200 }}>
                        <MapContainer center={order.coords} zoom={14} style={{ height: '100%', width: '100%' }}>
                          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                          <Marker position={order.coords} />
                        </MapContainer>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Preuve de Livraison */}
            <h2 style={{ fontWeight: 700, marginBottom: 16 }}>Preuve de Livraison</h2>
            <div className="surface" style={{ padding: '20px' }}>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 16 }}>
                À votre arrivée, photographiez le colis devant la porte. Cette preuve est envoyée automatiquement au client et au vendeur.
              </p>
              <button className="btn-outline" style={{ width: '100%', justifyContent: 'center', gap: 8 }}>
                <Camera size={16} /> Prendre la photo de livraison
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </PageWrapper>
  );
}
