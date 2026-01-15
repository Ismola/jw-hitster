# jw-hitster

Juego Bíblico de línea de tiempo basado en [Hitster Game](https://hitstergame.com), diseñado para ayudar a aprender cronología bíblica de forma interactiva y divertida.

**DEMO:** [jw-hitster.ismola.dev](https://jw-hitster.ismola.dev/)

[![Deploy](https://github.com/Ismola/jw-hitster/actions/workflows/deploy.yml/badge.svg)](https://github.com/Ismola/jw-hitster/actions/workflows/deploy.yml)

## 📖 Descripción

JW Hitster es un juego educativo que permite ordenar eventos bíblicos cronológicamente. Los jugadores deben colocar cartas de eventos en la posición correcta de la línea de tiempo, desde los patriarcas hasta eventos del primer siglo.

### Características principales

- 🎮 **Mecánica de juego tipo Hitster**: Arrastra y suelta cartas para ordenarlas cronológicamente
- 📱 **Totalmente responsive**: Funciona perfectamente en móviles, tablets y desktop
- 🌓 **Tema claro/oscuro**: Cambia automáticamente según las preferencias del sistema
- 🌍 **Multiidioma**: Soporta español e inglés
- 📚 **Referencias bibliográficas**: Cada evento incluye enlaces a jw.org y wol.jw.org
- 🎴 **Tarjetas con animación 3D**: Las cartas colocadas muestran detalles al hacer hover/click
- 🎯 **Formato BC/AD**: Las fechas se muestran en formato "antes de Cristo" / "después de Cristo"

## 🚀 Tecnologías

- **Framework**: [Next.js 15](https://nextjs.org/) con App Router
- **UI**: React 18+ con TypeScript
- **Estilos**: Tailwind CSS con soporte de tema oscuro
- **Internacionalización**: Sistema de traducciones con JSON
- **Despliegue**: GitHub Pages con GitHub Actions

## 💻 Desarrollo

### Requisitos previos

- Node.js 18+
- npm o yarn

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/Ismola/jw-hitster.git

# Instalar dependencias
cd jw-hitster
npm install

# Ejecutar en desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

### Estructura del proyecto

```
jw-hitster/
├── app/
│   ├── [locale]/          # Rutas internacionalizadas
│   └── components/        # Componentes React
│       ├── CardBothSides.tsx    # Tarjeta con flip animation
│       ├── CardDataOnly.tsx     # Tarjeta actual a colocar
│       ├── GameBoard.tsx        # Lógica principal del juego
│       ├── Header.tsx           # Barra de navegación
│       ├── LanguageSwitcher.tsx # Selector de idioma
│       └── ThemeSwitcher.tsx    # Selector de tema
├── config/
│   ├── info.json          # Datos de eventos bíblicos
│   ├── routes.ts          # Configuración de rutas
│   └── text.ts            # Sistema de traducciones
├── messages/              # Archivos de traducción
│   ├── en.json
│   └── es.json
└── public/                # Recursos estáticos (SVG logos)
```

### Añadir nuevos eventos

Edita el archivo `config/info.json`:

```json
{
  "date": "-1513",
  "event": {
    "es": "Éxodo de Egipto",
    "en": "Exodus from Egypt"
  },
  "bible_reference": {
    "es": "Éxodo 12:31-42",
    "en": "Exodus 12:31-42"
  },
  "bibliografy": {
    "es": ["https://www.jw.org/es/..."],
    "en": ["https://www.jw.org/en/..."]
  }
}
```

## 📦 Build y Deploy

```bash
# Generar build de producción
npm run build

# Exportar sitio estático
npm run export
```

El proyecto se despliega automáticamente en GitHub Pages mediante GitHub Actions cuando se hace push a la rama `main`.

## 🎨 Personalización

### Temas de color

Los colores se definen en `tailwind.config.ts` y usan CSS variables para soporte de tema oscuro automático.

#### Dark

Textos:
> #e9e5ff

Fondos:
  Primary (color oscuro):
  > #11224E
  Secondary (color claro):
  > bg-zinc-100

#### Light

Textos:
> #11224E

Fondos:
  Primary (color claro):
  > #e9e5ff
  Secondary (color oscuro):
  > #bg-zinc-700

Traslúcido:
> text-(--text-light) dark:text-(--text-dark) backdrop-blur-xl  bg-(--text-light)/10 dark:bg-(--text-dark)/10
> hover:bg-(--text-light)/40 dark:hover:bg-(--text-dark)/40

### Traducciones

Añade o modifica traducciones en `messages/es.json` y `messages/en.json`.

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## 🙏 Créditos

### Desarrollado por

- [Ismola](https://github.com/Ismola)

### Agradecimientos

Este proyecto fue posible gracias a las siguientes herramientas y recursos:

- **[JW.org](https://www.jw.org/)** - Inspiración, contenido bíblico y datos cronológicos
- **[ReactBits](https://www.reactbits.dev/)** - Componentes animados y efectos visuales
- **[Tailwind CSS](https://tailwindcss.com/)** - Framework de estilos
- **[SVG Repo](https://www.svgrepo.com/)** - Iconos y recursos gráficos
- **[Hitster Game](https://hitstergame.com)** - Inspiración para la mecánica de juego
