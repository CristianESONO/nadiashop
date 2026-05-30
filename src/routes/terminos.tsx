import { createFileRoute } from '@tanstack/react-router'
import { Scale, BookOpen, Gavel, AlertTriangle } from 'lucide-react'

export const Route = createFileRoute('/terminos')({
  component: Terminos,
})

function Terminos() {
  return (
    <div className="page-wrap px-4 py-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-serif text-5xl font-bold text-[var(--text-main)] mb-12 text-center">Términos y Condiciones</h1>
        
        <div className="prose prose-slate max-w-none space-y-12 text-[var(--text-soft)] leading-relaxed">
          <section className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
            <div className="flex items-center gap-4 mb-6">
              <Scale className="text-[var(--accent)]" size={32} />
              <h2 className="font-serif text-2xl font-bold m-0 text-[var(--text-main)]">Acuerdo Legal</h2>
            </div>
            <p>
              Al utilizar este sitio web, aceptas cumplir con nuestros términos y condiciones. Estos términos rigen la venta de productos y el uso de nuestra plataforma digital.
            </p>
          </section>

          <div className="space-y-8">
            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-[var(--cream)] rounded-full flex items-center justify-center text-[var(--accent)]">
                <BookOpen size={24} />
              </div>
              <div className="space-y-2">
                <h3 className="font-bold text-[var(--text-main)] m-0">Propiedad Intelectual</h3>
                <p className="text-sm">Todo el contenido de Nadia's Shop, incluyendo diseños, fotografías y logotipos, está protegido por derechos de autor y no puede ser reproducido sin permiso.</p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-[var(--cream)] rounded-full flex items-center justify-center text-[var(--accent)]">
                <Gavel size={24} />
              </div>
              <div className="space-y-2">
                <h3 className="font-bold text-[var(--text-main)] m-0">Condiciones de Venta</h3>
                <p className="text-sm">Los precios están sujetos a cambios. Nos reservamos el derecho de cancelar pedidos en caso de error tipográfico o falta de stock imprevista.</p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-[var(--cream)] rounded-full flex items-center justify-center text-[var(--accent)]">
                <AlertTriangle size={24} />
              </div>
              <div className="space-y-2">
                <h3 className="font-bold text-[var(--text-main)] m-0">Limitación de Responsabilidad</h3>
                <p className="text-sm">Nadia's Shop no será responsable de daños indirectos derivados del uso de sus productos, más allá del valor del artículo comprado.</p>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-[var(--line)] text-xs text-gray-400 text-center">
            Última actualización: 1 de Junio de 2026
          </div>
        </div>
      </div>
    </div>
  )
}
