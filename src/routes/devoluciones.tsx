import { createFileRoute } from '@tanstack/react-router'
import { RefreshCcw, HelpCircle, AlertCircle, CheckCircle2 } from 'lucide-react'

export const Route = createFileRoute('/devoluciones')({
  component: Devoluciones,
})

function Devoluciones() {
  return (
    <div className="page-wrap px-4 py-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-serif text-5xl font-bold text-[var(--text-main)] mb-12 text-center">Devoluciones</h1>
        
        <div className="prose prose-slate max-w-none space-y-12">
          <section className="bg-[var(--cream)] p-8 rounded-3xl border border-[var(--line)]">
            <div className="flex items-center gap-4 mb-6">
              <RefreshCcw className="text-[var(--accent)]" size={32} />
              <h2 className="font-serif text-2xl font-bold m-0 text-[var(--text-main)]">Garantía de Satisfacción</h2>
            </div>
            <p className="text-[var(--text-soft)]">
              En Nadia's Shop queremos que estés totalmente satisfecho con tu compra. Si por alguna razón no es así, dispones de **30 días naturales** desde la recepción del pedido para realizar una devolución.
            </p>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 border border-gray-100 rounded-2xl space-y-4">
              <div className="flex items-center gap-3 text-green-600">
                <CheckCircle2 size={24} />
                <h3 className="font-bold">Aceptamos</h3>
              </div>
              <ul className="text-sm text-[var(--text-soft)] space-y-2 list-none p-0">
                <li>✓ Productos sin usar</li>
                <li>✓ Etiquetas originales</li>
                <li>✓ Embalaje original</li>
              </ul>
            </div>
            <div className="p-6 border border-gray-100 rounded-2xl space-y-4">
              <div className="flex items-center gap-3 text-red-500">
                <AlertCircle size={24} />
                <h3 className="font-bold">No Aceptamos</h3>
              </div>
              <ul className="text-sm text-[var(--text-soft)] space-y-2 list-none p-0">
                <li>✗ Ropa usada o lavada</li>
                <li>✗ Artículos sin etiquetas</li>
                <li>✗ Higiene personal (si aplica)</li>
              </ul>
            </div>
          </div>

          <section className="space-y-6">
            <h2 className="font-serif text-2xl font-bold text-[var(--text-main)]">Cómo realizar una devolución</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-[var(--text-main)] text-white flex items-center justify-center font-bold text-sm">1</div>
                <p className="text-[var(--text-soft)]">Escríbenos a **devoluciones@nadiashop.com** con tu número de pedido.</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-[var(--text-main)] text-white flex items-center justify-center font-bold text-sm">2</div>
                <p className="text-[var(--text-soft)]">Te enviaremos una etiqueta de devolución prepagada.</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-[var(--text-main)] text-white flex items-center justify-center font-bold text-sm">3</div>
                <p className="text-[var(--text-soft)]">Prepara el paquete y entrégalo en el punto de recogida seleccionado.</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-[var(--text-main)] text-white flex items-center justify-center font-bold text-sm">4</div>
                <p className="text-[var(--text-soft)]">Recibirás el reembolso en un plazo de 5-10 días tras recibir el producto.</p>
              </div>
            </div>
          </section>

          <section className="bg-gray-50 p-6 rounded-2xl flex items-center gap-4">
            <HelpCircle className="text-gray-400" size={24} />
            <p className="text-sm text-gray-500">¿Tienes dudas? Consulta nuestra guía completa o contacta con atención al cliente.</p>
          </section>
        </div>
      </div>
    </div>
  )
}
