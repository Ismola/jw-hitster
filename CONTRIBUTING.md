# 🤝 Contribuyendo a JW Hitster

¡Gracias por tu interés en contribuir a JW Hitster! Este proyecto es una comunidad dedicada a crear una experiencia educativa divertida y enriquecedora sobre la cronología bíblica. Tu ayuda es invaluable.

## 🎯 Formas de Contribuir

### 1. 📚 Agregar Nuevas Tarjetas (info.json)

La base de datos de eventos está en [`config/info.json`](config/info.json). Este es probablemente el área donde más podemos crecer.

#### Estructura de una tarjeta

```json
{
    "date": "-4026",
    "event": {
        "es": "Evento en español",
        "en": "Event in English"
    },
    "bible_reference": {
        "es": "Génesis 1:1",
        "en": "Genesis 1:1"
    },
    "bibliografy": {
        "es": [
            "https://www.jw.org/es/biblioteca/...",
            "https://www.jw.org/es/biblioteca/..."
        ],
        "en": [
            "https://www.jw.org/en/library/...",
            "https://www.jw.org/en/library/..."
        ]
    }
}
```

#### Requisitos

- ✅ **Fechas precisas**: Usar el formato "-XXXX" para años antes de Cristo y sin negativo para años después
- ✅ **Traducciones**: Proporcionar tanto la versión en español como en inglés
- ✅ **Referencias bíblicas**: Indicar el libro, capítulo y versículo
- ✅ **Referencias jw.org**: Incluir enlaces a jw.org y wol.jw.org que respalden el evento
- ✅ **Precisión histórica**: Asegurarse de que la información sea confiable y basada en la Biblia

#### Sugerencias para nuevas tarjetas

- 🕰️ Eventos importantes de los patriarcas
- 👑 Reinados de reyes notables
- 🏛️ Construcción del templo de Salomón
- ⛓️ Cautividad babilónica
- ✝️ Ministerio de Jesús y apóstoles
- 📖 Escritura de los evangelios
- 🗣️ Eventos registrados en Hechos

### 2. ✏️ Correcciones Gramaticales y Ortografía

Si encuentras errores de:

- Ortografía
- Gramática
- Puntuación
- Traducción incorrecta
- Inconsistencias de terminología

¡Por favor corrígelos! La claridad y la precisión son importantes para una buena experiencia educativa.

**Dónde buscar errores:**

- `config/info.json` - Textos de eventos
- `messages/es.json` y `messages/en.json` - Interfaz de usuario
- `README.md` y `CONTRIBUTING.md` - Documentación

### 3. 🔗 Agregar Referencias Bíblicas a Tarjetas Existentes

Muchas tarjetas podrían beneficiarse de referencias adicionales a jw.org:

- Ampliar los enlaces de `bibliografy`
- Agregar referencias a publicaciones de Watchtower
- Incluir enlaces a "Equipados para Enseñar"
- Añadir referencias a cronologías oficiales en wol.jw.org

### 4. 🛠️ Mejoras de Código

Tenemos varias áreas donde el código podría mejorarse:

#### Áreas de enfoque

- **Rendimiento**: Optimización de animaciones y carga de componentes
- **Accesibilidad**: Mejorar soporte ARIA, contraste, navegación por teclado
- **Testing**: Agregar pruebas unitarias e integración
- **Componentes**: Refactorizar componentes reutilizables
- **TypeScript**: Mejorar tipado y validación
- **Mobile**: Optimizar experiencia en dispositivos pequeños
- **Internacionalización**: Extender a más idiomas

### 5. 💡 Nuevas Ideas

¿Tienes una idea genial? Nos encantaría escucharla:

- Nuevas mecánicas de juego
- Características educativas
- Mejoras de UX/UI
- Nuevos temas visuales
- Gamificación (puntuaciones, logros)
- Sistema de dificultad progresivo

## 🚀 Cómo Contribuir

### Paso 1: Fork y Clonar

```bash
# 1. Fork el repositorio desde GitHub
# 2. Clona tu fork
git clone https://github.com/TU-USUARIO/jw-hitster.git
cd jw-hitster

# 3. Crea una rama para tu contribución
git checkout -b feature/descripcion-cambio
```

### Paso 2: Realiza tus cambios

```bash
# Instala dependencias
npm install

# Ejecuta el servidor de desarrollo
npm run dev

# Visita http://localhost:3000 para ver los cambios
```

### Paso 3: Verifica tu código

```bash
# Ejecuta linter
npm run lint

# Verifica que no haya errores
npm run build
```

### Paso 4: Commit y Push

```bash
git add .
git commit -m "feat: descripción clara del cambio"
# Ejemplos:
# feat: agregar evento de construcción del templo
# fix: corregir ortografía en evento de Moisés
# docs: mejorar instrucciones de contribución

git push origin feature/descripcion-cambio
```

### Paso 5: Crea un Pull Request

- Ve a tu repositorio fork en GitHub
- Haz clic en "New Pull Request"
- Proporciona una descripción clara de tus cambios
- Explica por qué estos cambios son importantes

## 📝 Formato de Commits

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

```
<tipo>(<scope>): <descripción corta>

<descripción más detallada si es necesario>

<referencias a issues si aplica>
```

**Tipos principales:**

- `feat`: Nueva característica o tarjeta
- `fix`: Corrección de errores
- `docs`: Cambios en documentación
- `style`: Cambios que no afectan la lógica (formato, etc)
- `refactor`: Refactorización de código
- `test`: Agregar o actualizar tests
- `chore`: Cambios en configuración o dependencias

**Ejemplos:**

```
feat(cards): agregar evento de Pentecostés

Añade la tarjeta del evento de Pentecostés (33 EC) 
con referencias a Hechos 2:1-4 y wol.jw.org

feat(i18n): agregar soporte para francés

fix(cards): corregir ortografía en evento de Moisés

docs(contributing): actualizar instrucciones
```

## 🎓 Pautas para Contribuciones de Contenido

### Para agregar nuevas tarjetas

1. ✅ Verificar que la fecha sea históricamente precisa según la Biblia
2. ✅ Incluir referencias bíblicas completas (Libro Capítulo:Versículos)
3. ✅ Proporcionar tanto la versión en español como en inglés
4. ✅ Agregar al menos 2 referencias de jw.org
5. ✅ Mantener coherencia con el nivel de detalle de otras tarjetas
6. ✅ Revisar que no exista una tarjeta similar ya en info.json

### Para correcciones gramaticales

1. ✅ Ser específico sobre el error encontrado
2. ✅ Proporcionar la corrección sugerida
3. ✅ Explicar el motivo si no es evidente
4. ✅ Revisar todo el documento para errores similares

### Para mejoras de código

1. ✅ Incluir comentarios explicativos para cambios complejos
2. ✅ Mantener la consistencia de estilo con el código existente
3. ✅ Actualizar TypeScript types si es necesario
4. ✅ Probar en diferentes tamaños de pantalla
5. ✅ Verificar que funcione en modo claro y oscuro

## 🤔 Preguntas Frecuentes

**¿Necesito estar familiarizado con Next.js?**
No necesariamente. Para agregar tarjetas o corregir errores, solo necesitas conocimiento básico de JSON. Para mejoras de código, ayuda si tienes experiencia con React y TypeScript.

**¿Cuánto tiempo tarda revisar un PR?**
Generalmente entre 2-7 días, dependiendo de la complejidad.

**¿Puedo empezar con algo pequeño?**
¡Por supuesto! Las correcciones pequeñas también son valiosas. Nos gustan los PRs incremental.

**¿Hay algún evento o tema prohibido?**
Mantenemos el contenido educativo, respetuoso y basado en la Biblia. Evita contenido ofensivo, antirreligioso o políticamente divisivo.

**¿Necesito crear un issue antes de un PR?**
Para cambios pequeños (correcciones, agregar 1-2 tarjetas), no es necesario. Para cambios significativos (nuevas características, refactorización mayor), es recomendable crear un issue primero para discutir.

## 💬 Comunidad

- 📧 ¿Preguntas? Abre un [Issue](https://github.com/Ismola/jw-hitster/issues)
- 💭 ¿Ideas? Comparte en [Discussions](https://github.com/Ismola/jw-hitster/discussions)
- 🐛 ¿Encontraste un bug? Reporta en [Issues](https://github.com/Ismola/jw-hitster/issues)

---

## 📜 Licencia

Al contribuir, aceptas que tu contribución será licenciada bajo la misma licencia que el proyecto.

---

¡Gracias por hacer de JW Hitster un mejor proyecto! 🙏✨
