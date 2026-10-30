import { handleCallback } from '#lib/auth.js';
import type { RequestHandler } from './$types';

// SvelteKit accetta solo verbi HTTP come export di un `+server.ts`: la logica
// vive in #lib, qui resta il collegamento.
export const GET: RequestHandler = (event) => handleCallback(event);
