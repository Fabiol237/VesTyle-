import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';

export default function CartFab() {
  const total = useCartStore((s) => s.getTotalItems());

  return (
    <AnimatePresence>
      {total > 0 && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          style={{ position: 'fixed', bottom: 28, right: 24, zIndex: 1000 }}
        >
          <Link to="/panier">
            <button className="cart-fab">
              <ShoppingBag size={22} />
              <motion.span
                key={total}
                initial={{ scale: 1.6 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300 }}
                style={{
                  position: 'absolute', top: -6, right: -6,
                  background: '#fff', color: 'var(--accent)',
                  borderRadius: 999, width: 22, height: 22,
                  fontSize: '0.7rem', fontWeight: 800,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: '2px solid var(--accent)',
                }}
              >
                {total}
              </motion.span>
            </button>
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
