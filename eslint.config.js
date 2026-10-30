import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import svelte from 'eslint-plugin-svelte';
import globals from 'globals';

export default tseslint.config(
	{ ignores: ['.svelte-kit/', '.vercel/', 'build/', 'node_modules/'] },
	js.configs.recommended,
	tseslint.configs.recommended,
	svelte.configs['flat/recommended'],
	svelte.configs['flat/prettier'],
	{
		languageOptions: {
			globals: { ...globals.browser, ...globals.node }
		}
	},
	{
		// I moduli `.svelte.ts` contengono rune ma sono TypeScript: senza questo
		// glob il parser Svelte li legge senza quello TS e inciampa sui tipi.
		files: ['**/*.svelte', '**/*.svelte.ts'],
		languageOptions: {
			parserOptions: { parser: tseslint.parser }
		}
	}
);
