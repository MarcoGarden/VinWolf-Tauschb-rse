// BrowserRouter: ermöglicht Navigation zwischen Seiten ohne Neuladen
// Routes: Container für alle Routen der App
// Route: verknüpft eine URL mit einer Komponente
import { BrowserRouter, Routes, Route } from 'react-router-dom'

// AuthProvider: umhüllt die App damit alle Seiten den Login-Status kennen
import { AuthProvider } from './context/AuthContext'

// Unsere Komponenten
import Header from './components/Header'
import Footer from './components/Footer'

// Unsere Seiten
import Login from './pages/Login'
import Register from './pages/Register'

// ProtectedRoute: schuetzt Seiten vor nicht eingeloggten Nutzern
import ProtectedRoute from './components/ProtectedRoute'

// Profile: geschuetzte Profilseite fuer eingeloggte Nutzer
import Profile from './pages/Profile'

// CreateListing: Formularseite fuer neue Inserate
import CreateListing from './pages/CreateListing'

function App() {
  return (
    // AuthProvider ganz aussen — damit Login-Status überall verfügbar ist
    <AuthProvider>
      
      {/* BrowserRouter ermöglicht die Navigation zwischen Seiten */}
      <BrowserRouter>
        
        {/* Flex-Column damit Footer immer unten bleibt */}
        <div className="min-h-screen flex flex-col bg-gray-50">
          
          {/* Header erscheint auf jeder Seite */}
          <Header />

          {/* Hauptinhalt — wächst und füllt den verfügbaren Platz */}
          <main className="flex-grow max-w-5xl mx-auto w-full px-4 py-8">
            
            {/* Routes prüft die aktuelle URL und zeigt die passende Seite */}
            <Routes>
              
              {/* Startseite: http://localhost:5173/ */}
              <Route path="/" element={
                <div>
                  <h1 className="text-3xl font-bold text-green-700">
                    Willkommen zur Gärtner Tauschbörse! 🌱
                  </h1>
                  <p className="mt-4 text-gray-600">
                    Tauscht Pflanzen, Samen und mehr mit Gärtnern in eurer Nähe.
                  </p>
                </div>
              } />

              {/* Login-Seite: http://localhost:5173/login */}
              <Route path="/login" element={<Login />} />

              {/* Registrierungs-Seite: http://localhost:5173/register */}
              <Route path="/register" element={<Register />} />
              {/* Profil-Seite: nur sichtbar wenn der Nutzer eingeloggt ist */}
              <Route
                   path="/profile"
                      element={
                      <ProtectedRoute>
                      <Profile />
                      </ProtectedRoute>
                                        }
              />
              {/* Neues Inserat: nur sichtbar wenn der Nutzer eingeloggt ist */}
              <Route
                  path="/inserate/neu"
                    element={
              <ProtectedRoute>
              <CreateListing />
              </ProtectedRoute>
                                        }
              />
            </Routes>
          </main>
        
          {/* Footer erscheint auf jeder Seite */}
          <Footer />
        </div>

      </BrowserRouter>
    </AuthProvider>
  )
}

export default App