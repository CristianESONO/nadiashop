import { createFileRoute } from '@tanstack/react-router'
import { Mail, Phone, MapPin, Send } from 'lucide-react'

export const Route = createFileRoute('/contacto')({
  component: Contacto,
})

function Contacto() {
  return (
    <div className="page-wrap px-4 py-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="font-serif text-5xl font-bold text-[var(--text-main)] mb-4">Contacto</h1>
          <p className="text-[var(--text-soft)] text-lg">Estamos aquí para ayudarte. No dudes en contactarnos.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <div className="space-y-10">
            <div>
              <h3 className="font-serif text-2xl font-bold mb-6">Información de Contacto</h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-[var(--cream)] rounded-xl text-[var(--accent)]">
                    <Mail size={24} />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Email</p>
                    <p className="text-[var(--text-main)] font-medium">hola@nadiashop.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-[var(--cream)] rounded-xl text-[var(--accent)]">
                    <Phone size={24} />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Teléfono</p>
                    <p className="text-[var(--text-main)] font-medium">+240 123 456 789</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-[var(--cream)] rounded-xl text-[var(--accent)]">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Dirección</p>
                    <p className="text-[var(--text-main)] font-medium">Calle Principal s/n, Malabo<br />Guinea Ecuatorial</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 bg-[var(--text-main)] text-white rounded-3xl shadow-xl relative overflow-hidden">
              <div className="relative z-10">
                <h4 className="font-serif text-2xl font-bold mb-4">Horario de Atención</h4>
                <div className="space-y-2 text-white/80 text-sm">
                  <p className="flex justify-between"><span>Lunes - Viernes</span> <span>09:00 - 19:00</span></p>
                  <p className="flex justify-between"><span>Sábados</span> <span>10:00 - 14:00</span></p>
                  <p className="flex justify-between"><span>Domingos</span> <span>Cerrado</span></p>
                </div>
              </div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl text-white" />
            </div>
          </div>

          <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); alert('Mensaje enviado (Simulación)'); }}>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Nombre</label>
                <input required type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Email</label>
                <input required type="email" className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Asunto</label>
              <input required type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Mensaje</label>
              <textarea required rows={5} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all resize-none" />
            </div>
            <button className="w-full bg-[var(--text-main)] text-white py-4 rounded-full font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all">
              <Send size={18} /> Enviar Mensaje
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
