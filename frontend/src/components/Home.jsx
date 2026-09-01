import './Home.css'

function Home() {
  return (
    <main className="home">
      <section className="hero">
        <h2>Tu plataforma de Fitness y Nutrición</h2>
        <p>Conectamos profesionales con personas que buscan mejorar su estilo de vida</p>
      </section>

      <section className="features">
        <div className="feature-card">
          <h3>Explorar Planes</h3>
          <p>Descubrí planes de entrenamiento y nutrición personalizados</p>
        </div>
        <div className="feature-card">
          <h3>Profesionales</h3>
          <p>Conectá con entrenadores y nutricionistas certificados</p>
        </div>
        <div className="feature-card">
          <h3>Tu Plan, Tu Ritmo</h3>
          <p>Comprá y seguí tu plan a tu propio ritmo</p>
        </div>
      </section>
    </main>
  )
}

export default Home
