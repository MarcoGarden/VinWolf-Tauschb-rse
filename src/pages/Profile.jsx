// useAuth: holt den eingeloggten Nutzer aus unserem AuthContext
import { useAuth } from '../context/AuthContext'

export default function Profile() {
  
  // user enthaelt die Daten des aktuell eingeloggten Nutzers
  // z.B. die E-Mail-Adresse aus Supabase Auth
  const { user } = useAuth()

  return (
    // Profil-Karte mit maximaler Breite und weissem Hintergrund
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow p-8">
      
      {/* Seitentitel */}
      <h1 className="text-2xl font-bold text-green-700">Mein Profil</h1>

      {/* Profilinformationen */}
      <div className="mt-6 space-y-4 text-gray-700">
        
        {/* E-Mail-Adresse des eingeloggten Nutzers */}
        <div>
          <p className="text-sm font-medium text-gray-500">E-Mail</p>
          <p>{user.email}</p>
        </div>

        {/* Platzhalter fuer die naechsten Profil-Felder */}
        <div className="border-t pt-4">
          <p className="text-sm text-gray-500">
            Profilangaben wie Anzeigename, PLZ und Gartenbeschreibung folgen im naechsten Schritt.
          </p>
        </div>
      </div>
    </div>
  )
}