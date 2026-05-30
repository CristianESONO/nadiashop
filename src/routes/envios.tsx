import { createFileRoute } from '@tanstack/react-router'
import { Truck, MapPin, Clock, ShieldCheck } from 'lucide-react'

export const Route = createFileRoute('/envios')({
  component: Envios,
})

function Envios() {
  return (
    <div className="page-wrap px-4 py-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-serif text-5xl font-bold text-[var(--text-main)] mb-12 text-center">Política de Envíos</h1>
        
        <div className="prose prose-slate max-w-none space-y-12">
          <section className="bg-[var(--cream)] p-8 rounded-3xl border border-[var(--line)]">
            <div className="flex items-center gap-4 mb-6">
              <Truck className="text-[var(--accent)]" size={32} />
              <h2 className="font-serif text-2xl font-bold m-0 text-[var(--text-main)]">Tiempos y Costes</h2>
            </div>
            <div className="space-y-4 text-[var(--text-soft)]">
              <p>Envío estándar a todo el país: **2.900 FCFA**.</p>
              <p>Envío **GRATUITO** en pedidos superiores a **9.500 FCFA**.</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>**Malabo:** 24 - 48 horas laborables.</li>
                <li>**Bata:** 48 - 72 horas laborables.</li>
                <li>**Resto del país:** 3 a 5 días laborables.</li>
              </ul>
            </div>
          </section>

          <section className="space-y-6">
            <div className="flex items-center gap-4">
              <Clock className="text-[var(--accent)]" size={28} />
              <h2 className="font-serif text-2xl font-bold text-[var(--text-main)]">Procesamiento de Pedidos</h2>
            </div>
            <p className="text-[var(--text-soft)] leading-relaxed">
              Todos los pedidos realizados antes de las 14:00h se procesan y envían el mismo día laborable. Los pedidos realizados después de esa hora o durante el fin de semana se procesarán el siguiente día hábil.
            </p>
          </section>

          <section className="space-y-6">
            <div className="flex items-center gap-4">
              <MapPin className="text-[var(--accent)]" size={28} />
              <h2 className="font-serif text-2xl font-bold text-[var(--text-main)]">Seguimiento</h2>
            </div>
            <p className="text-[var(--text-soft)] leading-relaxed">
              Una vez que tu pedido haya sido enviado, recibirás un correo electrónico de confirmación con un número de seguimiento para que puedas localizar tu paquete en todo momento.
            </p>
          </section>

          <section className="bg-[var(--text-main)] text-white p-8 rounded-3xl shadow-lg">
            <div className="flex items-center gap-4 mb-4">
              <ShieldCheck size={28} />
              <h3 className="font-serif text-xl font-bold">Embalaje Seguro</h3>
            </div>
            <p className="text-white/70 text-sm leading-relaxed">
              Cuidamos cada detalle. Tus productos se envían en cajas de materiales reciclados y protegidos para asegurar que lleguen en perfectas condiciones a tus manos.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
