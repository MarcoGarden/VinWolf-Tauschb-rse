// createContext: erstellt einen "globalen Behälter" für Login-Daten
// useContext: ermöglicht anderen Komponenten, auf diesen Behälter zuzugreifen
// useEffect: führt Code aus, wenn die Komponente geladen wird
// useState: speichert Werte die sich ändern können (z.B. eingeloggter User)
import { createContext, useContext, useEffect, useState } from 'react'

// Importiert unsere Supabase-Verbindung
import { supabase } from '../supabase'

// Erstellt den globalen Behälter für den Login-Status
// Alle Komponenten der App können darauf zugreifen
const AuthContext = createContext()

// AuthProvider "umhüllt" die gesamte App
// Dadurch hat jede Seite Zugriff auf den Login-Status
export function AuthProvider({ children }) {
  
  // user: speichert den eingeloggten Nutzer (null = niemand eingeloggt)
  const [user, setUser] = useState(null)
  
  // loading: true solange wir prüfen ob jemand eingeloggt ist
  // verhindert kurzes "Flackern" beim Laden der Seite
  const [loading, setLoading] = useState(true)

  // useEffect läuft einmal wenn die App startet
  useEffect(() => {
    
    // Prüft ob der Nutzer bereits eine aktive Session hat
    // z.B. wenn er die Seite neu lädt aber schon eingeloggt war
    supabase.auth.getSession().then(({ data: { session } }) => {
      // session?.user gibt den User zurück, oder null falls keine Session
      setUser(session?.user ?? null)
      setLoading(false) // Laden abgeschlossen
    })

    // Reagiert automatisch auf Login und Logout
    // Supabase ruft diese Funktion auf wenn sich der Auth-Status ändert
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
      }
    )

    // Aufräumen: stoppt das Zuhören wenn die Komponente entfernt wird
    return () => subscription.unsubscribe()
  }, []) // [] bedeutet: nur einmal ausführen beim Start

  return (
    // Stellt user und loading für alle Kind-Komponenten bereit
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

// useAuth: einfacher Helfer damit andere Komponenten den Login-Status
// mit nur einer Zeile abrufen können: const { user } = useAuth()
export function useAuth() {
  return useContext(AuthContext)
}