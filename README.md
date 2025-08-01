# 🏥 Galarraga LLC - Clínica Pediátrica

[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![License](https://img.shields.io/badge/License-Private-red.svg)](LICENSE)
[![Deploy Status](https://img.shields.io/badge/Deploy-GitHub%20Pages-green.svg)](https://alexis910505.github.io/galarragallc/)
[![Language](https://img.shields.io/badge/Language-ES%20%7C%20EN-orange.svg)](https://alexis910505.github.io/galarragallc/)

> Sitio web profesional para la clínica de la Dra. Yolanda A. Galarraga Ramirez MD PA

## 🌐 Demo en Vivo

**Visita nuestro sitio:** [https://alexis910505.github.io/galarragallc/](https://alexis910505.github.io/galarragallc/)

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Instalación](#-instalación)
- [Desarrollo Local](#-desarrollo-local)
- [Despliegue](#-despliegue)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Contribución](#-contribución)
- [Contacto](#-contacto)

## ✨ Características

### 🎨 Diseño y UX
- **Diseño moderno y responsivo** - Optimizado para todos los dispositivos
- **Interfaz bilingüe** - Soporte completo para Español e Inglés
- **Animaciones suaves** - Transiciones elegantes y profesionales
- **Accesibilidad** - Cumple con estándares de accesibilidad web

### 🏥 Contenido Médico
- **Sección de Servicios** - Información detallada de servicios pediátricos
- **Certificaciones AAAHC** - Muestra de certificaciones profesionales
- **Testimonios** - Experiencias de pacientes y familias
- **Formulario de Contacto** - Comunicación directa con la clínica

### 🚀 Funcionalidades Técnicas
- **SEO Optimizado** - Mejor posicionamiento en buscadores
- **Carga Rápida** - Optimización de rendimiento
- **Navegación Intuitiva** - Experiencia de usuario fluida
- **Compatibilidad Total** - Funciona en todos los navegadores modernos

## 🛠️ Tecnologías

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **React.js** | 18.2.0 | Framework principal |
| **CSS3** | - | Estilos y animaciones |
| **JavaScript ES6+** | - | Lógica de aplicación |
| **GitHub Pages** | - | Hosting y despliegue |
| **npm** | - | Gestión de dependencias |

## 📦 Instalación

### Prerrequisitos

- **Node.js** (versión 14 o superior)
- **npm** o **yarn**
- **Git**

### Pasos de Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/Alexis910505/galarragallc.git
   cd galarragallc
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   # o
   yarn install
   ```

3. **Iniciar servidor de desarrollo**
   ```bash
   npm start
   # o
   yarn start
   ```

4. **Abrir en el navegador**
   ```
   http://localhost:3000
   ```

## 🚀 Desarrollo Local

### Comandos Disponibles

```bash
# Iniciar servidor de desarrollo
npm start

# Construir para producción
npm run build

# Ejecutar tests
npm test

# Desplegar a GitHub Pages
npm run deploy
```

### Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
REACT_APP_SITE_URL=https://alexis910505.github.io/galarragallc
REACT_APP_CONTACT_EMAIL=contact@galarragallc.com
```

## 🌐 Despliegue

### GitHub Pages (Automático)

El sitio se despliega automáticamente en cada push a la rama `main`.

**URL de producción:** [https://alexis910505.github.io/galarragallc/](https://alexis910505.github.io/galarragallc/)

### Despliegue Manual

```bash
# Construir para producción
npm run build

# Desplegar
npm run deploy
```

## 📁 Estructura del Proyecto

```
galarragallc/
├── public/                 # Archivos públicos
│   ├── index.html         # HTML principal
│   ├── favicon.ico        # Icono del sitio
│   └── images/            # Imágenes estáticas
├── src/                   # Código fuente
│   ├── components/        # Componentes React
│   │   ├── Certifications.js
│   │   └── FeaturedTopics.js
│   ├── constants/         # Constantes de la aplicación
│   ├── utils/             # Utilidades y helpers
│   ├── translations.js    # Traducciones i18n
│   ├── App.js            # Componente principal
│   ├── App.css           # Estilos globales
│   └── index.js          # Punto de entrada
├── package.json           # Dependencias y scripts
└── README.md             # Documentación
```

## 🔧 Configuración

### Personalización de Colores

Los colores principales se definen en `src/App.css`:

```css
:root {
  --primary-color: #2563eb;
  --secondary-color: #1e40af;
  --accent-color: #f59e0b;
  --text-color: #1f2937;
  --background-color: #ffffff;
}
```

### Traducciones

Las traducciones se gestionan en `src/translations.js`:

```javascript
const translations = {
  es: {
    // Contenido en español
  },
  en: {
    // Contenido en inglés
  }
};
```

## 🤝 Contribución

### Guías de Contribución

1. **Fork el proyecto**
   ```bash
   git clone https://github.com/tu-usuario/galarragallc.git
   ```

2. **Crear rama de feature**
   ```bash
   git checkout -b feature/NuevaCaracteristica
   ```

3. **Realizar cambios**
   - Sigue las convenciones de código
   - Añade tests si es necesario
   - Actualiza documentación

4. **Commit y Push**
   ```bash
   git add .
   git commit -m 'feat: añadir nueva característica'
   git push origin feature/NuevaCaracteristica
   ```

5. **Crear Pull Request**
   - Describe los cambios realizados
   - Incluye screenshots si aplica
   - Espera la revisión del equipo

### Convenciones de Código

- **Nombres de archivos:** PascalCase para componentes
- **Variables:** camelCase
- **Constantes:** UPPER_SNAKE_CASE
- **Comentarios:** En español para consistencia

## 📞 Contacto

### Información de la Clínica

- **Dra. Yolanda A. Galarraga Ramirez MD PA**
- **Especialidad:** Pediatría
- **Sitio Web:** [https://alexis910505.github.io/galarragallc/](https://alexis910505.github.io/galarragallc/)

### Desarrollo

- **Desarrollado por:** Centralized Code LLC
- **Soporte técnico:** [contacto@centralizedcode.com](mailto:contacto@centralizedcode.com)

## 📄 Licencia

Este proyecto es **privado** y propiedad de **Galarraga LLC**. Todos los derechos reservados.

---

<div align="center">

**Desarrollado con ❤️ por Centralized Code LLC**

[![Centralized Code](https://img.shields.io/badge/Developed%20by-Centralized%20Code%20LLC-blue.svg)](https://centralizedcode.com)

</div>