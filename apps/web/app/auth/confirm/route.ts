import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const token_hash = searchParams.get('token_hash');
  const type = searchParams.get('type') as 'signup' | 'recovery' | 'invite' | 'email' | null;
  const next = searchParams.get('next') || '/roleplay';

  // Also check for 'token' parameter (alternative format)
  const token = searchParams.get('token');

  // Log for debugging
  console.log('Auth confirm request:', {
    token_hash: token_hash ? 'present' : 'missing',
    token: token ? 'present' : 'missing',
    type,
    next,
    allParams: Object.fromEntries(searchParams.entries()),
  });

  const supabase = await createClient();

  // Try token_hash first (newer format)
  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({
      token_hash,
      type,
    });

    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
    console.log('verifyOtp error with token_hash:', error.message);
  }

  // Try token (older format)
  if (token && type) {
    const { error } = await supabase.auth.verifyOtp({
      token_hash: token,
      type,
    });

    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
    console.log('verifyOtp error with token:', error.message);
  }

  // If we have no token at all, show what params we received
  const errorMessage = !token_hash && !token
    ? 'missing_token'
    : 'verification_failed';

  return NextResponse.redirect(`${origin}/login?error=${errorMessage}`);
}
