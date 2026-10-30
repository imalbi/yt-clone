import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	// Il token non viene piu' passato al client: l'endpoint lo legge da `locals`.
	if (!locals.accessToken) {
		redirect(302, '/api/auth/login');
	}
	return {};
};
