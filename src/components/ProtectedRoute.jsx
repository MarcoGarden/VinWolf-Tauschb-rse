// Navigate: ermoeglicht automatische Weiterleitung auf eine andere Route
import { Navigate } from 'react-router-dom'

// useAuth: holt den aktuellen Login-Status aus unserem AuthContext
import { useAuth } from '../context/AuthContext'

// ProtectedRoute schuetzt Seiten, die nur eingeloggte Nutzer sehen duerfen
// children ist die Seite/Komponente, die geschuetzt werden soll
export default function ProtectedRoute({ children }) {
  
  // user: eingeloggter Nutzer oder null falls niemand eingeloggt ist
  // loading: true solange Supabase noch prueft ob eine Session existiert
  const { user, loading } = useAuth()

  // Solange der Login-Status noch geladen wird, zeigen wir eine kurze Meldung
  // Dadurch verhindern wir, dass Nutzer kurz auf die falsche Seite springen
  if (loading) {
    return (
      <div className="text-center text-gray-600">
        Wird geladen...
      </div>
    )
  }

  // Wenn kein Nutzer eingeloggt ist, weiterleiten zur Login-Seite
  // replace verhindert, dass die geschuetzte Seite im Browser-Verlauf bleibt
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Wenn ein Nutzer eingeloggt ist, wird die geschuetzte Seite angezeigt
  return children
}