import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ moduleId: string }> }
) {
  try {
    const { moduleId } = await params;
    const supabase = await createClient();

    // Try to parse moduleId as number (for module number) or use as id
    const moduleNumber = parseInt(moduleId, 10);
    const isNumber = !isNaN(moduleNumber);

    // Get the module by number or id
    const { data: moduleData, error } = await supabase
      .from('curriculum_modules')
      .select('*')
      .eq(isNumber ? 'number' : 'id', isNumber ? moduleNumber : moduleId)
      .single();

    if (error || !moduleData) {
      console.error('Error fetching module:', error);
      return NextResponse.json({ error: 'Module not found' }, { status: 404 });
    }

    // Get lessons for this module
    const { data: lessons } = await supabase
      .from('lessons')
      .select('*')
      .eq('moduleId', moduleData.id)
      .order('order');

    // Get scenarios for this module
    const { data: scenarios } = await supabase
      .from('training_scenarios')
      .select('*')
      .eq('moduleId', moduleData.id)
      .eq('isActive', true);

    return NextResponse.json({
      ...moduleData,
      lessons: lessons || [],
      scenarios: scenarios || [],
    });
  } catch (error) {
    console.error('Error in module API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
