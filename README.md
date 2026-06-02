# Biological Specimen Collection Management System

Este es un sistema académico de grado profesional para la gestión de colecciones de ciencias naturales, diseñado para la digitalización y estandarización de especímenes biológicos bajo el estándar internacional **Darwin Core (DwC)**.

## 🚀 Características Principales

- **Gestión Científica (CRUD):** Registro completo de especímenes con validación técnica.
- **Estandarización Darwin Core:** Mapeo automático de campos biológicos y taxonómicos.
- **Visualización de Datos:** Gráficas dinámicas de la composición de la colección mediante Recharts.
- **Gestión de Datos:** Sistema de importación/exportación JSON con control de versiones y estrategias de fusián de datos (Merge).
- **Resiliencia de Datos:** Uso de `localStorage` con sistema de failover a estado en memoria.
- **Diseño Premium:** Interfaz responsiva con temas claro/oscuro, micro-animaciones y enfoque científico.

## 🛠️ Tecnologías Usadas

- **Frontend:** React 18, Vite.
- **Navegación:** React Router Dom 6.
- **Estado:** Context API para una "fuente única de verdad".
- **Iconografía:** Lucide React.
- **Gráficas:** Recharts.
- **Estilos:** Vanilla CSS con Design Tokens (Variables CSS).

## 📂 Estructura del Proyecto

- `/src/components`: Componentes reutilizables de UI.
- `/src/pages`: Vistas principales de la aplicación.
- `/src/context`: Gestión del estado global (SpecimenContext).
- `/src/services`: Lógica de persistencia y estándares biológicos.
- `/src/utils`: Utilidades de validación y normalización.
- `/src/data`: Datos iniciales (Biodiversidad de Colombia).

## 📋 Instrucciones de Ejecución

1. Asegúrese de tener **Node.js** instalado.
2. Clone el proyecto o extraiga los archivos.
3. Instale las dependencias:
   ```bash
   npm install
   ```
4. **Configuración de Supabase (Base de Datos):**
   Este proyecto utiliza Supabase como Backend as a Service. Necesitas crear un proyecto gratuito en Supabase para almacenar la información.
   - Copia el archivo `.env.example` y renómbrelo a `.env`.
   - Llene las variables con las credenciales de tu proyecto (URL y Anon Key):
     ```env
     VITE_SUPABASE_URL=tu_supabase_project_url
     VITE_SUPABASE_ANON_KEY=tu_supabase_anon_public_key
     ```
   - **IMPORTANTE:** Para que la aplicación funcione, es vital crear las tablas de base de datos requeridas. Copia el contenido del archivo `supabase-setup.sql` incluido en la raíz de este proyecto, pégalo en el **SQL Editor** de tu panel de Supabase y dale a "Run" (Ejecutar).
   - Para empezar a usar el sistema, puedes crear un usuario utilizando la página de Registro propia de la aplicación (ruta `/register`), o añadirlo manualmente desde la pestaña "Authentication" -> "Users" de tu panel de Supabase.

5. Inicie el servidor de desarrollo:
   ```bash
   npm run dev
   ```

## 🧪 Notas de Ingeniería

- **Normalización:** Los nombres científicos se normalizan automáticamente (Género capitalizado, especie en minúsculas).
- **Auditoría:** Cada registro cuenta con `occurrenceID` único (UUID v4), `createdAt` y `lastModified`.
- **Accesibilidad:** Uso de HTML semántico y navegación por teclado.