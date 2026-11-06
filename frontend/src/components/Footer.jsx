import './Footer.css'

function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-dark text-white text-center py-4 mt-auto shadow-sm">
      <div className="container">
        <p className="mb-0 text-white-50">&copy; {currentYear} FitTech - Plataforma de Fitness y Nutrición. Todos los derechos reservados.</p>
      </div>
    </footer>
  )
}

export default Footer
