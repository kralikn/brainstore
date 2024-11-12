import { updateSession } from '@/utils/supabase/middleware'
import { createClient } from './utils/supabase/server'

export async function middleware(request) {

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // if (!user && request.nextUrl.pathname.startsWith('/dashboard')) {
  //   return Response.redirect(new URL('/', request.url))
  // }

  // if (user && request.nextUrl.pathname.startsWith('/')) {
  //   return Response.redirect(new URL('/dashboard', request.url))
  // }

  // return await updateSession(request)

  const isDashboard = request.nextUrl.pathname.startsWith('/*');
  const isHomePage = request.nextUrl.pathname === '/';

  if (user) {
    // Ha be van jelentkezve a felhasználó, és a főoldalra navigál
    if (isHomePage) {
      return Response.redirect(new URL('/dashboard/admin', request.url));
    }
  } else {
    // Ha nincs bejelentkezve a felhasználó, és a dashboardra navigál
    if (isDashboard) {
      return Response.redirect(new URL('/', request.url));
    }
  }

  // További logika kezelése (cookie-k frissítése, stb.)
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    // '/',
    // '/dashboard',
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}