import './Home.css'

function Home() {
  return (
    <main className="home my-5">
      {/* Hero Section */}
      <section className="container mb-5">
        <div className="p-5 mb-4 bg-light rounded-3 shadow-sm border text-center">
          <div className="container-fluid py-5">
            <h1 className="display-5 fw-bold text-dark">Tu plataforma de Fitness y Nutrición</h1>
            <p className="col-md-8 fs-4 mx-auto text-muted my-3">
              Conectamos profesionales con personas que buscan mejorar su estilo de vida.
            </p>
            <a className="btn btn-primary btn-lg px-4 gap-3 mt-2" href="/registro">Empezar Ahora</a>
          </div>
        </div>
      </section>

      {/* Features Cards Section */}
      <section className="container">
        <div className="row g-4">
          <div className="col-md-4">
            <div className="card h-100 shadow-sm border-0">
              <div className="card-body text-center p-4">
                <div className="mb-3 text-primary fs-1">🏋️‍♂️</div>
                <h3 className="card-title h5 fw-bold">Explorar Planes</h3>
                <p className="card-text text-muted">Descubrí planes de entrenamiento y nutrición personalizados para tus objetivos.</p>
                <a href="#" className="btn btn-outline-primary btn-sm mt-3">Ver más</a>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card h-100 shadow-sm border-0">
              <div className="card-body text-center p-4">
                <div className="mb-3 text-primary fs-1">🥗</div>
                <h3 className="card-title h5 fw-bold">Profesionales</h3>
                <p className="card-text text-muted">Conectá con entrenadores y nutricionistas certificados listos para guiarte.</p>
                <a href="#" className="btn btn-outline-primary btn-sm mt-3">Conocer más</a>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card h-100 shadow-sm border-0">
              <div className="card-body text-center p-4">
                <div className="mb-3 text-primary fs-1">⚡</div>
                <h3 className="card-title h5 fw-bold">Tu Plan, Tu Ritmo</h3>
                <p className="card-text text-muted">Comprá y seguí tu progreso con total flexibilidad a tu propio ritmo.</p>
                <a href="#" className="btn btn-outline-primary btn-sm mt-3">Empezar</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Home
