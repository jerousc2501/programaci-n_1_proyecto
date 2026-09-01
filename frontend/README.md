# FitTech - Frontend

## Descripción

Cliente React de FitTech, una plataforma de fitness y nutrición que conecta profesionales con usuarios.

## Tecnologías

- **React** - Librería de UI
- **Vite** - Build tool y dev server
- **CSS** - Estilos

## Iniciar desarrollo

```bash
npm install
npm run dev
```

El servidor levanta en `http://localhost:3000`

## Estructura

```
frontend/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx    # Barra de navegación
│   │   ├── Home.jsx      # Página principal
│   │   └── Footer.jsx    # Pie de página
│   ├── App.jsx           # Componente raíz
│   ├── App.css
│   └── main.jsx
├── index.html
└── vite.config.js
```

## Backend

El frontend consume una API Django REST que corre en `http://localhost:8000`. Ver la documentación de la API en `/api/docs/` (Swagger).
