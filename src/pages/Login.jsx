// useState: speichert die Eingaben des Formulars
import { useState } from 'react'

// Importiert unsere Supabase-Verbindung für den Login
import { supabase } from '../supabase'

export default function Login() {
  
  // Speichert was der Nutzer ins E-Mail Feld tippt
  const [email, setEmail] = useState('')
  
  // Speichert was der Nutzer ins Passwort Feld tippt
  const [password, setPassword] = useState('')
  
  // Fehlermeldung falls Login fehlschlägt (null = kein Fehler)
  const [error, setError] = useState(null)
  
  // true während der Login-Request läuft — deaktiviert den Button
  const [loading, setLoading] = useState(false)

  // Wird aufgerufen wenn der Nutzer auf "Einloggen" klickt
  async function handleLogin(e) {
    
    // Verhindert dass die Seite neu lädt (Standard-Verhalten von Formularen)
    e.preventDefault()
    
    setLoading(true)
    setError(null) // Vorherige Fehlermeldung löschen

    // Supabase prüft E-Mail und Passwort in der Datenbank
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      // Login fehlgeschlagen — zeigt Fehlermeldung an
      setError('Login fehlgeschlagen. Bitte prüfe E-Mail und Passwort.')
    } else {
      // Login erfolgreich — weiterleiten zur Startseite
      window.location.href = '/'
    }
    setLoading(false)
  }

  return (
    // Zentrierte Karte in der Mitte der Seite
    <div className="max-w-md mx-auto mt-16 p-8 bg-white rounded-xl shadow">
      <h2 className="text-2xl font-bold text-green-700 mb-6">Einloggen</h2>

      {/* Fehlermeldung — wird nur angezeigt wenn error nicht null ist */}
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">
          {error}
        </div>
      )}

      {/* onSubmit ruft handleLogin auf wenn der Nutzer den Button klickt */}
      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        
        {/* E-Mail Feld */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            E-Mail
          </label>
          <input
            type="email"
            value={email}
            // onChange aktualisiert den State bei jedem Tastendruck
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Passwort Feld */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Passwort
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Button ist deaktiviert während der Request läuft */}
        <button
          type="submit"
          disabled={loading}
          className="bg-green-700 text-white py-2 rounded-lg font-medium hover:bg-green-800 transition-colors disabled:opacity-50"
        >
          {/* Text wechselt je nach Ladezustand */}
          {loading ? 'Wird eingeloggt...' : 'Einloggen'}
        </button>
      </form>

      {/* Link zur Registrierung */}
      <p className="mt-4 text-sm text-gray-600 text-center">
        Noch kein Konto?{' '}
        <a href="/register" className="text-green-700 font-medium hover:underline">
          Jetzt registrieren
        </a>
      </p>
    </div>
  )
}