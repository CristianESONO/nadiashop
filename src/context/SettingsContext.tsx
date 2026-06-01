import { createContext, useContext, useState, type ReactNode } from 'react'

export type Currency = 'XAF' | 'EUR' | 'USD'
export type Language = 'es' | 'fr' | 'en'

export interface StoreSettings {
  storeName: string
  email: string
  currency: Currency
  language: Language
  notifications: {
    newOrders: boolean
    newClients: boolean
    lowStock: boolean
    weeklySummary: boolean
  }
  adminEmail: string
}

const DEFAULT_SETTINGS: StoreSettings = {
  storeName: "Nadia's Shop",
  email: 'contact@nadiashop.com',
  currency: 'XAF',
  language: 'es',
  notifications: {
    newOrders: true,
    newClients: true,
    lowStock: false,
    weeklySummary: true,
  },
  adminEmail: 'admin@nadiashop.com',
}

const STORAGE_KEY = 'nadia_store_settings'

interface SettingsContextType {
  settings: StoreSettings
  updateSettings: (s: Partial<StoreSettings>) => void
  formatPrice: (amount: number) => string
  t: (key: string) => string
  convertAmount: (amount: number, from?: string, to?: string) => number
}

const SettingsContext = createContext<SettingsContextType>({
  settings: DEFAULT_SETTINGS,
  updateSettings: () => {},
  formatPrice: (n) => n.toString(),
  t: (k) => k,
  convertAmount: (amount: number) => amount,
})

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<StoreSettings>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) }
    } catch {}
    return DEFAULT_SETTINGS
  })

  const updateSettings = (partial: Partial<StoreSettings>) => {
    setSettings(prev => {
      const next = { ...prev, ...partial }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }

  const formatPrice = (amount: number) => {
    // Choose a sensible locale based on currency and selected language
    let locale = 'en-US'
    if (settings.currency === 'XAF') {
      // XAF is used in some francophone African countries; default to French (Cameroon)
      locale = settings.language === 'fr' ? 'fr-CM' : settings.language === 'es' ? 'fr-CM' : 'fr-CM'
    } else if (settings.currency === 'EUR') {
      locale = settings.language === 'es' ? 'es-ES' : settings.language === 'fr' ? 'fr-FR' : 'en-GB'
    } else if (settings.currency === 'USD') {
      locale = settings.language === 'es' ? 'es-US' : settings.language === 'fr' ? 'fr-FR' : 'en-US'
    }

    // Convert amount from assumed base (XAF) into selected currency
    const converted = convertAmount(amount, 'XAF', settings.currency)

    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: settings.currency,
      minimumFractionDigits: settings.currency === 'XAF' ? 0 : 2,
      maximumFractionDigits: settings.currency === 'XAF' ? 0 : 2,
    }).format(converted)
  }

  // Simple fixed exchange rates relative to XAF as base (these are example rates)
  const EXCHANGE_RATES: Record<string, number> = {
    // 1 XAF in XAF
    XAF: 1,
    // 1 XAF to EUR (example)
    EUR: 0.0015,
    // 1 XAF to USD (example)
    USD: 0.0016,
  }

  const convertAmount = (amount: number, from: string = 'XAF', to: string = settings.currency) => {
    if (from === to) return amount
    // Convert 'amount' which is assumed to be in 'from' currency to 'to' currency
    // We'll normalize via XAF as pivot: amount_in_xaf = amount / rate[from]
    const rateFrom = EXCHANGE_RATES[from] ?? 1
    const rateTo = EXCHANGE_RATES[to] ?? 1
    const amountInXaf = amount / rateFrom
    const converted = amountInXaf * rateTo
    return converted
  }

  // Minimal translation helper. Adds a lightweight i18n surface that can be expanded.
  const translations: Record<string, Record<string, string>> = {
    es: {
      save: 'Guardar cambios',
      saved: 'Guardado',
      configuration: 'Configuración',
      notifications: 'Notificaciones',
      contact_email_label: 'Email de contacto',
      currency_label: 'Moneda',
    },
    fr: {
      save: 'Enregistrer',
      saved: 'Enregistré',
      configuration: 'Configuration',
      notifications: 'Notifications',
      contact_email_label: "E-mail de contact",
      currency_label: 'Devise',
    },
    en: {
      save: 'Save changes',
      saved: 'Saved',
      configuration: 'Settings',
      notifications: 'Notifications',
      contact_email_label: 'Contact email',
      currency_label: 'Currency',
    },
  }

  const t = (key: string) => translations[settings.language]?.[key] ?? translations['en'][key] ?? key

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, formatPrice, t, convertAmount }}>
      {children}
    </SettingsContext.Provider>
  )
}

export const useSettings = () => useContext(SettingsContext)
