import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const authHeader = req.headers.get('Authorization')
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    console.log('[EF] authHeader present:', !!authHeader)
    console.log('[EF] env vars OK:', !!supabaseUrl, !!supabaseAnonKey, !!supabaseServiceKey)

    if (!supabaseUrl || !supabaseServiceKey) {
      return new Response(JSON.stringify({ error: 'Server misconfiguration: missing env vars' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (!authHeader) {
      console.log('[EF] ERROR: no Authorization header')
      return new Response(JSON.stringify({ error: 'Missing Authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Extract the raw token from "Bearer <token>"
    const token = authHeader.replace('Bearer ', '')

    // Decode JWT locally (no network call) — extract user ID from 'sub' claim
    let userId: string
    try {
      const [, payloadB64] = token.split('.')
      // Normalize base64url to standard base64 before decoding
      const payloadJson = atob(payloadB64.replace(/-/g, '+').replace(/_/g, '/'))
      const payload = JSON.parse(payloadJson)
      userId = payload.sub
      console.log('[EF] JWT decoded OK - userId:', userId, '| exp:', payload.exp, '| now:', Math.floor(Date.now() / 1000))
      if (!userId) throw new Error('No sub claim in JWT')
    } catch (decodeErr) {
      console.log('[EF] ERROR: JWT decode failed:', decodeErr.message)
      return new Response(JSON.stringify({ error: `Invalid JWT: ${decodeErr.message}` }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Create Admin client using Service Role Key
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    // Verify admin role directly in the database using the decoded user ID
    const { data: roleData, error: roleError } = await supabaseAdmin
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .single()

    console.log('[EF] role check - role:', roleData?.role, '| dbError:', roleError?.message)

    if (roleError || roleData?.role !== 'admin') {
      console.log('[EF] ERROR: not admin → 403')
      return new Response(JSON.stringify({ error: 'Forbidden: Admin access required' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Extract payload from request body
    const { email, password } = await req.json()

    if (!email || !password) {
      return new Response(JSON.stringify({ error: 'Email and password are required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Create the new user using admin API
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true
    })

    if (authError) {
      console.log('[EF] ERROR: createUser failed:', authError.message)
      return new Response(JSON.stringify({ error: authError.message }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    console.log('[EF] SUCCESS: user created:', authData.user?.id)
    return new Response(JSON.stringify({ user: authData.user }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.log('[EF] CATCH error:', error.message)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
