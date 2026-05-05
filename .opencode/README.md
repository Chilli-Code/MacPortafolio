# Agentes de OpenCode - MacPortafolio

Este directorio contiene agentes personalizados para el proyecto MacPortafolio.

## ¿Qué son los agentes?

Los agentes son extensiones que te ayudan con tareas específicas del proyecto. Se invocan usando el comando `/` seguido del nombre del agente.

## Agentes Disponibles

### 1. Debug Agent (`/debug`)
Especialista en diagnosticar y resolver errores del proyecto.

#### ¿Cómo usarlo?

Simply describe your error and the agent will analyze it:

```
/debug When I try to accept a task, I get "GET http://localhost:3001/tasks/523f 404"
```

#### ¿Qué hace el agente?

1. **Analiza** el tipo de error (network, JS, React, DB)
2. **Investiga** en el código fuente relevante
3. **Identifica** la causa raíz
4. **Propone** una solución profesional
5. **Implementa** la fix (con tu aprobación)

#### Ejemplos de uso

```bash
/debug My app shows "TypeError: task.tags.map is not a function"
```

```bash
/debug Login returns 401 even with correct credentials
```

```bash
/debug PATCH /tasks/3cd5 returns "Cannot PATCH /tasks/3cd5"
```

## Estructura del Proyecto

```
.opencode/
├── agents/
│   └── debug-agent.md    # Agente de debugging
├── README.md             # Este archivo
```

## Tips para mejores resultados

1. **Sé específico**: Incluye el mensaje de error completo
2. **Proporciona contexto**: ¿Qué acción estabas realizando?
3. **Comparte el stack trace**: Si está disponible, inclúyelo
4. **Indica el comportamiento esperado**: ¿Qué debería pasar?

## Ejemplo de sesión

```
Usuario: /debug I'm getting "Cannot PATCH /tasks/523f" when submitting a task

Agente: ## 🔍 Análisis del Error
- Tipo: Network/Backend
- Causa raíz: La ruta PATCH /tasks/:id no está definida en index-fixed.js

## 📁 Archivos involucrados
- server/src/index-fixed.js - rutas de tasks

## ✅ Solución propuesta
Agregar las rutas CRUD faltantes para /tasks/:id

[¿Procedo con la implementación?]
```

---

*Creado para MacPortafolio v1.1*