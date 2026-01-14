import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  // Authentication disabled - redirect auth pages to main app
  const authPaths = ['/login', '/signup'];
  const isAuthPath = authPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  if (isAuthPath) {
    const url = request.nextUrl.clone();
    url.pathname = '/roleplay';
    return NextResponse.redirect(url);
  }

  // Allow all requests without authentication
  return NextResponse.next({ request });
}
