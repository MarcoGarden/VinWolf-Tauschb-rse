// useState: speichert Formularwerte, Ladezustand und Meldungen
import { useState } from 'react'

// useNavigate: leitet nach dem Speichern zur Detailseite weiter
import { useNavigate } from 'react-router-dom'

// useAuth: holt den eingeloggten Nutzer aus unserem AuthContext
import { useAuth } from '../context/AuthContext'

// supabase: brauchen wir zum Speichern des Inserats
import { supabase } from '../supabase'

// ImageUpload: eigene Komponente fuer den Upload in Supabase Storage
import ImageUpload from '../components/ImageUpload'

export default function CreateListing() {
  
  // user enthaelt den eingeloggten Nutzer
  const { user } = useAuth()

  // navigate ermoeglicht Weiterleitung innerhalb der React-App
  const navigate = useNavigate()

  // Formular-Felder fuer das neue Inserat
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('Gemüse')
  const [description, setDescription] = useState('')
  const [locationCity, setLocationCity] = useState('')
  const [locationPostcode, setLocationPostcode] = useState('')
  const [imagePath, setImagePath] = useState(null)

  // saving: true solange das Inserat gespeichert wird
  const [saving, setSaving] = useState(false)

  // error: Fehlermeldung falls Speichern nicht klappt
  const [error, setError] = useState(null)

  // Kategorien, die auch in der Supabase Check-Constraint erlaubt sind
  const categories = ['Gemüse', 'Samen', 'Stauden', 'Obst', 'Werkzeug', 'Sonstiges']

  // Wird aufgerufen wenn der Nutzer das Formular abschickt
  async function handleSubmit(e) {
    e.preventDefault()

    setSaving(true)
    setError(null)

    // Inserat in Supabase speichern
    const { data, error } = await supabase
      .from('listings')
      .insert({
        title,
        category,
        description,
        location_city: locationCity,
        location_postcode: locationPostcode,
        image_url: imagePath,
        user_id: user.id,
      })
      .select('id')
      .single()

    if (error) {
      setError('Inserat konnte nicht gespeichert werden.')
      setSaving(false)
      return
    }

    // Nach erfolgreichem Speichern zur spaeteren Detailseite weiterleiten
    navigate(`/inserate/${data.id}`)
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow p-8">
      
      {/* Seitentitel */}
      <h1 className="text-2xl font-bold text-green-700">
        Neues Inserat erstellen
      </h1>

      <p className="mt-2 text-sm text-gray-500">
        Biete Pflanzen, Samen oder Gartenzubehoer zum Tauschen an.
      </p>

      {/* Fehlermeldung */}
      {error && (
        <div className="mt-6 bg-red-50 text-red-600 p-3 rounded text-sm">
          {error}
        </div>
      )}

      {/* Formular fuer das neue Inserat */}
      <form onSubmit={handleSubmit} className="mt-6 space-y-4 text-gray-700">
        
        {/* Titel */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Titel
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Kategorie */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Kategorie
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        {/* Beschreibung */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Beschreibung
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Ort und PLZ */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              PLZ
            </label>
            <input
              type="text"
              value={locationPostcode}
              onChange={(e) => setLocationPostcode(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ort
            </label>
            <input
              type="text"
              value={locationCity}
              onChange={(e) => setLocationCity(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        {/* Bild-Upload */}
        <ImageUpload
          userId={user.id}
          imagePath={imagePath}
          onUploadComplete={setImagePath}
        />

        {/* Speichern-Button */}
        <button
          type="submit"
          disabled={saving}
          className="bg-green-700 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-800 transition-colors disabled:opacity-50"
        >
          {saving ? 'Wird gespeichert...' : 'Inserat speichern'}
        </button>
      </form>
    </div>
  )
}