// Link: ermoeglicht Navigation zur Detailseite ohne kompletten Seiten-Reload
import { Link } from 'react-router-dom'

// supabase: brauchen wir um aus dem Storage-Pfad eine oeffentliche Bild-URL zu erzeugen
import { supabase } from '../supabase'

export default function ListingCard({ listing }) {
  
  // Falls ein Bildpfad vorhanden ist, erzeugen wir die public URL aus Supabase Storage
  const imageUrl = listing.image_url
    ? supabase.storage.from('listing-images').getPublicUrl(listing.image_url).data.publicUrl
    : null

  return (
    // Ganze Karte ist klickbar und fuehrt zur spaeteren Detailseite
    <Link
      to={`/inserate/${listing.id}`}
      className="block bg-white rounded-xl shadow hover:shadow-md transition-shadow overflow-hidden"
    >
      {/* Bildbereich */}
      <div className="h-48 bg-green-50">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={listing.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-green-700 text-sm">
            Kein Bild
          </div>
        )}
      </div>

      {/* Textbereich */}
      <div className="p-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-bold text-gray-900 truncate">
            {listing.title}
          </h2>

          <span className="shrink-0 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
            {listing.category}
          </span>
        </div>

        <p className="mt-2 text-sm text-gray-500">
          {listing.location_city || 'Ort nicht angegeben'}
        </p>

        <p className="mt-3 text-sm text-gray-600">
          Von {listing.profiles?.display_name || 'Unbekannt'}
        </p>
      </div>
    </Link>
  )
}