import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  // Rotas públicas
  const isLoginPage = request.nextUrl.pathname.startsWith('/login');
  const isSetupPage = request.nextUrl.pathname.startsWith('/administracao/setup');

  // Se não está autenticado e não está na página de login, redireciona
  if (!user && !isLoginPage) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Se está autenticado
  if (user) {
    // Se está na página de login, redireciona para agenda ou setup
    if (isLoginPage) {
      // Verifica se o usuário tem uma empresa
      const { data: userData } = await supabase
        .from('users')
        .select('user_type')
        .eq('id', user.id)
        .single();

      if (userData?.user_type === 'business') {
        const { data: business } = await supabase
          .from('businesses')
          .select('id')
          .eq('owner_id', user.id)
          .single();

        if (!business) {
          return NextResponse.redirect(new URL('/administracao/setup', request.url));
        }
      }

      return NextResponse.redirect(new URL('/agenda', request.url));
    }

    // Se não está na página de setup, verifica se precisa configurar empresa
    if (!isSetupPage) {
      const { data: userData } = await supabase
        .from('users')
        .select('user_type')
        .eq('id', user.id)
        .single();

      if (userData?.user_type === 'business') {
        const { data: business } = await supabase
          .from('businesses')
          .select('id')
          .eq('owner_id', user.id)
          .single();

        if (!business) {
          return NextResponse.redirect(new URL('/administracao/setup', request.url));
        }
      }
    }
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
