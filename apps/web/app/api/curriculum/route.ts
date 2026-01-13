import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();

    // Get all active modules
    const { data: modules, error: modulesError } = await supabase
      .from('curriculum_modules')
      .select('*')
      .eq('isActive', true)
      .order('number');

    if (modulesError) {
      console.error('Error fetching modules:', modulesError);
      return NextResponse.json({ error: 'Failed to fetch modules' }, { status: 500 });
    }

    // Get lesson counts for each module
    const transformedModules = await Promise.all(
      (modules || []).map(async (module) => {
        const { count: lessonsCount } = await supabase
          .from('lessons')
          .select('*', { count: 'exact', head: true })
          .eq('moduleId', module.id);

        const { count: scenariosCount } = await supabase
          .from('training_scenarios')
          .select('*', { count: 'exact', head: true })
          .eq('moduleId', module.id);

        return {
          id: module.id,
          number: module.number,
          title: module.title,
          description: module.description,
          lessonsCount: lessonsCount || 0,
          scenariosCount: scenariosCount || 0,
        };
      })
    );

    return NextResponse.json(transformedModules);
  } catch (error) {
    console.error('Error in curriculum API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
