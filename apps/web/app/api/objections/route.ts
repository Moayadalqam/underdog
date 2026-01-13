import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    // Build query
    let query = supabase
      .from('objections')
      .select('*')
      .eq('isActive', true)
      .order('difficulty');

    // Filter by category if provided
    if (category && category !== 'all') {
      query = query.eq('category', category);
    }

    const { data: objections, error } = await query;

    if (error) {
      console.error('Error fetching objections:', error);
      return NextResponse.json({ error: 'Failed to fetch objections' }, { status: 500 });
    }

    return NextResponse.json(objections || []);
  } catch (error) {
    console.error('Error in objections API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
