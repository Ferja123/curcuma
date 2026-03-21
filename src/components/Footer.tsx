import { Leaf } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-400 py-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2">
          <Leaf className="w-6 h-6 text-amber-500" />
          <span className="font-serif text-xl font-bold text-white">NaturaVita</span>
        </div>
        <p className="text-sm text-center md:text-left">
          © 2026 NaturaVita. Todos los derechos reservados.
        </p>
        <div className="flex gap-6 text-sm">
          <a href="#" className="hover:text-amber-500 transition-colors">Privacidad</a>
          <a href="#" className="hover:text-amber-500 transition-colors">Términos</a>
          <a href="#" className="hover:text-amber-500 transition-colors">Contacto</a>
        </div>
      </div>
    </footer>
  );
}
