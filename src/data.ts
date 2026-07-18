/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PortfolioItem } from "./types";

export const initialPortfolioItems: PortfolioItem[] = [
  {
    id: "vid-1",
    title: "Cinemática Natural - Amanecer en el Valle",
    description: "Toma de dron en alta definición capturando la niebla matutina disipándose sobre las colinas.",
    type: "video",
    url: "https://assets.mixkit.co/videos/preview/mixkit-forest-stream-in-the-sunlight-529-large.mp4",
    category: "Videos carrusel",
    layout: "carousel",
    createdAt: "2026-07-15T08:00:00Z"
  },
  {
    id: "vid-2",
    title: "Cámara Lenta - Rompiente de Ola",
    description: "Estudio dinámico del movimiento del agua marina en luz dorada tardía.",
    type: "video",
    url: "https://assets.mixkit.co/videos/preview/mixkit-waves-breaking-in-the-ocean-1527-large.mp4",
    category: "Videos carrusel",
    layout: "carousel",
    createdAt: "2026-07-14T09:30:00Z"
  },
  {
    id: "vid-3",
    title: "Abstracción Lumínica - Láseres Neón",
    description: "Secuencia conceptual de luces láser interactivas para el lanzamiento de una marca tecnológica.",
    type: "video",
    url: "https://assets.mixkit.co/videos/preview/mixkit-abstract-laser-lights-background-41444-large.mp4",
    category: "Videos carrusel",
    layout: "carousel",
    createdAt: "2026-07-13T12:00:00Z"
  },
  {
    id: "pic-1",
    title: "Arquitectura Minimalista - Residencia Alto",
    description: "Vista exterior de la fachada principal destacando líneas puras, concreto visto y amplios ventanales en el atardecer.",
    type: "image",
    url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    category: "Fotos carrusel",
    layout: "carousel",
    createdAt: "2026-07-12T10:00:00Z"
  },
  {
    id: "pic-2",
    title: "Espacios Integrados - Salón Principal",
    description: "Perspectiva de diseño interior combinando tonos neutros, maderas claras e iluminación natural indirecta.",
    type: "image",
    url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
    category: "Fotos carrusel",
    layout: "carousel",
    createdAt: "2026-07-11T11:15:00Z"
  },
  {
    id: "pic-3",
    title: "Estudio de Luz - Habitación Nórdica",
    description: "Detalle zen donde la luz de la mañana incide sobre materiales textiles de lino orgánico.",
    type: "image",
    url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80",
    category: "Fotos carrusel",
    layout: "carousel",
    createdAt: "2026-07-10T14:40:00Z"
  },
  // Proyecto A - Residencia Casa del Bosque (Galería de Fotos)
  {
    id: "projA-1",
    title: "Acceso Principal - Residencia Bosque",
    description: "Detalle de la transición entre la naturaleza y la estructura de acero con peldaños flotantes de piedra.",
    type: "image",
    url: "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1200&q=80",
    category: "Proyecto A",
    layout: "gallery",
    createdAt: "2026-07-09T09:00:00Z"
  },
  {
    id: "projA-2",
    title: "Cocina de Autor - Residencia Bosque",
    description: "Cocina abierta de isla central revestida en granito oscuro, contrastada con vigas de madera nativa.",
    type: "image",
    url: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80",
    category: "Proyecto A",
    layout: "gallery",
    createdAt: "2026-07-09T10:00:00Z"
  },
  {
    id: "projA-3",
    title: "Estudio Panorámico - Residencia Bosque",
    description: "Espacio de trabajo en casa con escritorio integrado que ofrece una vista inmersiva hacia el bosque templado.",
    type: "image",
    url: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80",
    category: "Proyecto A",
    layout: "gallery",
    createdAt: "2026-07-09T11:00:00Z"
  },
  {
    id: "projA-4",
    title: "Terraza Exterior - Residencia Bosque",
    description: "Zona de fogón exterior integrada a nivel de suelo para veladas cálidas en medio de los árboles.",
    type: "image",
    url: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=1200&q=80",
    category: "Proyecto A",
    layout: "gallery",
    createdAt: "2026-07-09T12:00:00Z"
  },
  // Proyecto B - Campaña Visual Studio (Carrusel)
  {
    id: "projB-1",
    title: "Detrás de Escena - Grabación campaña",
    description: "Configuración de tres puntos de iluminación en set de filmación de alta gama.",
    type: "image",
    url: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1200&q=80",
    category: "Proyecto B",
    layout: "carousel",
    createdAt: "2026-07-08T15:00:00Z"
  },
  {
    id: "projB-2",
    title: "Sesión Fotográfica de Producto",
    description: "Tomas macro en plano cenital capturando la refracción de líquidos sobre cristalería fina.",
    type: "image",
    url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80",
    category: "Proyecto B",
    layout: "carousel",
    createdAt: "2026-07-08T16:00:00Z"
  }
];

export const developerManualMarkdown = `## 🛠️ MANUAL PARA EL DESARROLLADOR: Integración con Sanity.io

Este manual detalla paso a paso cómo conectar este frontend de React con el sistema de gestión de contenidos headless de **Sanity.io**, permitiendo que los cambios que haga tu cliente se reflejen en tiempo real.

---

### Paso 1: Inicializar Sanity.io desde la Terminal
Ejecuta el siguiente comando en la raíz de tu proyecto para configurar el repositorio de Sanity (o dentro de una subcarpeta como \`/cms\`):

\`\`\`bash
# Crear un nuevo proyecto de Sanity
npm create sanity@latest
\`\`\`

Durante el proceso de configuración:
1. Inicia sesión o crea una cuenta en Sanity.io.
2. Selecciona **"Create new project"**.
3. Nombra tu dataset (por defecto: \`production\`).
4. Selecciona **"Clean project"** (sin plantillas) o **"Blog"** para tener una estructura base.
5. Elige si usar TypeScript (altamente recomendado).

---

### Paso 2: Definir el Esquema del Contenido
En tu carpeta de Sanity, navega hasta \`/schemas\` o \`/schemaTypes\` y crea un archivo llamado \`portfolioItem.ts\` (o \`portfolioItem.js\`). Define el esquema que coincida con el portafolio:

\`\`\`typescript
// portfolioItem.ts
import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'portfolioItem',
  title: 'Item de Portafolio',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Título del Proyecto',
      type: 'string',
      validation: Rule => Rule.required().min(5).max(100),
    }),
    defineField({
      name: 'description',
      title: 'Descripción',
      type: 'text',
      description: 'Una descripción atractiva del proyecto o archivo multimedia.',
    }),
    defineField({
      name: 'type',
      title: 'Tipo de Archivo',
      type: 'string',
      options: {
        list: [
          { title: 'Imagen', value: 'image' },
          { title: 'Video', value: 'video' },
        ],
        layout: 'radio',
      },
      initialValue: 'image',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Clasificación / Categoría',
      type: 'string',
      description: 'Ej: "Videos carrusel", "Fotos carrusel", "Proyecto A" o "Proyecto B". Asegúrate de escribirlo idéntico.',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'mediaFile',
      title: 'Archivo Multimedia',
      type: 'file',
      description: 'Sube la foto (JPG/PNG) o el video (MP4/MOV).',
      options: {
        accept: 'image/*,video/*'
      },
    }),
    defineField({
      name: 'externalUrl',
      title: 'URL Externa (Opcional)',
      type: 'url',
      description: 'Alternativa si prefieres enlazar un archivo alojado externamente (Vimeo, YouTube directo, etc.).',
    }),
    defineField({
      name: 'layout',
      title: 'Formato de Visualización',
      type: 'string',
      options: {
        list: [
          { title: 'Carrusel Horizontal', value: 'carousel' },
          { title: 'Galería en Cuadrícula (Bento Grid)', value: 'gallery' },
        ],
        layout: 'dropdown',
      },
      initialValue: 'gallery',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'createdAt',
      title: 'Fecha de Publicación',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    })
  ]
})
\`\`\`

Asegúrate de registrar este esquema en tu archivo \`/schemas/index.ts\` de Sanity:
\`\`\`typescript
// schemas/index.ts
import portfolioItem from './portfolioItem'

export const schemaTypes = [portfolioItem]
\`\`\`

Ejecuta \`sanity deploy\` en tu terminal de Sanity para subir el panel de control a la nube y dejarlo accesible para tu cliente.

---

### Paso 3: Instalar el Cliente de Sanity en React
En la carpeta de esta aplicación web, instala los paquetes oficiales de Sanity para hacer las consultas API:

\`\`\`bash
npm install @sanity/client @sanity/image-url
\`\`\`

---

### Paso 4: Configurar la Conexión en el Código
Crea un archivo \`src/lib/sanity.ts\` para inicializar el cliente y exportar utilidades de consulta:

\`\`\`typescript
// src/lib/sanity.ts
import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

export const sanityClient = createClient({
  projectId: 'TU_PROJECT_ID_DE_SANITY', // Lo obtienes en sanity.io/manage
  dataset: 'production', // o tu dataset personalizado
  apiVersion: '2026-07-18', // Usa la fecha actual para la versión de API
  useCdn: true, // true para respuestas ultra rápidas guardadas en caché
  token: 'TU_API_TOKEN_OPCIONAL', // Requerido solo si quieres escribir datos desde el frontend
})

const builder = imageUrlBuilder(sanityClient)

export function urlFor(source: any) {
  return builder.image(source)
}
\`\`\`

---

### Paso 5: Consultar los Datos con GROQ (Queries)
En tu componente React, realiza las peticiones utilizando el lenguaje de consulta **GROQ** de Sanity para recuperar y mapear los campos multimedia:

\`\`\`typescript
import { useEffect, useState } from 'react'
import { sanityClient } from './lib/sanity'
import { PortfolioItem } from './types'

export function usePortfolioData() {
  const [items, setItems] = useState<PortfolioItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Consulta GROQ que extrae los elementos y resuelve las URLs de archivos de Sanity
    const query = \`*[_type == "portfolioItem"] | order(createdAt desc) {
      "id": _id,
      title,
      description,
      type,
      category,
      layout,
      createdAt,
      // Si hay un archivo subido directo a Sanity, obtenemos su URL. Si no, usamos la externa.
      "url": coalesce(mediaFile.asset->url, externalUrl)
    }\`

    sanityClient.fetch(query)
      .then((data) => {
        setItems(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error("Error cargando portafolio de Sanity:", err)
        setLoading(false)
      })
  }, [])

  return { items, loading }
}
\`\`\`

---

### Paso 6: Configurar CORS en Sanity.io (¡Crucial!)
Para que el navegador de tus visitantes pueda leer los datos de la API de Sanity sin bloqueos de seguridad:
1. Ve a [sanity.io/manage](https://sanity.io/manage) e inicia sesión.
2. Selecciona tu proyecto.
3. Haz clic en la pestaña **"API"**.
4. En la sección **"CORS Origins"**, haz clic en **"Add CORS origin"**.
5. Añade la URL de producción de tu sitio web (ej: \`https://mi-portafolio.com\`) y activa la casilla **"Allow credentials"**. También puedes añadir \`http://localhost:3000\` para pruebas locales.
`;

export const clientManualMarkdown = `## 📸 MANUAL DE ADMINISTRACIÓN PARA EL CLIENTE: Cómo Gestionar tus Fotos y Videos

¡Hola! Este manual te explicará, de forma muy sencilla y sin tecnicismos, cómo actualizar tú mismo todas las fotos y videos de tu página web utilizando tu nuevo panel de control de **Sanity.io**.

---

### Paso 1: Acceder al Panel de Control de Sanity
1. Tu programador te entregará un enlace exclusivo (ej: \`https://tu-proyecto.sanity.studio\` o acceso directo desde esta web).
2. Abre el enlace en tu navegador.
3. Haz clic en **"Log In"** (Iniciar Sesión) y selecciona el método acordado (usualmente Google, GitHub, o introduciendo tu correo electrónico y una clave).

---

### Paso 2: Crear una Nueva Publicación (Foto o Video)
Una vez dentro del panel, verás una columna a la izquierda con el nombre **"Item de Portafolio"**:
1. Haz clic en **"Item de Portafolio"** (o en el símbolo **+** al lado).
2. Se abrirá una ficha en blanco en el centro de la pantalla, lista para que completes la información.

---

### Paso 3: Rellenar la Ficha del Proyecto
Completa los campos siguiendo estas sencillas instrucciones para que la web coloque el archivo exactamente donde tú quieres:

1. 🏷️ **Título del Proyecto**: Escribe un título bonito para el archivo o proyecto (ej: *Casa del Lago - Fachada Principal*).
2. 📝 **Descripción**: Describe de qué se trata la toma o el proyecto (ej: *Fotografía al atardecer destacando los ventanales de doble altura...*). 
   > 💡 *Tip: Si no sabes qué escribir, ¡puedes usar el botón "Generar con Inteligencia Artificial" dentro del gestor integrado en esta web para obtener textos profesionales en segundos!*
3. 🎥 **Tipo de Archivo**: Marca **"Imagen"** si vas a subir una foto, o **"Video"** si vas a subir un video.
4. 📂 **Clasificación / Categoría (¡LO MÁS IMPORTANTE!)**:
   Esta casilla le dice a la página web en qué sección debe colocar tu archivo. Debes escribir la palabra clave **idéntica** (respetando mayúsculas, minúsculas y espacios) para clasificar el contenido:
   * Escribe **\`Videos carrusel\`** si es un video que quieres que aparezca en la parte superior deslizable.
   * Escribe **\`Fotos carrusel\`** si es una foto espectacular para la galería deslizable horizontal.
   * Escribe **\`Proyecto A\`** o **\`Proyecto B\`** (puedes crear nuevos nombres como \`Proyecto Hotel\`, \`Proyecto Comercial\`) para agrupar múltiples fotos/videos bajo un mismo proyecto y catálogo independiente.
5. 📤 **Subir Archivo / Enlace**:
   * Si marcas **Imagen**, arrastra tu foto en formato JPG o PNG directo a la casilla gris, o haz clic en "Upload" para seleccionarla desde tu computador.
   * Si marcas **Video**, puedes subir un archivo de video en formato MP4 (de preferencia comprimido y ligero para que cargue rápido) o colocar una URL directa que te dé tu plataforma de alojamiento.
6. 📐 **Formato de Visualización (Layout)**:
   * Elige **"Carrusel Horizontal"** para que los elementos se deslicen de izquierda a derecha.
   * Elige **"Galería en Cuadrícula"** para que los elementos se organicen en una hermosa cuadrícula de mosaico (tipo Pinterest).

---

### Paso 4: Publicar los Cambios
Una vez completado, haz clic en el botón verde **"Publish"** (Publicar) situado en la esquina inferior derecha. 

¡Y listo! En menos de un minuto, el nuevo contenido aparecerá automáticamente en tu sitio web. No hay riesgo de romper el diseño, la web se encarga de acomodarlo por ti.

---

### 🌟 Consejos para Organizar tu Catálogo Eficientemente
* **Mantén el mismo nombre de categoría**: Si estás publicando 5 fotos de tu proyecto "Casa de Campo", asegúrate de que las 5 fotos tengan escrito exactamente \`Casa de Campo\` en el campo de *Clasificación/Categoría*. Si en una escribes \`casa de campo\` (con minúsculas), el sistema pensará que es un proyecto diferente.
* **Comprime tus imágenes**: Antes de subir fotos, puedes usar herramientas gratuitas en línea como *TinyJPG* para reducir su tamaño de peso sin perder calidad. Tu sitio web cargará instantáneamente para tus clientes.
* **Videos óptimos**: Intenta que tus videos duren menos de 30 segundos y que pesen poco, o usa enlaces de alta velocidad.
`;
