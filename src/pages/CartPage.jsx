import { motion } from 'framer-motion';
import { useCartStore } from '../store/useCartStore';
import { PageWrapper } from '../components/PageWrapper';
import { Trash2, Plus, Minus, MessageCircle, MapPin, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({ iconRetinaUrl: markerIcon2x, iconUrl: markerIcon, shadowUrl: markerShadow });

import { supabase } from '../lib/supabaseClient';

const deliveryIcon = L.divIcon({ html: '<span style="font-size:1.8rem">🛵</span>', className: '', iconAnchor: [14, 14] });
const homeIcon = L.divIcon({ html: '<span style="font-size:1.5rem">🏠</span>', className: '', iconAnchor: [12, 12] });
const shopIcon = L.divIcon({ html: '<span style="font-size:1.5rem">🏪</span>', className: '', iconAnchor: [12, 12] });

// Interpolation 60 FPS entre deux positions
function lerp(a, b, t) { return a + (b - a) * t; }

function AnimatedMarker({ start, end }) {
  const markerRef = useRef(null);
  const progress = useRef(0);
  const rafRef = useRef(null);
  const lastEnd = useRef(end);

  useEffect(() => {
    // Si la destination change, on reset la progression pour une transition fluide
    if (lastEnd.current[0] !== end[0] || lastEnd.current[1] !== end[1]) {
      progress.current = 0;
      lastEnd.current = end;
    }

    const animate = () => {
      progress.current = Math.min(progress.current + 0.05, 1); // Plus rapide pour le live
      if (markerRef.current) {
        markerRef.current.setLatLng([
          lerp(markerRef.current.getLatLng().lat, end[0], progress.current),
          lerp(markerRef.current.getLatLng().lng, end[1], progress.current),
        ]);
      }
      if (progress.current < 1) rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [end[0], end[1]]);

  return <Marker position={start} icon={deliveryIcon} ref={markerRef} />;
}

function LiveMap({ courierPos, shopPos = [4.0611, 9.7259], homePos = [4.0495, 9.7381] }) {
  const currentPos = courierPos || shopPos;
  const mid = [(shopPos[0] + homePos[0]) / 2, (shopPos[1] + homePos[1]) / 2];

  return (
    <div style={{ borderRadius: 20, overflow: 'hidden', border: '1px solid var(--border)', height: 320 }}>
      <MapContainer center={mid} zoom={14} style={{ height: '100%', width: '100%' }} zoomControl={false}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="© OpenStreetMap" />
        <Marker position={shopPos} icon={shopIcon} />
        <Marker position={homePos} icon={homeIcon} />
        <AnimatedMarker start={currentPos} end={currentPos} />
        <Polyline positions={[shopPos, homePos]} color="var(--accent)" weight={3} dashArray="6 8" opacity={0.7} />
      </MapContainer>
    </div>
  );
}

function formatPrice(amount) { return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA'; }

export default function CartPage() {
  const { items, updateQuantity, removeItem, getItemsByVendor } = useCartStore();
  const byVendor = getItemsByVendor();
  const [courierPos, setCourierPos] = useState([4.0511, 9.7679]);

  // ID de test pour le livreur (le même que dans le seed.sql)
  const COURIER_ID = 'e5e5e5e5-e5e5-e5e5-e5e5-e5e5e5e5e5e5';

  useEffect(() => {
    // 1. Charger la position initiale
    const fetchInitialPos = async () => {
      const { data } = await supabase
        .from('courier_locations')
        .select('*')
        .eq('courier_id', COURIER_ID)
        .single();
      
      if (data) setCourierPos([data.lat, data.lng]);
    };
    fetchInitialPos();

    // 2. Écouter les mises à jour en temps réel
    const channel = supabase
      .channel('realtime_gps')
      .on('postgres_changes', { 
        event: 'UPDATE', 
        schema: 'public', 
        table: 'courier_locations',
        filter: `courier_id=eq.${COURIER_ID}` 
      }, (payload) => {
        if (payload.new && payload.new.is_online) {
          setCourierPos([payload.new.lat, payload.new.lng]);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (items.length === 0) {
    return (
      <PageWrapper variant="slideRight">
        <div style={{ paddingTop: 120, textAlign: 'center', padding: '120px 24px' }}>
          <ShoppingBag size={64} color="var(--text-muted)" style={{ margin: '0 auto 20px' }} />
          <h2 style={{ fontWeight: 700, marginBottom: 8 }}>Votre panier est vide</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: 28 }}>Explorez les boutiques de votre ville.</p>
          <Link to={-1} className="btn-primary">Continuer mes achats</Link>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper variant="slideRight">
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '90px 20px 100px' }}>
        <motion.h1 className="heading" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 8 }}>
          Mon Panier
        </motion.h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: 40 }}>{items.length} article(s) — réglez directement avec les vendeurs via WhatsApp</p>

        {/* ─── Suivi GPS Live ─── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="surface" style={{ marginBottom: 32, overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: 2 }}>🛵 Suivi de livraison en direct</h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Position mise à jour toutes les 30 secondes</p>
            </div>
            <span style={{ fontSize: '0.72rem', color: 'var(--success)', fontWeight: 700, background: 'rgba(5,150,105,0.12)', padding: '4px 12px', borderRadius: 999 }}>● EN DIRECT</span>
          </div>
          <LiveMap courierPos={courierPos} />
        </motion.div>

        {/* ─── Articles par Vendeur ─── */}
        {Object.values(byVendor).map((group, gi) => {
          const total = group.items.reduce((a, i) => a + i.price * i.quantity, 0);
          const wa = `https://wa.me/${group.vendor.whatsapp || '237600000000'}?text=${encodeURIComponent(
            `Bonjour ${group.vendor.name}, je valide ma commande VesTyle +++ :\n` +
            group.items.map(i => `- ${i.name} ×${i.quantity} = ${formatPrice(i.price * i.quantity)}`).join('\n') +
            `\nTotal : ${formatPrice(total)}`
          )}`;

          return (
            <motion.div key={group.vendor.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + gi * 0.08 }} className="surface" style={{ marginBottom: 20, overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <p style={{ fontWeight: 700 }}>{group.vendor.name}</p>
                <span className="badge-gold">Boutique certifiée</span>
              </div>
              {group.items.map((item) => (
                <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 20px', borderBottom: '1px solid var(--border)' }}>
                  <img src={item.image} alt={item.name} style={{ width: 56, height: 56, objectFit: 'cover', borderRadius: 12 }} />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.name}</p>
                    <p style={{ color: 'var(--accent)', fontWeight: 700, fontSize: '0.88rem' }}>{formatPrice(item.price)}</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} style={{ width: 28, height: 28, borderRadius: 999, border: '1px solid var(--border)', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Minus size={12} /></button>
                    <span style={{ fontWeight: 700, minWidth: 20, textAlign: 'center' }}>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} style={{ width: 28, height: 28, borderRadius: 999, border: '1px solid var(--border)', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Plus size={12} /></button>
                  </div>
                  <p style={{ fontWeight: 700, minWidth: 80, textAlign: 'right' }}>{formatPrice(item.price * item.quantity)}</p>
                  <button onClick={() => removeItem(item.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)' }}><Trash2 size={15} /></button>
                </div>
              ))}
              <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 700 }}>Sous-total : {formatPrice(total)}</span>
                <a href={wa} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ fontSize: '0.88rem', padding: '10px 18px' }}>
                  <MessageCircle size={14} />
                  Valider avec {group.vendor.name}
                </a>
              </div>
            </motion.div>
          );
        })}
      </div>
    </PageWrapper>
  );
}
