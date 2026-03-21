export default function OrderForm() {
  return (
    <section className="py-20 bg-amber-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-amber-100">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-serif font-bold text-stone-900 mb-4">Finaliza tu Pedido</h2>
            <p className="text-stone-600">Completa tus datos para recibir tu Cúrcuma Premium en casa.</p>
          </div>
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">Nombre Completo</label>
                <input type="text" className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all" placeholder="Juan Pérez" />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">Teléfono</label>
                <input type="tel" className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all" placeholder="+1 234 567 890" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">Dirección de Envío</label>
              <input type="text" className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all" placeholder="Calle Principal 123, Ciudad" />
            </div>
            <button type="submit" className="w-full bg-amber-600 hover:bg-amber-700 text-white py-4 rounded-xl font-bold text-lg transition-colors shadow-lg shadow-amber-600/20 mt-8">
              Confirmar Pedido - Pago Contra Entrega
            </button>
            <p className="text-center text-sm text-stone-500 mt-4">Tus datos están protegidos y encriptados de forma segura.</p>
          </form>
        </div>
      </div>
    </section>
  );
}
