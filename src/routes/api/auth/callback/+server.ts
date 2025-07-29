import { redirect } from '@sveltejs/kit';
import { PUBLIC_YOUTUBE_CLIENT_ID, PUBLIC_REDIRECT_URL } from '$env/static/public';
import { YOUTUBE_CLIENT_SECRET } from '$env/static/private';
import { dev } from '$app/environment';

export async function GET({ url, cookies }) {
	const code = url.searchParams.get('code');

	if (!code) {
		// Gestisci l'errore, l'utente potrebbe aver negato l'accesso
		throw redirect(302, '/');
	}

	try {
		// Scambia il codice per un token
		const response = await fetch('https://oauth2.googleapis.com/token', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: new URLSearchParams({
				code: code,
				client_id: PUBLIC_YOUTUBE_CLIENT_ID,
				client_secret: YOUTUBE_CLIENT_SECRET,
				redirect_uri: PUBLIC_REDIRECT_URL,
				grant_type: 'authorization_code'
			})
		});

		const tokens = await response.json();

		if (tokens.error) {
			console.error('Errore durante lo scambio del token:', tokens.error);
			throw redirect(302, '/');
		}

		// 🍪 Archivia i token in un cookie sicuro
		cookies.set('access_token', tokens.access_token, {
			path: '/',
			httpOnly: true, // Il cookie non è accessibile da JavaScript lato client
			secure: !dev, // Usa `secure` solo in produzione (HTTPS)
			maxAge: tokens.expires_in // Scadenza in secondi
		});

		if (tokens.refresh_token) {
			cookies.set('refresh_token', tokens.refresh_token, {
				path: '/',
				httpOnly: true,
				secure: !dev,
				maxAge: 60 * 60 * 24 * 30 // Imposta una scadenza più lunga per il refresh token
			});
		}

		// Archivia i dati dell'utente in un cookie solo se access_token esiste
		if (tokens.access_token) {
			const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
				headers: {
					Authorization: `Bearer ${tokens.access_token}`
				}
			});

			if (userResponse.ok) {
				const userData = await userResponse.json();
				cookies.set('user_data', JSON.stringify(userData), {
					path: '/',
					httpOnly: true,
					secure: !dev,
					maxAge: 60 * 60 * 24 * 30 // Scadenza di 30 giorni
				});
			} else {
				console.error('Errore nel recupero dei dati utente:', await userResponse.text());
			}
		} else {
			console.error('Access token mancante, impossibile recuperare i dati utente.');
		}
	} catch (err) {
		console.error('Catch Error:', err);
	}

	// Reindirizza alla homepage dopo il login
	throw redirect(302, '/');
}
