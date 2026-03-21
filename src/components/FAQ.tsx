import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: "¿Cómo debo tomar el suplemento de cúrcuma?",
    answer: "Recomendamos tomar 2 cápsulas al día, preferiblemente junto con las comidas principales (por ejemplo, una en el desayuno y otra en el almuerzo) para maximizar su absorción y evitar cualquier molestia estomacal."
  },
  {
    question: "¿Tiene efectos secundarios o contraindicaciones?",
    answer: "Nuestro suplemento es 100% natural y seguro para la mayoría de las personas. Sin embargo, si estás embarazada, en periodo de lactancia, o tomas medicamentos anticoagulantes, te sugerimos consultar con tu médico antes de consumirlo."
  },
  {
    question: "¿En cuánto tiempo empezaré a notar los resultados?",
    answer: "Cada cuerpo es diferente, pero la mayoría de nuestros clientes reportan una disminución notable en el dolor articular y la inflamación durante las primeras 1 a 2 semanas de uso continuo."
  },
  {
    question: "¿Cómo funciona el envío y el pago contraentrega?",
    answer: "¡Es muy fácil y 100% seguro! Realizas tu pedido llenando el formulario sin pagar nada por adelantado. Te enviamos el producto a tu domicilio y pagas en efectivo o transferencia únicamente cuando lo tienes en tus manos. El envío es totalmente gratis."
  },
  {
    question: "¿Por qué esta cúrcuma es diferente a la que compro en el mercado?",
    answer: "La cúrcuma de cocina tradicional tiene solo un 3% de curcumina (el ingrediente activo que desinflama). Nuestro extracto está estandarizado al 95% de pureza y combinado con extracto de pimienta negra (Bioperina), lo que aumenta su absorción en tu cuerpo hasta en un 2000%."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-20 bg-white border-t border-amber-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4 tracking-tight">
            Preguntas Frecuentes
          </h2>
          <p className="text-gray-600 text-lg font-medium">
            Resolvemos todas tus dudas para que compres con total confianza.
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              key={index} 
              className={`border rounded-2xl transition-all duration-300 ${openIndex === index ? 'border-amber-400 bg-amber-50/30 shadow-md' : 'border-gray-200 bg-white hover:border-amber-200'}`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
              >
                <span className="font-bold text-slate-900 text-lg pr-4">{faq.question}</span>
                <ChevronDown className={`w-6 h-6 text-amber-500 transition-transform duration-300 flex-shrink-0 ${openIndex === index ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="p-6 pt-0 text-gray-600 leading-relaxed font-medium">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
