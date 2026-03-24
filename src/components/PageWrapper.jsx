import { motion } from 'framer-motion';

// Transitions différentes pour chaque type de page
export const pageVariants = {
  // Page 1 → Page 2 : Zoom immersif
  zoom: {
    initial: { opacity: 0, scale: 0.96 },
    animate: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
    exit:    { opacity: 0, scale: 1.04, transition: { duration: 0.3, ease: 'easeIn' } },
  },
  // Marketplace → Produit : Slide depuis le bas
  slideUp: {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
    exit:    { opacity: 0, y: -20, transition: { duration: 0.25, ease: 'easeIn' } },
  },
  // Panier : Glissement latéral avec rebond
  slideRight: {
    initial: { opacity: 0, x: 60 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.4, ease: [0.34, 1.56, 0.64, 1] } },
    exit:    { opacity: 0, x: 60, transition: { duration: 0.25, ease: 'easeIn' } },
  },
  // Dashboard : Fondu doux
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.5 } },
    exit:    { opacity: 0, transition: { duration: 0.25 } },
  },
  // Boutique Vendeur : Zoom + slide
  zoomSlide: {
    initial: { opacity: 0, scale: 0.95, y: 20 },
    animate: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
    exit:    { opacity: 0, scale: 1.02, transition: { duration: 0.3 } },
  },
};

export function PageWrapper({ children, variant = 'slideUp' }) {
  const v = pageVariants[variant];
  return (
    <motion.div
      initial={v.initial}
      animate={v.animate}
      exit={v.exit}
      style={{ width: '100%', minHeight: '100dvh' }}
    >
      {children}
    </motion.div>
  );
}
