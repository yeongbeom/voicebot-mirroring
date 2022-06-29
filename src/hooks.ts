import type { GetSession, Handle } from '@sveltejs/kit';
import { parse } from 'cookie';

import { prisma } from '$lib/database';

export const handle: Handle = async ({ event, resolve }) => {
	const cookieHeader = event.request.headers.get('cookie');
	const cookies = parse(cookieHeader ?? '');

	if (!cookies.session) {
		return await resolve(event);
	}

	const session = await prisma.user.findUnique({
		where: { id: cookies.session }
	});

	if (session) {
		event.locals.user = { emergencyMobile: session.emergencyMobile };
	}

	return await resolve(event);
};

export const getSession: GetSession = ({ locals }) => {
	if (!locals.user) return {};

	// exposing this to the client
	return {
		user: {
			emergencyMobile: locals.user.emergencyMobile
		}
	};
};
