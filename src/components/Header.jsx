function Header() {
  return (
    <header className="bg-green-700 text-white shadow-md">
      <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
        
        {/* Logo und App-Name */}
        <div className="flex items-center gap-2">
          <span className="text-2xl">🌱</span>
          <span className="text-xl font-bold">Gärtner Tauschbörse</span>
        </div>

        {/* Navigation */}
        <nav className="flex gap-6 text-sm font-medium">
          <a href="/" className="hover:text-green-200 transition-colors">
            Startseite
          </a>
          <a href="/inserate" className="hover:text-green-200 transition-colors">
            Inserate
          </a>
          <a href="/login" className="hover:text-green-200 transition-colors">
            Login
          </a>
        </nav>

      </div>
    </header>
  )
}

export default Header