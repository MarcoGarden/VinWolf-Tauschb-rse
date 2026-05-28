import Header from './components/Header'
import Footer from './components/Footer'

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-grow max-w-5xl mx-auto w-full px-4 py-8">
        <h1 className="text-3xl font-bold text-green-700">
          Willkommen zur Gärtner Tauschbörse!
        </h1>
        <p className="mt-4 text-gray-600">
          Hier könnt ihr bald Pflanzen, Samen und mehr tauschen.
        </p>
      </main>

      <Footer />
    </div>
  )
}

export default App