// useEffect: laedt Profildaten wenn die Seite geoeffnet wird
// useState: speichert Formularwerte, Ladezustand und Meldungen
import { useEffect, useState } from 'react'

// useAuth: holt den eingeloggten Nutzer aus unserem AuthContext
import { useAuth } from '../context/AuthContext'

// supabase: brauchen wir um Profildaten zu laden und zu speichern
import { supabase } from '../supabase'

export default function Profile() {
  
  // user enthaelt die Daten des aktuell eingeloggten Nutzers
  // z.B. die E-Mail-Adresse aus Supabase Auth
  const { user } = useAuth()

  // Formular-Felder fuer das Profil
  const [displayName, setDisplayName] = useState('')
  const [postcode, setPostcode] = useState('')
  const [city, setCity] = useState('')
  const [gardenDescription, setGardenDescription] = useState('')

  // loading: true solange wir bestehende Profildaten aus Supabase laden
  const [loading, setLoading] = useState(true)

  // saving: true solange der Speichern-Request laeuft
  const [saving, setSaving] = useState(false)

  // Meldungen fuer Erfolg oder Fehler
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  // Laedt das bestehende Profil, sobald ein eingeloggter Nutzer vorhanden ist
  useEffect(() => {
    async function loadProfile() {
      setLoading(true)
      setError(null)

      // Holt genau das Profil, dessen id zur eingeloggten User-ID passt
      const { data, error } = await supabase
        .from('profiles')
        .select('display_name, postcode, city, garden_description')
        .eq('id', user.id)
        .maybeSingle()

      if (error) {
        setError('Profil konnte nicht geladen werden.')
      }

      // Wenn bereits ein Profil existiert, fuellen wir das Formular damit
      if (data) {
        setDisplayName(data.display_name ?? '')
        setPostcode(data.postcode ?? '')
        setCity(data.city ?? '')
        setGardenDescription(data.garden_description ?? '')
      }

      setLoading(false)
    }

    if (user) {
      loadProfile()
    }
  }, [user])

  // Speichert neue oder geaenderte Profildaten in Supabase
  async function handleSave(e) {
    e.preventDefault()

    setSaving(true)
    setError(null)
    setSuccess(null)

    // upsert erstellt einen neuen Datensatz oder aktualisiert den bestehenden
    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        display_name: displayName,
        postcode,
        city,
        garden_description: gardenDescription,
      })

    if (error) {
      setError('Profil konnte nicht gespeichert werden.')
    } else {
      setSuccess('Profil gespeichert.')
    }

    setSaving(false)
  }

  if (loading) {
    return (
      <div className="text-center text-gray-600">
        Profil wird geladen...
      </div>
    )
  }

  return (
    // Profil-Karte mit maximaler Breite und weissem Hintergrund
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow p-8">
      
      {/* Seitentitel */}
      <h1 className="text-2xl font-bold text-green-700">Mein Profil</h1>

      {/* E-Mail-Adresse kommt aus Supabase Auth und wird nicht im Profilformular bearbeitet */}
      <p className="mt-2 text-sm text-gray-500">
        Eingeloggt als {user.email}
      </p>

      {/* Fehlermeldung */}
      {error && (
        <div className="mt-6 bg-red-50 text-red-600 p-3 rounded text-sm">
          {error}
        </div>
      )}

      {/* Erfolgsmeldung */}
      {success && (
        <div className="mt-6 bg-green-50 text-green-700 p-3 rounded text-sm">
          {success}
        </div>
      )}

      {/* Formular zum Bearbeiten des Profils */}
      <form onSubmit={handleSave} className="mt-6 space-y-4 text-gray-700">
        
        {/* Anzeigename */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Anzeigename
          </label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* PLZ und Ort nebeneinander auf groesseren Bildschirmen */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              PLZ
            </label>
            <input
              type="text"
              value={postcode}
              onChange={(e) => setPostcode(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ort
            </label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        {/* Kurze Gartenbeschreibung */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Kurze Gartenbeschreibung
          </label>
          <textarea
            value={gardenDescription}
            onChange={(e) => setGardenDescription(e.target.value)}
            rows={5}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Speichern-Button */}
        <button
          type="submit"
          disabled={saving}
          className="bg-green-700 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-800 transition-colors disabled:opacity-50"
        >
          {saving ? 'Wird gespeichert...' : 'Profil speichern'}
        </button>
      </form>
    </div>
  )
}