# programaci-n_1_proyecto

## FitTech

FitTech es una plataforma web integral diseñada para conectar a usuarios que buscan mejorar su estilo de vida con planes de nutrición y entrenamiento 100% personalizados, generados mediante algoritmos de salud y supervisión profesional.

---

## Diagrama de Diseño - Home / Estructura General

```
                         ┌──────────────────────────┐
                         │           HOME           │
                         │    FitTech - Fitness &   │
                         │        Nutrición         │
                         └────────────┬─────────────┘
                                      │
             ┌────────────────────────┼────────────────────────┐
             │                        │                        │
             ▼                        ▼                        ▼
    ┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
    │ Autenticación   │      │ Explorar planes │      │ Profesionales   │
    └────────┬────────┘      └────────┬────────┘      └────────┬────────┘
             │                        │                        │
      ┌──────┼──────┐                 │                        │
      ▼      ▼      ▼                 ▼                        ▼
   Registro Login  Logout       ┌──────────────┐       ┌────────────────┐
      │      │      │            │ /api/planes/│       │ /api/perfiles- │
      │      │      │            └──────┬───────┘       │ profesionales/ │
      │      │      │                   │               └───────┬────────┘
      │      │      │                   ▼                       │
      │      │      │           ┌────────────────┐              │
      │      │      └──────────►│ Detalle del    │◄─────────────┘
      │      │                  │     Plan       │
      │      │                  └───────┬────────┘
      │      │                          │
      │      └──────────────────────────┤
      │                                 ▼
      │                        ┌─────────────────┐
      │                        │ Comprar plan   │
      │                        └────────┬────────┘
      │                                 │
      │                                 ▼
      │                        ┌─────────────────┐
      │                        │ Planes del     │
      │                        │    cliente     │
      │                        └────────┬────────┘
      │                                 │
      │                                 ▼
      │                     /api/planes-clientes/
      │
      ▼
 /api/auth/register/


                    ┌─────────────────────────────┐
                    │      USUARIO AUTENTICADO    │
                    │   Roles: ADMIN | PRO | CLI   │
                    └──────────────┬──────────────┘
                                   │
                 ┌─────────────────┴─────────────────┐
                 ▼                                   ▼
        ┌─────────────────┐                 ┌────────────────────┐
        │   Mi perfil     │                 │ Perfil Profesional │
        └────────┬────────┘                 └─────────┬──────────┘
                 │                                    │
                 ▼                                    ▼
        /api/auth/me/                       /api/perfiles-
                                            profesionales/
```

### Roles

| Rol | Permisos |
|-----|----------|
| **ADMIN** | Gestiona todos los usuarios y el sistema |
| **PROFESIONAL** | Crea y administra planes de entrenamiento/nutrición |
| **CLIENTE** | Explora, compra y gestiona sus planes |
