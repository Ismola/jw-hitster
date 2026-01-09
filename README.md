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

### Traducciones

Añade o modifica traducciones en `messages/es.json` y `messages/en.json`.

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## 🙏 Créditos

- Inspirado en [Hitster Game](https://hitstergame.com)
- Logos de JW.org y WOL utilizados con fines educativos
- Datos cronológicos basados en publicaciones de jw.org

## 📋 TODOs

<!-- Añade aquí las tareas pendientes y mejoras futuras -->

* TODO Añadir muuuuuchas mñas tarjetas a info.json
* TODO Terminar de cambiar los textos para que siempre se cogan de los archivos json
* TODO Mejorar diseño
* TODO Añadir animaciones
* Cuando se termina una aprtida el cartel de has ganado o perdido desaparece
