-- ==============================================================================
-- Supabase Setup Script for Biological Specimen Collection
-- ==============================================================================
-- Instrucciones: 
-- Copia y pega este script en el SQL Editor de tu proyecto en Supabase 
-- y ejecútalo para crear todas las tablas necesarias.
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Tabla de Especímenes (Principal)
CREATE TABLE IF NOT EXISTS public.specimens (
    "occurrenceID" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "user_id" UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    "scientificName" TEXT NOT NULL,
    "kingdom" TEXT,
    "phylum" TEXT,
    "class" TEXT,
    "order" TEXT,
    "family" TEXT,
    "genus" TEXT,
    "specificEpithet" TEXT,
    "locality" TEXT,
    "decimalLatitude" NUMERIC,
    "decimalLongitude" NUMERIC,
    "eventDate" DATE,
    "recordedBy" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "lastModified" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "version" INTEGER DEFAULT 1
);

-- 2. Tabla de Proyectos
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Tabla de Ubicaciones (Storage Locations)
CREATE TABLE IF NOT EXISTS public.storage_locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    building TEXT NOT NULL,
    room TEXT,
    cabinet TEXT,
    shelf TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Tabla de Préstamos (Loans)
CREATE TABLE IF NOT EXISTS public.loans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    specimen_id UUID REFERENCES public.specimens("occurrenceID") ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'active',
    loan_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    return_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Tabla de Determinaciones Taxonómicas
CREATE TABLE IF NOT EXISTS public.determinations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    specimen_id UUID REFERENCES public.specimens("occurrenceID") ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    scientific_name TEXT NOT NULL,
    determined_by TEXT,
    determination_date TIMESTAMP WITH TIME ZONE,
    is_current BOOLEAN DEFAULT false,
    remarks TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Tabla de Archivos Multimedia (Specimen Media)
CREATE TABLE IF NOT EXISTS public.specimen_media (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    specimen_id UUID REFERENCES public.specimens("occurrenceID") ON DELETE CASCADE,
    url TEXT NOT NULL,
    type TEXT NOT NULL,
    caption TEXT,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Tabla de Logs de Auditoría
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    specimen_id UUID REFERENCES public.specimens("occurrenceID") ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    user_email TEXT,
    field_name TEXT NOT NULL,
    old_value TEXT,
    new_value TEXT,
    reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================================================
-- Creación de Storage Bucket
-- ==============================================================================
-- IMPORTANTE: Supabase no siempre permite crear buckets desde el SQL Editor
-- sin permisos de superuser. Si esto falla, ve a la sección "Storage" 
-- en el panel de Supabase y crea manualmente un bucket llamado: "specimen-media"
-- asegurándote de que sea PÚBLICO.
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public) 
VALUES ('specimen-media', 'specimen-media', true)
ON CONFLICT (id) DO NOTHING;
