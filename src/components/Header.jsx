// useAuth: holt den aktuellen Login-Status aus dem AuthContext
import { useAuth } from '../context/AuthContext'

// supabase: brauchen wir für den Logout
import { supabase } from '../supabase'

export default function Header() {
  
  // user: eingeloggter Nutzer oder null falls nicht eingeloggt
  const { user } = useAuth()

  // Wird aufgerufen wenn der Nutzer auf "Logout" klickt
  async function handleLogout() {
    await supabase.auth.signOut()
    // Nach Logout zur Startseite weiterleiten
    window.location.href = '/'
  }

  return (
    <header className="bg-green-700 text-white shadow-md">
      <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">

        {/* Logo und App-Name — klickbar zur Startseite */}
        <a href="/" className="flex items-center gap-2 hover:opacity-90">
          <span className="text-2xl">🌱</span>
          <span className="text-xl font-bold">Gärtner Tauschbörse</span>
        </a>

        {/* Navigation */}
        <nav className="flex gap-6 text-sm font-medium items-center">
          
          <a href="/" className="hover:text-green-200 transition-colors">
            Startseite
          </a>
          
          <a href="/inserate" className="hover:text-green-200 transition-colors">
            Inserate
          </a>
        {/* Profil-Link nur anzeigen wenn ein Nutzer eingeloggt ist */}
        {user && (
        <a href="/profile" className="hover:text-green-200 transition-colors">
             Profil
        </a>
      )}
          {/* Zeigt Login ODER Logout — je nach Login-Status */}
          {user ? (
            // Nutzer ist eingeloggt: zeige E-Mail und Logout-Button
            <div className="flex items-center gap-4">
              
              {/* Zeigt die E-Mail des eingeloggten Nutzers */}
              <span className="text-green-200 text-xs hidden sm:block">
                {user.email}
              </span>
              
              {/* Logout-Button */}
              <button
                onClick={handleLogout}
                className="bg-white text-green-700 px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-green-50 transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            // Nutzer ist nicht eingeloggt: zeige Login-Link
            <a
              href="/login"
              className="bg-white text-green-700 px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-green-50 transition-colors"
            >
              Login
            </a>
          )}
        </nav>

      </div>
    </header>
  )
}