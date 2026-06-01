import { Link } from '@tanstack/react-router'
import { useSettings } from '../context/SettingsContext'

export default function Footer() {
  const year = new Date().getFullYear()
  const { settings } = useSettings()

  return (
    <footer className="mt-20 border-t border-[var(--line)] bg-[var(--cream)] px-4 pb-20 pt-16 text-[var(--text-soft)]">
      <div className="page-wrap flex flex-col md:flex-row justify-between gap-12">
        <div className="flex flex-col gap-4 max-w-sm">
          <h3 className="font-serif text-xl font-bold text-[var(--text-main)]">{settings.storeName}</h3>
          <p className="text-sm leading-relaxed">
            Ropa premium para los más pequeños de la casa. Diseños pensados para la comodidad y el estilo.
          </p>
          <p className="text-sm mt-2">Contacto: <a className="font-medium" href={`mailto:${settings.email}`}>{settings.email}</a></p>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-main)]">Comprar</h4>
            <Link to="/catalogo" search={{ category: 'Novedades' }} className="text-sm hover:text-[var(--accent)] transition-colors no-underline">Novedades</Link>
            <Link to="/catalogo" search={{ category: 'Recién Nacido' }} className="text-sm hover:text-[var(--accent)] transition-colors no-underline">Recién nacido</Link>
            <Link to="/catalogo" search={{ category: 'Bebé Niña' }} className="text-sm hover:text-[var(--accent)] transition-colors no-underline">Bebé niña</Link>
            <Link to="/catalogo" search={{ category: 'Bebé Niño' }} className="text-sm hover:text-[var(--accent)] transition-colors no-underline">Bebé niño</Link>
          </div>
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-main)]">Ayuda</h4>
            <Link to="/contacto" className="text-sm hover:text-[var(--accent)] transition-colors no-underline">Contacto</Link>
            <Link to="/envios" className="text-sm hover:text-[var(--accent)] transition-colors no-underline">Envíos</Link>
            <Link to="/devoluciones" className="text-sm hover:text-[var(--accent)] transition-colors no-underline">Devoluciones</Link>
          </div>
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-main)]">Legal</h4>
            <Link to="/privacidad" className="text-sm hover:text-[var(--accent)] transition-colors no-underline">Privacidad</Link>
            <Link to="/terminos" className="text-sm hover:text-[var(--accent)] transition-colors no-underline">Términos</Link>
          </div>
        </div>
      </div>

      <div className="page-wrap mt-16 pt-8 border-t border-[var(--line)] flex flex-col items-center justify-between gap-4 md:flex-row">
        <p className="text-xs">
          &copy; {year} {settings.storeName}. Todos los derechos reservados.
        </p>
        <p className="text-[10px] text-[var(--text-soft)] opacity-60">
          Desarrollado por <span className="font-bold">Ruslan Cristian ESONO MAYE</span>
        </p>
        <p className="text-xs font-medium tracking-widest uppercase">Premium Baby Shop</p>
      </div>
    </footer>
  )
}
