# 📊 Reporte de Pruebas y Validación de API (Trabajo Práctico N°4)

**Proyecto:** FitTech  
**Módulo:** Backend & API REST  
**Autor / Alumno:** Jerónimo Soto 
**Fecha:** Noviembre 2026  

---

## 1. Introducción y Objetivo
El presente reporte documenta las pruebas manuales de integración, validación de casos de borde y control de acceso basadas en roles (RBAC) realizadas sobre la API de FitTech. El propósito principal fue asegurar la robustez del sistema, verificar el cumplimiento de las reglas de negocio y corregir brechas de seguridad antes de pasar a producción o fases posteriores de desarrollo.

---

## 2. Matriz de Casos de Prueba Ejecutados

| ID | Categoría | Endpoint | Rol Utilizado | Acción / Escenario | Resultado Esperado | Resultado Obtenido | Estado |
|---|---|---|---|---|---|---|---|
| **TP4-01** | Roles | `/api/planes/` | ADMIN | Crear un plan de entrenamiento. | `201 Created` | `201 Created` | ✅ **Aprobado** |
| **TP4-02** | Roles | `/api/planes/1/` | ADMIN | Eliminar un plan existente. | `204 No Content` | `204 No Content` | ✅ **Aprobado** |
| **TP4-03** | Roles | `/api/planes/` | CLIENTE | Intentar crear un plan de entrenamiento. | `403 Forbidden` | `403 Forbidden` *(Tras corrección)* | ✅ **Aprobado** |
| **TP4-04** | Roles | `/api/planes/1/` | CLIENTE | Intentar eliminar un plan existente. | `403 Forbidden` | `403 Forbidden` *(Tras corrección)* | ✅ **Aprobado** |
| **TP4-05** | Negocio | `/api/auth/register/` | ANÓNIMO | Registrar usuario con email duplicado. | `400 Bad Request` | `400 Bad Request` | ✅ **Aprobado** |
| **TP4-06** | Negocio | `/api/planes-clientes/` | CLIENTE | Enviar compra de plan con campos vacíos. | `400 Bad Request` | `400 Bad Request` | ✅ **Aprobado** |
| **TP4-07** | Negocio | `/api/planes/` | ADMIN | Intentar crear un plan con precio negativo. | `400 Bad Request` | `400 Bad Request` | ✅ **Aprobado** |

---

## 3. Flujo End-to-End (E2E) Verificado

Se completó exitosamente el circuito principal de interacción del usuario cliente:

1. **Autenticación (`POST /api/auth/login/`):**  
   - Credenciales válidas de cliente $\rightarrow$ Respuesta `200 OK` con token de acceso JWT / Bearer.
2. **Búsqueda de Planes (`GET /api/planes/?estado=activo`):**  
   - Consulta filtrada de planes disponibles $\rightarrow$ Respuesta `200 OK` listando el catálogo vigente.
3. **Compra / Suscripción (`POST /api/planes-clientes/`):**  
   - Envío del ID de plan seleccionado $\rightarrow$ Respuesta `201 Created` registrando la contratación de forma exitosa.
4. **Verificación de Contratación (`GET /api/planes-clientes/`):**  
   - Consulta del historial de planes adquiridos por el cliente autenticado $\rightarrow$ Respuesta `200 OK` mostrando la suscripción activa.

---

## 4. Conclusiones y Correcciones Aplicadas
Durante la fase de pruebas exploratorias se detectó que el endpoint de planes permitía escrituras de usuarios con rol `Cliente`. Mediante el flujo de Pull Request se implementó el permiso personalizado **`IsAdminOrReadOnly`**, el cual blindó correctamente los métodos de escritura (`POST`, `PUT`, `DELETE`) dejando exclusivamente el acceso de lectura (`GET`) para usuarios autenticados generales. El sistema se encuentra estable, seguro y listo para los siguientes módulos del proyecto.