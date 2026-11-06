function Home() {
  const FEATURES = [
    { id: 'planes', icon: '🏋️‍♂️', title: 'Explorar Planes', desc: 'Descubrí planes personalizados para tus objetivos.', linkText: 'Ver más' },
    { id: 'pros', icon: '🥗', title: 'Profesionales', desc: 'Conectá con entrenadores y nutricionistas certificados.', linkText: 'Conocer más' },
    { id: 'ritmo', icon: '⚡', title: 'Tu Plan, Tu Ritmo', desc: 'Comprá y seguí tu progreso con total flexibilidad.', linkText: 'Empezar' }
  ];

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
          {FEATURES.map((item) => (
            <div className="col-12 col-md-6 col-lg-4" key={item.id}>
              <div className="card h-100 shadow-sm border-0">
                <div className="card-body text-center p-4">
                  <div className="mb-3 text-primary fs-1">{item.icon}</div>
                  <h3 className="card-title h5 fw-bold">{item.title}</h3>
                  <p className="card-text text-muted">{item.desc}</p>
                  <a href="#contacto" className="btn btn-outline-primary btn-sm mt-3" onClick={(e) => e.preventDefault()}>{item.linkText}</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}

export default Home
