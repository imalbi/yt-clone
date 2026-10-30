import IconHome from '~icons/mdi/home';
import IconHomeOutline from '~icons/mdi/home-outline';
import IconStar from '~icons/mdi/star';
import IconStarOutline from '~icons/mdi/star-outline';
import IconPlayBox from '~icons/mdi/play-box';
import IconPlayBoxOutline from '~icons/mdi/play-box-outline';
import IconPlaylistPlay from '~icons/mdi/playlist-play';
import IconPlaylistMusicOutline from '~icons/mdi/playlist-music-outline';

/**
 * Le icone erano stringhe SVG iniettate con {@html}. Sono dati statici, quindi
 * non erano un rischio di injection, ma restavano 39 righe di markup in un file
 * di configurazione e l'unico `.js` di un progetto TypeScript.
 */
export const items = [
	{ description: 'Home', icon: IconHomeOutline, activeIcon: IconHome, ref: '/' },
	{ description: 'Liked', icon: IconStarOutline, activeIcon: IconStar, ref: '/playlist/liked' },
	{
		description: 'Playlist',
		icon: IconPlaylistMusicOutline,
		activeIcon: IconPlaylistPlay,
		ref: '/playlist'
	},
	{
		description: 'Iscrizioni',
		icon: IconPlayBoxOutline,
		activeIcon: IconPlayBox,
		ref: '/iscrizioni'
	}
] as const;

/** `page.url` non e' un `URL` completo: qui serve solo cio' che si legge. */
type NavUrl = { pathname: string; searchParams: { get(name: string): string | null } };

export function isNavActive(itemRef: string, url: NavUrl): boolean {
	const { pathname } = url;
	if (itemRef === '/') {
		return pathname === '/';
	}
	// La riproduzione sta sotto /playlist/watch ma appartiene alla playlist che
	// suona: `?list=` la nomina, e senza i piaciuti sono quella di default.
	if (pathname.startsWith('/playlist/watch/')) {
		const custom = (url.searchParams.get('list') ?? 'LL') !== 'LL';
		return itemRef === (custom ? '/playlist' : '/playlist/liked');
	}
	if (itemRef === '/playlist') {
		return (
			pathname === '/playlist' ||
			(pathname.startsWith('/playlist/') && !pathname.startsWith('/playlist/liked'))
		);
	}
	return pathname === itemRef || pathname.startsWith(`${itemRef}/`);
}
