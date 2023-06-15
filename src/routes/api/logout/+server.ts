import type { RequestHandler } from './$types'
import { auth } from '$lib/server/lucia'
import { redirect } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ locals }) => {
	const session = await locals.auth.validate()
	if (!session) {
		throw redirect(302, '/')
	}

	await auth.invalidateSession(session.sessionId)
	locals.auth.setSession(null)

	return new Response(null, {headers: { Location: '/' }, status: 302})
};