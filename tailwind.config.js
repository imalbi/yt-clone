/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				primary: 'var(--text-primary)',
				secondary: 'var(--text-secondary)',
				'border-color': 'var(--border-color)'
			},
			backgroundColor: {
				primary: 'var(--bg-primary)',
				secondary: 'var(--bg-secondary)'
			}
		}
	},
	plugins: [
		require('@tailwindcss/line-clamp') // Aggiungi questa linea
	]
};
