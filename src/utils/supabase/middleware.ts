
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) =>
                        request.cookies.set(name, value)
                    )
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    const {
        data: { user },
        error,
    } = await supabase.auth.getUser()

    // Clear stale/invalid session cookies gracefully
    if (error?.code === 'refresh_token_not_found' || error?.message?.includes('Invalid Refresh Token')) {
        const response = request.nextUrl.pathname.startsWith('/membros') || request.nextUrl.pathname.startsWith('/admin')
            ? NextResponse.redirect(new URL('/login', request.url))
            : NextResponse.next({ request })

        request.cookies.getAll().forEach(({ name }) => {
            if (name.startsWith('sb-')) response.cookies.delete(name)
        })
        return response
    }

    // Protect /membros
    if (request.nextUrl.pathname.startsWith('/membros') && !user) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    // Protect /admin — must be logged in AND have admin role
    if (request.nextUrl.pathname.startsWith('/admin')) {
        if (!user) {
            return NextResponse.redirect(new URL('/login', request.url))
        }

        const { data: adminRole } = await supabase
            .from('user_roles')
            .select('role:roles!inner(name)')
            .eq('user_id', user.id)
            .eq('roles.name', 'admin')
            .maybeSingle()

        if (!adminRole) {
            return NextResponse.redirect(new URL('/membros', request.url))
        }
    }

    // Redirect logged in users away from login/signup pages
    if ((request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/cadastro')) && user) {
        return NextResponse.redirect(new URL('/membros', request.url))
    }

    return supabaseResponse
}
