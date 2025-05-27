# Galarraga LLC - Sitio Web

Sitio web corporativo para Galarraga LLC, una empresa especializada en servicios de salud y bienestar.

## Características

- Diseño moderno y responsivo
- Soporte para múltiples idiomas (Español e Inglés)
- Secciones principales:
  - Hero con llamada a la acción
  - Servicios ofrecidos
  - Cómo ayudamos
  - Testimonios
  - Acerca de nosotros
  - Formulario de contacto
  - Suscripción a newsletter
  - Footer con información de contacto

## Tecnologías Utilizadas

- React.js
- CSS moderno con variables personalizadas
- Diseño responsivo
- Optimizado para SEO
- Compatible con todos los navegadores modernos
- Desplegado con GitHub Pages

## Requisitos Previos

- Node.js (versión 14 o superior)
- npm o yarn
- Cuenta de GitHub

## Instalación

1. Clonar el repositorio:
```bash
git clone [URL_DEL_REPOSITORIO]
```

2. Instalar dependencias:
```bash
npm install
# o
yarn install
```

3. Iniciar el servidor de desarrollo:
```bash
npm start
# o
yarn start
```

## Despliegue con GitHub Pages

1. Agregar la dependencia `gh-pages` al proyecto:
```bash
npm install --save-dev gh-pages
# o
yarn add --dev gh-pages
```

2. Agregar los siguientes scripts en el `package.json`:
```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d build"
  }
}
```

3. Configurar el repositorio:
   - Ir a Settings > Pages
   - En "Source", seleccionar la rama `gh-pages`
   - Guardar la configuración

4. Desplegar el sitio:
```bash
npm run deploy
# o
yarn deploy
```

El sitio estará disponible en: `https://[tu-usuario].github.io/[nombre-del-repo]`

## Estructura del Proyecto

```
src/
  ├── components/     # Componentes React
  ├── translations/   # Archivos de traducción
  ├── assets/        # Imágenes y recursos
  ├── App.js         # Componente principal
  ├── App.css        # Estilos globales
  └── index.js       # Punto de entrada
```

## Características de Diseño

- Paleta de colores personalizada con variables CSS
- Diseño responsivo para todos los dispositivos
- Animaciones suaves y transiciones
- Tipografía optimizada para legibilidad
- Iconos modernos y consistentes

## Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## Contacto

Para más información sobre el proyecto, por favor contactar a través de:
- Email: [EMAIL]
- Teléfono: [TELÉFONO]
- Sitio web: [URL]

## Licencia

Este proyecto es privado y propiedad de Galarraga LLC. Todos los derechos reservados.
