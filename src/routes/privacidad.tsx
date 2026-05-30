import { createFileRoute } from '@tanstack/react-router'
import { Shield, Eye, Lock, FileText } from 'lucide-react'

export const Route = createFileRoute('/privacidad')({
  component: Privacidad,
})

function Privacidad() {
  return (
    <div className="page-wrap px-4 py-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-serif text-5xl font-bold text-[var(--text-main)] mb-12 text-center">Política de Privacidad</h1>
        
        <div className="prose prose-slate max-w-none space-y-12 text-[var(--text-soft)] leading-relaxed">
          <section className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
            <div className="flex items-center gap-4 mb-6">
              <Shield className="text-[var(--accent)]" size={32} />
              <h2 className="font-serif text-2xl font-bold m-0 text-[var(--text-main)]">Tu Privacidad importa</h2>
            </div>
            <p>
              En Nadia's Shop nos tomamos muy en serio la seguridad de tus datos. Esta política describe cómo recopilamos, usamos y protegemos tu información personal cuando visitas nuestro sitio.
            </p>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-[var(--text-main)]">
                <Eye size={20} />
                <h3 className="font-bold m-0 text-sm uppercase tracking-widest">Qué recopilamos</h3>
              </div>
              <p className="text-sm">
                Información de contacto (nombre, email, teléfono) y datos de envío para procesar tus pedidos de forma eficiente.
              </p>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-[var(--text-main)]">
                <Lock size={20} />
                <h3 className="font-bold m-0 text-sm uppercase tracking-widest">Cómo lo protegemos</h3>
              </div>
              <p className="text-sm">
                Utilizamos cifrado SSL y pasarelas de pago seguras para garantizar que tus datos financieros nunca queden expuestos.
              </p>
            </div>
          </div>

          <section className="space-y-6">
            <div className="flex items-center gap-4">
              <FileText className="text-[var(--accent)]" size={28} />
              <h2 className="font-serif text-2xl font-bold text-[var(--text-main)]">Tus Derechos</h2>
            </div>
            <p>
              Tienes derecho a acceder, rectificar o eliminar tus datos personales en cualquier momento. Solo tienes que enviarnos un correo a **privacidad@nadiashop.com** y procesaremos tu solicitud de inmediato.
            </p>
            <p>
              No vendemos ni compartimos tus datos con terceros con fines publicitarios. Solo compartimos la información estrictamente necesaria con nuestros socios logísticos para la entrega de tus productos.
            </p>
          </section>

          <div className="pt-8 border-t border-[var(--line)] text-xs text-gray-400 text-center">
            Última actualización: 1 de Junio de 2026
          </div>
        </div>
      </div>
    </div>
  )
}
