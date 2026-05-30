import { useState } from 'react'
import { supabase } from '../supabase'

export default function Register() {
  
  // Formular-Felder
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  
  // success: true wenn Registrierung geklappt hat
  // zeigt dann eine Bestätigungsseite statt dem Formular
  const [success, setSuccess] = useState(false)
  
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  async function handleRegister(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Supabase erstellt einen neuen Nutzer
    // Schickt automatisch eine Bestätigungs-E-Mail
    const { error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      setError('Registrierung fehlgeschlagen. Bitte versuche es nochmals.')
    } else {
      // Kein Fehler — Bestätigungsseite anzeigen
      setSuccess(true)
    }
    setLoading(false)
  }

  // Wenn Registrierung erfolgreich: andere Ansicht zeigen
  // statt dem Formular sieht der Nutzer eine Bestätigungsmeldung
  if (success) {
    return (
      <div className="max-w-md mx-auto mt-16 p-8 bg-white rounded-xl shadow text-center">
        <span className="text-5xl">🌱</span>
        <h2 className="text-2xl font-bold text-green-700 mt-4">
          Fast geschafft!
        </h2>
        <p className="text-gray-600 mt-2">
          Wir haben dir eine Bestätigungs-E-Mail geschickt. 
          Bitte bestätige deine Adresse um dich einzuloggen.
        </p>
        <a
          href="/login"
          className="inline-block mt-6 bg-green-700 text-white px-6 py-2 rounded-lg hover:bg-green-800 transition-colors"
        >
          Zum Login
        </a>
      </div>
    )
  }

  // Standard-Ansicht: Registrierungsformular
  return (
    <div className="max-w-md mx-auto mt-16 p-8 bg-white rounded-xl shadow">
      <h2 className="text-2xl font-bold text-green-700 mb-6">
        Konto erstellen
      </h2>

      {/* Fehlermeldung — nur sichtbar wenn error nicht null */}
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleRegister} className="flex flex-col gap-4">
        
        {/* E-Mail Feld */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            E-Mail
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Passwort Feld — minimum 6 Zeichen (Supabase Anforderung) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Passwort
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6} // Supabase verlangt mindestens 6 Zeichen
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <p className="text-xs text-gray-400 mt-1">Mindestens 6 Zeichen</p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-green-700 text-white py-2 rounded-lg font-medium hover:bg-green-800 transition-colors disabled:opacity-50"
        >
          {loading ? 'Wird registriert...' : 'Registrieren'}
        </button>
      </form>

      {/* Link zum Login falls Nutzer bereits ein Konto hat */}
      <p className="mt-4 text-sm text-gray-600 text-center">
        Bereits ein Konto?{' '}
        <a href="/login" className="text-green-700 font-medium hover:underline">
          Einloggen
        </a>
      </p>
    </div>
  )
}