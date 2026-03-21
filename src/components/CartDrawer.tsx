import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

export function CartDrawer() {
  const { isCartOpen, setIsCartOpen } = useCart();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black z-50"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
          >
            <div className="p-6 border-b border-stone-200 flex items-center justify-between">
              <h2 className="text-xl font-serif font-bold text-stone-900 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" /> Tu Carrito
              </h2>
              <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-stone-100 rounded-full transition-colors">
                <X className="w-5 h-5 text-stone-500" />
              </button>
            </div>
            <div className="flex-1 p-6 flex flex-col items-center justify-center text-stone-500 space-y-4">
              <ShoppingBag className="w-16 h-16 text-stone-300" />
              <p>Tu carrito está vacío</p>
            </div>
            <div className="p-6 border-t border-stone-200 bg-stone-50">
              <button onClick={() => setIsCartOpen(false)} className="w-full bg-amber-600 hover:bg-amber-700 text-white py-4 rounded-xl font-semibold transition-colors">
                Continuar Comprando
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
