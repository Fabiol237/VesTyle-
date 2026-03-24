import { motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { PageWrapper } from '../components/PageWrapper';
import { supabase } from '../lib/supabaseClient';
import { Store, Package, User } from 'lucide-react';

const ROLES = [
  { id: 'client', label: 'Client', icon: <User size={20} />, desc: 'Découvrir et acheter' },
  { id: 'vendor', label: 'Vendeur', icon: <Store size={20} />, desc: 'Ouvrir ma boutique' },
  { id: 'courier', label: 'Livreur', icon: <Package size={20} />, desc: 'Faire des courses' },
];

export default function AuthPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [mode, setMode] = useState('login');
  const [role, setRole] = useState(params.get('role') || 'client');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({ email, password, options: { data: { role } } });
        if (error) throw error;
      }
      navigate(role === 'vendor' ? '/dashboard' : role === 'courier' ? '/livreur' : -1);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper variant="slideUp">
      <div style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="surface"
          style={{ width: '100%', maxWidth: 440, padding: '40px' }}
        >
          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <p style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--accent)', letterSpacing: '-0.04em' }}>VesTyle+++</p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: 4 }}>
              {mode === 'login' ? 'Bon retour parmi nous' : 'Rejoignez la plateforme'}
            </p>
          </div>

          {/* Sélecteur de rôle (inscription uniquement) */}
          {mode === 'register' && (
            <div style={{ marginBottom: 24 }}>
              <p className="label" style={{ marginBottom: 10 }}>Je suis...</p>
              <div style={{ display: 'flex', gap: 8 }}>
                {ROLES.map((r) => (
                  <button key={r.id} onClick={() => setRole(r.id)}
                    style={{ flex: 1, padding: '12px 8px', borderRadius: 12, border: `1px solid ${role === r.id ? 'var(--accent)' : 'var(--border)'}`, background: role === r.id ? 'var(--accent-light)' : 'var(--bg-surface)', cursor: 'pointer', textAlign: 'center' }}>
                    <div style={{ color: role === r.id ? 'var(--accent)' : 'var(--text-muted)', marginBottom: 4, display: 'flex', justifyContent: 'center' }}>{r.icon}</div>
                    <p style={{ fontWeight: 600, fontSize: '0.78rem', color: role === r.id ? 'var(--accent)' : 'var(--text-primary)' }}>{r.label}</p>
                    <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{r.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <p className="label" style={{ marginBottom: 6 }}>Email</p>
              <input className="input-field" type="email" placeholder="votre@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
              <p className="label" style={{ marginBottom: 6 }}>Mot de passe</p>
              <input className="input-field" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            {error && <p style={{ fontSize: '0.8rem', color: 'var(--danger)', padding: '8px 12px', background: 'rgba(220,38,38,0.08)', borderRadius: 8 }}>{error}</p>}
            <button className="btn-primary" type="submit" disabled={loading} style={{ marginTop: 8 }}>
              {loading ? 'Chargement...' : mode === 'login' ? 'Se connecter' : 'Créer mon compte'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 20, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            {mode === 'login' ? "Pas encore de compte ? " : "Déjà un compte ? "}
            <button onClick={() => setMode(mode === 'login' ? 'register' : 'login')} style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontWeight: 600 }}>
              {mode === 'login' ? "S'inscrire" : "Se connecter"}
            </button>
          </p>
        </motion.div>
      </div>
    </PageWrapper>
  );
}
