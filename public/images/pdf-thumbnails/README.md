# Miniaturas de PDFs

Esta carpeta contiene las miniaturas (thumbnails) de los PDFs que se muestran en la sección de infografías.

## Archivos requeridos:

1. `lead-screening-thumb.jpg` - Miniatura de "Lead Screening Flyer"
2. `patients-bill-thumb.jpg` - Miniatura de "Patients Bill of Rights"
3. `vip-pcmh-thumb.jpg` - Miniatura de "VIP PCMH Flyer"
4. `patient-medical-home-thumb.jpg` - Miniatura de "Patient Medical Home"

## Cómo crear las miniaturas:

### Opción 1: Adobe Acrobat Reader
1. Abre cada PDF
2. Ve a Archivo → Exportar a → Imagen → JPG
3. Selecciona "Páginas actuales"
4. Exporta solo la primera página
5. Redimensiona la imagen a aproximadamente 180-200px de ancho
6. Guarda como el nombre correspondiente (ej: lead-screening-thumb.jpg)

### Opción 2: Herramientas online
- Visita https://www.ilovepdf.com/es/pdf-a-jpg
- Sube el PDF
- Convierte solo la primera página
- Descarga y redimensiona a 180-200px de ancho

### Opción 3: Usando ImageMagick (línea de comandos)
```bash
# Convierte la primera página del PDF a JPG
magick "Lead Screening Flyer (1).pdf[0]" -quality 85 -resize 200x lead-screening-thumb.jpg
magick "Patients Bill of Right and Responsibility-Flyer (1).pdf[0]" -quality 85 -resize 200x patients-bill-thumb.jpg
magick "VIP PCMH Flyer (1).pdf[0]" -quality 85 -resize 200x vip-pcmh-thumb.jpg
magick "WHAT IS A PATIENT MEDICAL HOME-letter size (1).pdf[0]" -quality 85 -resize 200x patient-medical-home-thumb.jpg
```

### Dimensiones recomendadas:
- **Ancho**: 180-200px
- **Alto**: Variable (se ajustará automáticamente)
- **Formato**: JPG
- **Calidad**: 85% es suficiente

## Ubicación de los PDFs originales:
Los PDFs se encuentran en: `public/pdfs/`

