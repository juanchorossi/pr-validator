# PR Validator with AI

Este proyecto es una demostración de cómo usar GitHub Actions y OpenAI para automatizar la validación de Pull Requests según criterios específicos.

## 🧪 Demo

Para probar el validador:

1. Crea un nuevo PR
2. El validador se ejecutará automáticamente
3. Revisa los comentarios del bot

## 🎯 Objetivo

Automatizar la revisión de PRs verificando:

- Organización del código
- Documentación requerida
- Cobertura de tests
- Formato de commits
- Cumplimiento de estándares de UI/UX

## 🛠 Tecnologías

- GitHub Actions
- OpenAI GPT-4
- Node.js
- Next.js 14+

## ⚙️ Configuración

1. **Secretos Requeridos**

Configura en GitHub (Settings > Secrets and variables > Actions):

- `OPENAI_API_KEY`: Tu API key de OpenAI

2. **Archivos de Configuración**

El proyecto usa tres archivos principales:

- `.github/workflows/pr-validator.yml`: Define el GitHub Action
- `.github/scripts/validate-pr.js`: Script que realiza la validación
- `.github/pr-validator-config.json`: Configura los criterios de validación

3. **Template de PR**

El validador usa el mismo formato que el template de PR definido en `.github/pull_request_template.md`

## 🚀 Funcionamiento

1. Cuando se crea o actualiza un PR, el GitHub Action se dispara automáticamente
2. El script analiza:
   - Los archivos modificados
   - El título y descripción del PR
   - El cumplimiento de los criterios configurados
3. GPT-4 genera un reporte detallado
4. El reporte se comenta automáticamente en el PR

## 📋 Criterios de Validación

### Organización del Código

- Componentes en directorios correctos
- No usar valores hex hardcodeados
- Fuentes centralizadas en tailwind.config.js

### Documentación

- CHANGELOG.md actualizado
- Variables de entorno documentadas
- URLs de Figma incluidas
- Pasos de prueba documentados

### Testing

- Tests que fallan si los cambios no están presentes
- Cobertura de tests adecuada

### Commits

- Formato: `<type>(<scope>): <description>`
- Tipos válidos: feat, fix, docs, style, refactor, test, chore

## 🤖 Personalización

Puedes modificar los criterios de validación editando `.github/pr-validator-config.json`

## 📝 Ejemplo de Uso

1. Crea un nuevo PR
2. El validador se ejecutará automáticamente
3. Revisa los comentarios del bot en tu PR
4. Corrige los problemas señalados
5. El validador se ejecutará nuevamente al actualizar el PR

## 🔍 Debugging

Si el validador falla, revisa:

1. Los logs en la pestaña Actions de GitHub
2. La configuración de los secretos
3. Los permisos del GitHub Action

## 📄 Licencia

MIT
