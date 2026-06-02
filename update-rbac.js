import pkg from 'pg';
const { Client } = pkg;
import fs from 'fs';
import path from 'path';

const envFile = fs.readFileSync(path.join(process.cwd(), '.env'), 'utf8');
const envVars = {};
envFile.split('\n').forEach(line => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
        envVars[match[1]] = match[2];
    }
});

const client = new Client({
    user: envVars.DB_USER,
    password: envVars.DB_PASSWORD,
    host: envVars.DB_HOST,
    port: parseInt(envVars.DB_PORT),
    database: envVars.DB_NAME,
    ssl: { rejectUnauthorized: false }
});

const sql = `
-- Crear tabla de roles
CREATE TABLE IF NOT EXISTS public.user_roles (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'auxiliar',
    permissions JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Asignar rol admin a los usuarios existentes que no tengan rol en la tabla
INSERT INTO public.user_roles (user_id, role, permissions)
SELECT id, 'admin', '{"all": true}'::jsonb
FROM auth.users
ON CONFLICT (user_id) DO NOTHING;

-- Función para leer los correos (que están protegidos en auth.users)
CREATE OR REPLACE FUNCTION get_user_profiles()
RETURNS TABLE (
    id UUID,
    email VARCHAR,
    role TEXT,
    permissions JSONB,
    created_at TIMESTAMP WITH TIME ZONE
) 
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY 
    SELECT 
        u.id, 
        u.email::VARCHAR, 
        COALESCE(r.role, 'auxiliar'), 
        COALESCE(r.permissions, '{}'::jsonb),
        u.created_at
    FROM auth.users u
    LEFT JOIN public.user_roles r ON u.id = r.user_id;
END;
$$ LANGUAGE plpgsql;

-- Función para borrar usuarios completamente (desde auth.users)
CREATE OR REPLACE FUNCTION admin_delete_user(target_user_id UUID)
RETURNS BOOLEAN
SECURITY DEFINER
AS $$
BEGIN
    DELETE FROM auth.users WHERE id = target_user_id;
    RETURN true;
END;
$$ LANGUAGE plpgsql;
`;

async function run() {
    try {
        await client.connect();
        console.log("Conectado. Ejecutando migraciones de RBAC...");
        await client.query(sql);
        console.log("¡Migraciones exitosas!");
    } catch (err) {
        console.error("Error:", err);
    } finally {
        await client.end();
    }
}

run();
