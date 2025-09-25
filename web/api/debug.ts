import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

export const config = { runtime: 'nodejs' };

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Check environment variables
    const envCheck = {
      hasSupabaseUrl: !!process.env.VITE_SUPABASE_URL,
      hasSupabaseServiceRole: !!process.env.SUPABASE_SERVICE_ROLE,
      hasStripeSecret: !!process.env.STRIPE_SECRET_KEY,
      hasStripeWebhook: !!process.env.STRIPE_WEBHOOK_SECRET,
      hasPriceCruiser: !!process.env.STRIPE_PRICE_CRUISER,
      hasPricePower: !!process.env.STRIPE_PRICE_POWER,
      hasPricePro: !!process.env.STRIPE_PRICE_PRO,
      supabaseUrlPreview: process.env.VITE_SUPABASE_URL?.substring(0, 30) + '...' || 'NOT SET',
      nodeEnv: process.env.NODE_ENV || 'unknown'
    };

    // Test Supabase connection
    let supabaseTest: { success: boolean, error: string | null, hasData: boolean } = { success: false, error: 'Not tested', hasData: false };
    
    if (envCheck.hasSupabaseUrl && envCheck.hasSupabaseServiceRole) {
      try {
        const supa = createClient(
          process.env.VITE_SUPABASE_URL!,
          process.env.SUPABASE_SERVICE_ROLE!
        );
        
        // Try to query the token_ledger table
        const { data, error } = await supa.from('token_ledger').select('user_id').limit(1);
        supabaseTest = { 
          success: !error, 
          error: error?.message || null,
          hasData: Array.isArray(data) && data.length > 0
        };
      } catch (e: any) {
        supabaseTest = { success: false, error: e.message, hasData: false };
      }
    }

    // Test community pool access
    let poolTest: { success: boolean, error: string | null } = { success: false, error: 'Not tested' };
    if (supabaseTest.success) {
      try {
        const supa = createClient(
          process.env.VITE_SUPABASE_URL!,
          process.env.SUPABASE_SERVICE_ROLE!
        );
        const { data, error } = await supa.from('community_pool').select('*').single();
        poolTest = { 
          success: !error, 
          error: error?.message || null 
        };
      } catch (e: any) {
        poolTest = { success: false, error: e.message };
      }
    }

    return res.status(200).json({ 
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'unknown',
      envCheck,
      supabaseTest,
      poolTest,
      status: envCheck.hasSupabaseUrl && envCheck.hasSupabaseServiceRole && supabaseTest.success ? 'healthy' : 'needs_attention'
    });
  } catch (error: any) {
    return res.status(500).json({ 
      error: 'Debug endpoint failed', 
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
}