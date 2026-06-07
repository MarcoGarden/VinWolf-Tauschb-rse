// useEffect: laedt Inserate beim Oeffnen der Seite
// useState: speichert Inserate, Filter und Ladezustand
import { useEffect, useState } from 'react'

// supabase: brauchen wir um Inserate aus der Datenbank zu laden
import { supabase } from '../supabase'

// ListingCard: zeigt ein einzelnes Inserat als Karte
import ListingCard from '../components/ListingCard'

export default function Listings() {
  
  // Alle geladenen Inserate
  const [listings, setListings] = useState([])

  // Aktuell ausgewaehlter Kategorie-Filter
  const [categoryFilter, setCategoryFilter] = useState('Alle')

  // loading: true solange Supabase Daten laedt
  const [loading, setLoading] = useState(true)

  // error: Fehlermeldung falls das Laden nicht klappt
  const [error, setError] = useState(null)

  // Kategorien fuer den Filter
  const categories = ['Alle', 'Gemüse', 'Samen', 'Stauden', 'Obst', 'Werkzeug', 'Sonstiges']

  // Laedt alle Inserate aus Supabase, neueste zuerst
  useEffect(() => {
    async function loadListings() {
      setLoading(true)
      setError(null)

      // profiles(display_name) holt den Anzeigenamen des Besitzers dazu
      const { data, error } = await supabase
        .from('listings')
        .select(`
          id,
          created_at,
          title,
          category,
          location_city,
          image_url,
          profiles (
            display_name
          )
        `)
        .order('created_at', { ascending: false })

      if (error) {
        setError('Inserate konnten nicht geladen werden.')
        setListings([])
      } else {
        setListings(data)
      }

      setLoading(false)
    }

    loadListings()
  }, [])

  // Wendet den Kategorie-Filter lokal auf die geladenen Inserate an
  const filteredListings = categoryFilter === 'Alle'
    ? listings
    : listings.filter((listing) => listing.category === categoryFilter)

  return (
    <div>
      
      {/* Seitentitel */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-green-700">
            Inserate
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Entdecke Pflanzen, Samen und Gartenzubehoer aus der Community.
          </p>
        </div>

        {/* Kategorie-Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Kategorie
          </label>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full sm:w-48 border border-gray-300 rounded-lg px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Ladezustand */}
      {loading && (
        <div className="mt-8 text-center text-gray-600">
          Inserate werden geladen...
        </div>
      )}

      {/* Fehlermeldung */}
      {!loading && error && (
        <div className="mt-8 bg-red-50 text-red-600 p-3 rounded text-sm">
          {error}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredListings.length === 0 && (
        <div className="mt-8 bg-white rounded-xl shadow p-8 text-center">
          <h2 className="text-lg font-bold text-gray-900">
            Noch keine Inserate vorhanden
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Sobald Inserate erstellt werden, erscheinen sie hier.
          </p>
        </div>
      )}

      {/* Kartenraster */}
      {!loading && !error && filteredListings.length > 0 && (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredListings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </div>
  )
}