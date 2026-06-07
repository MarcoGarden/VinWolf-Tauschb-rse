// useEffect: laedt das Inserat wenn die Seite geoeffnet wird
// useState: speichert Inserat, Ladezustand und Fehler
import { useEffect, useState } from 'react'

// Link und useParams: lesen die Inserat-ID aus der URL und ermoeglichen Navigation
import { Link, useParams } from 'react-router-dom'

// useAuth: holt den eingeloggten Nutzer fuer Kontakt- und Besitzer-Pruefung
import { useAuth } from '../context/AuthContext'

// supabase: brauchen wir zum Laden und Loeschen des Inserats
import { supabase } from '../supabase'

export default function ListingDetail() {
  
  // id kommt aus der URL, z.B. /inserate/123
  const { id } = useParams()

  // user ist null wenn niemand eingeloggt ist
  const { user } = useAuth()

  // listing enthaelt das geladene Inserat
  const [listing, setListing] = useState(null)

  // imageUrl enthaelt die oeffentliche URL zum Bild
  const [imageUrl, setImageUrl] = useState(null)

  // loading: true solange Supabase Daten laedt
  const [loading, setLoading] = useState(true)

  // deleting: true solange das Inserat geloescht wird
  const [deleting, setDeleting] = useState(false)

  // error: Fehlermeldung falls das Inserat nicht gefunden wird oder Laden fehlschlaegt
  const [error, setError] = useState(null)

  // Laedt ein einzelnes Inserat inklusive Profilinformationen des Besitzers
  useEffect(() => {
    async function loadListing() {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('listings')
        .select(`
          id,
          title,
          description,
          category,
          location_city,
          location_postcode,
          image_url,
          user_id,
          profiles (
            display_name,
            city,
            contact_email
          )
        `)
        .eq('id', id)
        .maybeSingle()

      if (error) {
        setError('Inserat konnte nicht geladen werden.')
        setListing(null)
        setLoading(false)
        return
      }

      if (!data) {
        setError('Dieses Inserat wurde nicht gefunden.')
        setListing(null)
        setLoading(false)
        return
      }

      setListing(data)

      // Wenn ein Bildpfad gespeichert ist, erzeugen wir daraus eine public URL
      if (data.image_url) {
        const { data: publicImage } = supabase.storage
          .from('listing-images')
          .getPublicUrl(data.image_url)

        setImageUrl(publicImage.publicUrl)
      }

      setLoading(false)
    }

    loadListing()
  }, [id])

  // Prueft ob der eingeloggte Nutzer Besitzer dieses Inserats ist
  const isOwner = user && listing && user.id === listing.user_id

  // Loescht zuerst das Bild aus dem Storage und danach das Inserat aus der Tabelle
  async function handleDelete() {
    const confirmed = window.confirm('Moechtest du dieses Inserat wirklich loeschen?')

    if (!confirmed) {
      return
    }

    setDeleting(true)
    setError(null)

    if (listing.image_url) {
      await supabase.storage
        .from('listing-images')
        .remove([listing.image_url])
    }

    const { error } = await supabase
      .from('listings')
      .delete()
      .eq('id', listing.id)

    if (error) {
      setError('Inserat konnte nicht geloescht werden.')
      setDeleting(false)
      return
    }

    window.location.href = '/inserate'
  }

  if (loading) {
    return (
      <div className="text-center text-gray-600">
        Inserat wird geladen...
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow p-8 text-center">
        <h1 className="text-2xl font-bold text-green-700">
          Inserat nicht gefunden
        </h1>
        <p className="mt-4 text-gray-600">{error}</p>
        <Link
          to="/inserate"
          className="inline-block mt-6 bg-green-700 text-white px-6 py-2 rounded-lg hover:bg-green-800 transition-colors"
        >
          Zurueck zu den Inseraten
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow overflow-hidden">
      
      {/* Bildbereich */}
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={listing.title}
          className="h-80 w-full object-cover"
        />
      ) : (
        <div className="h-80 w-full bg-green-50 flex items-center justify-center text-green-700">
          Kein Bild vorhanden
        </div>
      )}

      <div className="p-8">
        
        {/* Titel und Kategorie */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-green-700">
              {listing.title}
            </h1>
            <p className="mt-2 text-gray-500">
              {listing.location_postcode} {listing.location_city}
            </p>
          </div>

          <span className="self-start rounded-full bg-green-50 px-4 py-1 text-sm font-medium text-green-700">
            {listing.category}
          </span>
        </div>

        {/* Beschreibung */}
        <div className="mt-8">
          <h2 className="text-lg font-bold text-gray-900">
            Beschreibung
          </h2>
          <p className="mt-2 whitespace-pre-line text-gray-700">
            {listing.description || 'Keine Beschreibung vorhanden.'}
          </p>
        </div>

        {/* Anbieterprofil */}
        <div className="mt-8 border-t pt-6">
          <h2 className="text-lg font-bold text-gray-900">
            Anbieter
          </h2>
          <p className="mt-2 text-gray-700">
            {listing.profiles?.display_name || 'Unbekannter Nutzer'}
          </p>
          <p className="text-sm text-gray-500">
            {listing.profiles?.city || listing.location_city || 'Ort nicht angegeben'}
          </p>
        </div>

        {/* Kontakt und Besitzer-Aktionen */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          
          {/* Kontaktbutton nur fuer eingeloggte Nutzer anzeigen */}
          {user && !isOwner && listing.profiles?.contact_email && (
            <a
              href={`mailto:${listing.profiles.contact_email}?subject=Anfrage zu deinem Inserat: ${listing.title}`}
              className="bg-green-700 text-white px-6 py-2 rounded-lg font-medium text-center hover:bg-green-800 transition-colors"
            >
              Anbieter kontaktieren
            </a>
          )}

          {!user && (
            <Link
              to="/login"
              className="bg-green-700 text-white px-6 py-2 rounded-lg font-medium text-center hover:bg-green-800 transition-colors"
            >
              Einloggen zum Kontaktieren
            </Link>
          )}

          {/* Edit/Delete nur fuer Besitzer anzeigen */}
          {isOwner && (
            <>
              <Link
                to={`/inserate/${listing.id}/bearbeiten`}
                className="border border-green-700 text-green-700 px-6 py-2 rounded-lg font-medium text-center hover:bg-green-50 transition-colors"
              >
                Bearbeiten
              </Link>

              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="border border-red-600 text-red-600 px-6 py-2 rounded-lg font-medium hover:bg-red-50 transition-colors disabled:opacity-50"
              >
                {deleting ? 'Wird geloescht...' : 'Loeschen'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}