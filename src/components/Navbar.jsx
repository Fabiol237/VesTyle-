import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, Store, MapPin, Moon, Sun, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useCartStore } from '../store/useCartStore';

export default function Navbar() {
  const { getTotalItems, selectedCity } = useCartStore();
  const totalItems = getTotalItems();
  const location = useLocation();
  const [dark, setDark] = useState(document.documentElement.classList.contains('dark'));
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleDark = () => {
    document.documentElement.classList.toggle('dark');
    setDark(!dark);
  };

  return (
    <header className="navbar" style={{ zIndex: 900 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', maxWidth: 1200, margin: '0 auto' }}>
        {/* Logo */}
        <Link to={selectedCity ? `/ville/${selectedCity.id}` : '/'} style={{ textDecoration: 'none' }}>
          <motion.div whileHover={{ scale: 1.02 }} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--accent)', letterSpacing: '-0.04em' }}>
              VesTyle
            </span>
            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.1em', marginTop: 4 }}>
              +++
            </span>
          </motion.div>
        </Link>

        {/* City indicator */}
        {selectedCity && (
          <Link to="/" style={{ textDecoration: 'none' }}>
            <motion.div
              whileHover={{ scale: 1.03 }}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '6px 14px', borderRadius: 999,
                background: 'var(--accent-light)', border: '1px solid var(--border)',
              }}
            >
              <MapPin size={12} color='var(--accent)' />
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--accent)' }}>
                {selectedCity.name}
              </span>
            </motion.div>
          </Link>
        )}

        {/* Nav desktop */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Devenir Vendeur */}
          <motion.div whileHover={{ scale: 1.02 }}>
            <Link to="/auth?role=vendor" className="btn-outline" style={{ fontSize: '0.82rem', padding: '8px 16px' }}>
              <Store size={14} />
              Devenir Vendeur
            </Link>
          </motion.div>

          {/* Dark Toggle */}
          <button onClick={toggleDark} style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 999, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-secondary)' }}>
            {dark ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {/* Cart */}
          <Link to="/panier">
            <motion.button whileHover={{ scale: 1.05 }} style={{ position: 'relative', background: 'none', border: '1px solid var(--border)', borderRadius: 999, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-primary)' }}>
              <ShoppingBag size={16} />
              {totalItems > 0 && (
                <motion.span
                  key={totalItems}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  style={{
                    position: 'absolute', top: -4, right: -4,
                    background: 'var(--accent)', color: '#fff',
                    borderRadius: 999, width: 18, height: 18,
                    fontSize: '0.65rem', fontWeight: 700,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  {totalItems}
                </motion.span>
              )}
            </motion.button>
          </Link>
        </div>
      </div>
    </header>
  );
}
