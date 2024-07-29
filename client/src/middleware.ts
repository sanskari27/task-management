import type { NextRequest } from 'next/server';
import AuthService from './services/auth.service';

export async function middleware(request: NextRequest) {
	const { authenticated: isAuthenticated, isAdmin } = await AuthService.isUserAuthenticated();
	const pathname = request.nextUrl.pathname;

	if (pathname.startsWith('/organizations')) {
		if (!isAuthenticated) {
			return Response.redirect(new URL(`/auth/login?callback=${pathname}`, request.url));
		}
	}
	if (pathname.startsWith('/auth')) {
		if (isAuthenticated) {
			const callback = request.nextUrl.searchParams.get('callback');
			return Response.redirect(new URL(callback || '/organizations', request.url));
		}
	}
	if (pathname.startsWith('/admin')) {
		if (!isAuthenticated) {
			const callback = request.nextUrl.searchParams.get('callback');
			return Response.redirect(new URL(`/auth/login?callback=${pathname}`, request.url));
		} else if (!isAdmin) {
			return Response.redirect(new URL(`/organizations`, request.url));
		}
	}
}

export const config = {
	matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
