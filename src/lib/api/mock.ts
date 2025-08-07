export type Video = {
	id: string;
	publishedAt: string;
	channelId: string;
	title: string;
	desc: string;
	thumbnails: {
		default: string;
		medium: string;
		high: string;
		standard?: string;
		maxres?: string;
	};
	channelTitle: string;
	statistics: {
		viewCount: string;
		likeCount?: string;
		favoriteCount: string;
		commentCount?: string;
	};
	avatarUrl: string;
};

export interface PlayerResponse {
	//TODO: Implement mock player response;
}

//Needs Title, Description, ChannelTitle, Statistics, Comments, ChannelAvatarUrl.
export const mockPlayerResponse: PlayerResponse = {
	//TODO: Implement mock player response	};
};

export const mockApiResponse: Video[] = [
	{
		id: 'ya-1R6BEN30',
		publishedAt: '2025-06-16T18:58:00Z',
		channelId: 'UCuqUDrPi1CPUzZIH6G6NSMQ',
		title: 'FALSISSIMO EP 11 - THE CRIME SHOW',
		desc: "Abbonati a questo canale per accedere ai vantaggi:\nhttps://www.youtube.com/channel/UCuqUDrPi1CPUzZIH6G6NSMQ/join\n\nSiamo stati al carcere di Bollate per capire cosa c’è davvero dietro all’intervista di Massimo Bossetti, andata in onda su Belve Crime. Un lavoro di approfondimento, testimonianze dirette, domande scomode. \n\nPerchè alla RAI è stato permesso di girare dentro l'istituto? Che tipo di contratto ha fatto la RAI con Bossetti e con il carcere? È giusto pagare un detenuto condannato all’ergastolo per un’apparizione in tv? Questo è il servizio pubblico? \n\nPerchè il carcere di Bollate, a differenza di tutti gli altri carceri italiani, permette di trasformare un luogo di sofferenza in un set cinematografico? \n\nPerchè Bossetti viene presentato come fosse una star, mentre a Stasi - che non ha bisogno di chiedere il permesso, essendo in semi libertà - è stata chiesta la revoca dopo l'intervista a Le Iene? \n\nAbbiamo chiesto a chi vive la loro condizione, i detenuti del carcere di Bollate, cosa ne pensano del rapporto tra giustizia e intrattenimento. Questo e molto altro.",
		thumbnails: {
			default: 'https://i.ytimg.com/vi/ya-1R6BEN30/default.jpg',
			medium: 'https://i.ytimg.com/vi/ya-1R6BEN30/mqdefault.jpg',
			high: 'https://i.ytimg.com/vi/ya-1R6BEN30/hqdefault.jpg',
			standard: 'https://i.ytimg.com/vi/ya-1R6BEN30/sddefault.jpg',
			maxres: 'https://i.ytimg.com/vi/ya-1R6BEN30/maxresdefault.jpg'
		},
		channelTitle: 'FABRIZIO CORONA',
		statistics: {
			viewCount: '305354',
			likeCount: '18652',
			favoriteCount: '0',
			commentCount: '2271'
		},
		avatarUrl:
			'https://yt3.ggpht.com/EYdJEAcDSk23Oxb87FJja95HTt6dQD_JRujmItvs5Sw73IehWFON3ifaVwP237DJRog6unTZLQ=s88-c-k-c0x00ffffff-no-rj'
	},
	{
		id: 'O8_UGssDk14',
		publishedAt: '2025-06-14T12:45:38Z',
		channelId: 'UCJYj3Hmb51ojxcke7jD01kA',
		title: 'Sfido MASSEO alle VENDING MACHINE dei Pokémon e…',
		desc: 'Le Pokemon Card Vending Machine a Tokyo in Giappone sono una truffa?\n\nHo sfidato @ilMasseo a chi trova la carta più rara…',
		thumbnails: {
			default: 'https://i.ytimg.com/vi/O8_UGssDk14/default.jpg',
			medium: 'https://i.ytimg.com/vi/O8_UGssDk14/mqdefault.jpg',
			high: 'https://i.ytimg.com/vi/O8_UGssDk14/hqdefault.jpg',
			standard: 'https://i.ytimg.com/vi/O8_UGssDk14/sddefault.jpg',
			maxres: 'https://i.ytimg.com/vi/O8_UGssDk14/maxresdefault.jpg'
		},
		channelTitle: 'federic95ita',
		statistics: {
			viewCount: '401467',
			likeCount: '37912',
			favoriteCount: '0',
			commentCount: '91'
		},
		avatarUrl:
			'https://yt3.ggpht.com/ytc/AIdro_lCX44VgO-W3u7iIrVvtn5VgayKwq4T924U01UPpHjPa6k=s88-c-k-c0x00ffffff-no-rj'
	},
	{
		id: 'KjflhsdN170',
		publishedAt: '2025-06-13T15:23:50Z',
		channelId: 'UCoRVnrDmJ1Ywt11YHxfAjSw',
		title: '$1 vs $1000 Water Gun!',
		desc: '$1 vs $1000 Water Gun!',
		thumbnails: {
			default: 'https://i.ytimg.com/vi/KjflhsdN170/default.jpg',
			medium: 'https://i.ytimg.com/vi/KjflhsdN170/mqdefault.jpg',
			high: 'https://i.ytimg.com/vi/KjflhsdN170/hqdefault.jpg',
			standard: 'https://i.ytimg.com/vi/KjflhsdN170/sddefault.jpg',
			maxres: 'https://i.ytimg.com/vi/KjflhsdN170/maxresdefault.jpg'
		},
		channelTitle: 'The Richey Family',
		statistics: {
			viewCount: '33457197',
			likeCount: '533344',
			favoriteCount: '0',
			commentCount: '685'
		},
		avatarUrl:
			'https://yt3.ggpht.com/KTnBm8zh850H_fcmDMdqeJaupJV0oGuRLZGM3DXXkyIaN-OLLNbcfFQJ_vGgHYJcod8REmvQ=s88-c-k-c0x00ffffff-no-rj'
	},
	{
		id: 'EnDesx_ntp0',
		publishedAt: '2025-06-16T14:00:17Z',
		channelId: 'UCmbYOkNzqqExatPeU9FqXwQ',
		title: 'Questa NONNA può fermare i TRUFFATORI',
		desc: 'Questa Nonnetta fa perdere tempo ai truffatori telefonici.\nLo sappiamo che le truffe online sottraggono una quantità di soldi allucinanti all’anno soprattutto agli anziani. \nMettimi il follow se anche tu hai tirato un pugno al muro dopo l’ennesimo “abbiamo ricevuto il tuo curriculum e bla bla bla”\nEd è qui che nasce “Daisy”, un’intelligenza artificiale che riconosce le chiamate truffa ma non li blocca, anzi ci parla e li distrae con giri di parole infiniti.\nDaisy è programmata per sembrare una tipica nonnina: lenta, confusa, gentile e distratta. La sua voce è stata registrata da una vera nonna, e la sua “innocenza” è la sua arma più potente.\nParla di gatti, si confonde sulle tecnologie più semplici e mette i truffatori in difficoltà con domande strane e ripetitive.\nDietro a Daisy c’è un team che ha effettivamente studiato come i truffatori agiscono, collaborando con scambaiter esperti per renderla capace di trascinare le chiamate in lunghe conversazioni inutili.\nPensa che una volta, tre truffatori sono rimasti impegnati per quasi un’ora senza riuscire a chiudere la truffa.\nMagari Daisy non può fermare tutti i truffatori, ma può rallentarli e anche di molto.',
		thumbnails: {
			default: 'https://i.ytimg.com/vi/EnDesx_ntp0/default.jpg',
			medium: 'https://i.ytimg.com/vi/EnDesx_ntp0/mqdefault.jpg',
			high: 'https://i.ytimg.com/vi/EnDesx_ntp0/hqdefault.jpg',
			standard: 'https://i.ytimg.com/vi/EnDesx_ntp0/sddefault.jpg',
			maxres: 'https://i.ytimg.com/vi/EnDesx_ntp0/maxresdefault.jpg'
		},
		channelTitle: 'Poldo',
		statistics: {
			viewCount: '103624',
			likeCount: '11802',
			favoriteCount: '0',
			commentCount: '65'
		},
		avatarUrl:
			'https://yt3.ggpht.com/gms54ENMbYjrlR65Sqp0woh3ZsnMMUQYKs2tMWwN-y0b8t-mfAVQ3eyoOim4L8FxdgQNKtFb=s88-c-k-c0x00ffffff-no-rj'
	},
	{
		id: 'vgD7eIMQ9N0',
		publishedAt: '2025-06-14T16:33:58Z',
		channelId: 'UCQZi2YXSxc6BSK4mZHql8ag',
		title: 'This is impressive 😂 (via @powerrickshaw/TT)',
		desc: '',
		thumbnails: {
			default: 'https://i.ytimg.com/vi/vgD7eIMQ9N0/default.jpg',
			medium: 'https://i.ytimg.com/vi/vgD7eIMQ9N0/mqdefault.jpg',
			high: 'https://i.ytimg.com/vi/vgD7eIMQ9N0/hqdefault.jpg',
			standard: 'https://i.ytimg.com/vi/vgD7eIMQ9N0/sddefault.jpg',
			maxres: 'https://i.ytimg.com/vi/vgD7eIMQ9N0/maxresdefault.jpg'
		},
		channelTitle: 'SportsNation',
		statistics: {
			viewCount: '11680340',
			favoriteCount: '0',
			commentCount: '2064'
		},
		avatarUrl:
			'https://yt3.ggpht.com/F7eDOONACF-YK4nKQ9NMhcWV5o2Lj_IjbPeHqvwPZm-iHdq76hXJ4gwU7LGqp26tMIIxRoUv6A=s88-c-k-c0x00ffffff-no-rj'
	},
	{
		id: 'H1S6BLe4_Fg',
		publishedAt: '2025-06-14T16:16:12Z',
		channelId: 'UCqOwcxgDCjnHNgMt9A3Ua8w',
		title: 'What’s your favourite SHOWER GEL?😍🔥',
		desc: '',
		thumbnails: {
			default: 'https://i.ytimg.com/vi/H1S6BLe4_Fg/default.jpg',
			medium: 'https://i.ytimg.com/vi/H1S6BLe4_Fg/mqdefault.jpg',
			high: 'https://i.ytimg.com/vi/H1S6BLe4_Fg/hqdefault.jpg',
			standard: 'https://i.ytimg.com/vi/H1S6BLe4_Fg/sddefault.jpg',
			maxres: 'https://i.ytimg.com/vi/H1S6BLe4_Fg/maxresdefault.jpg'
		},
		channelTitle: 'Diana Belitskay',
		statistics: {
			viewCount: '5999991',
			likeCount: '515895',
			favoriteCount: '0',
			commentCount: '5281'
		},
		avatarUrl:
			'https://yt3.ggpht.com/LuISwINk46heUDL0p6IF8Q5WYELSB8Wh7r41TKoiLHzB0fH7n7G3NO-olf1LODPnaGuDMsHUAJA=s88-c-k-c0x00ffffff-no-rj'
	},
	{
		id: '3FXpuoW3_1I',
		publishedAt: '2025-06-13T04:00:03Z',
		channelId: 'UC5NEWyJDtr8vtzJWT6SXK4Q',
		title: 'Bro used 98% of his brain 😂',
		desc: '',
		thumbnails: {
			default: 'https://i.ytimg.com/vi/3FXpuoW3_1I/default.jpg',
			medium: 'https://i.ytimg.com/vi/3FXpuoW3_1I/mqdefault.jpg',
			high: 'https://i.ytimg.com/vi/3FXpuoW3_1I/hqdefault.jpg',
			standard: 'https://i.ytimg.com/vi/3FXpuoW3_1I/sddefault.jpg',
			maxres: 'https://i.ytimg.com/vi/3FXpuoW3_1I/maxresdefault.jpg'
		},
		channelTitle: 'Eternal Love',
		statistics: {
			viewCount: '25429268',
			likeCount: '574931',
			favoriteCount: '0',
			commentCount: '806'
		},
		avatarUrl:
			'https://yt3.ggpht.com/w-N3z6HwOukZmQ6bPNDkTOkWAbiAKvFhkB46O0QjibinVgNMHnrm13zxOgUWI5q3GpmzNyAh6Q=s88-c-k-c0x00ffffff-no-rj'
	},
	{
		id: '1EVPLXudypo',
		publishedAt: '2025-06-16T11:05:55Z',
		channelId: 'UCXuc_HVyuWFoWQa1zyyuqJw',
		title: 'NON ENTRARE NEL LOOP #onemoretimepodcast #lucacasadei #grenbaud',
		desc: 'Link allo shop ufficiale: https://www.onemoretime.me\nLink al canale Telegram: https://t.me/podcastonemoretime\nCi trovi anche qui: https://linktr.ee/podcastonemoretime\n\nStorie di vita raccontate da personaggi che le hanno vissute pienamente. In One More Time Luca affronta, insieme ai suoi ospiti, la rinascita passando dai fallimenti.\n\nL’host è Luca Casadei, 48 anni, nato a Parigi. È un imprenditore nel mondo della comunicazione. La sua storia la trovi qui: https://youtu.be/dn5hp-W-PcE\n\nIn questa puntata:\n#adv',
		thumbnails: {
			default: 'https://i.ytimg.com/vi/1EVPLXudypo/default.jpg',
			medium: 'https://i.ytimg.com/vi/1EVPLXudypo/mqdefault.jpg',
			high: 'https://i.ytimg.com/vi/1EVPLXudypo/hqdefault.jpg',
			standard: 'https://i.ytimg.com/vi/1EVPLXudypo/sddefault.jpg',
			maxres: 'https://i.ytimg.com/vi/1EVPLXudypo/maxresdefault.jpg'
		},
		channelTitle: 'PODCAST ONE MORE TIME di Luca Casadei',
		statistics: {
			viewCount: '54746',
			likeCount: '1302',
			favoriteCount: '0',
			commentCount: '16'
		},
		avatarUrl:
			'https://yt3.ggpht.com/aLy7Cnlb_z_nd1rU6xGqaa3UONkMhQHIx-rz-q5A0WXvq4msiQuza11OiEUCigJ2eue9Adza=s88-c-k-c0x00ffffff-no-rj'
	},
	{
		id: 'vjWnAOgh8FE',
		publishedAt: '2025-06-15T23:41:15Z',
		channelId: 'UCc46uxgt6GIJxoBlb7i5UZQ',
		title: 'Where are you from? #dance #nevada #trend #funny',
		desc: '',
		thumbnails: {
			default: 'https://i.ytimg.com/vi/vjWnAOgh8FE/default.jpg',
			medium: 'https://i.ytimg.com/vi/vjWnAOgh8FE/mqdefault.jpg',
			high: 'https://i.ytimg.com/vi/vjWnAOgh8FE/hqdefault.jpg',
			standard: 'https://i.ytimg.com/vi/vjWnAOgh8FE/sddefault.jpg',
			maxres: 'https://i.ytimg.com/vi/vjWnAOgh8FE/maxresdefault.jpg'
		},
		channelTitle: 'NEVADA',
		statistics: {
			viewCount: '1975619',
			likeCount: '100465',
			favoriteCount: '0',
			commentCount: '2889'
		},
		avatarUrl:
			'https://yt3.ggpht.com/ybiwJKmQkyysuIrVbjH00NXHFrxXEDoRtat2NuXcQOmww2bqBvgLPBJvD9IgM-r4OyECgY5k-A=s88-c-k-c0x00ffffff-no-rj'
	},
	{
		id: '8kVo3F9jSRU',
		publishedAt: '2025-06-16T10:03:17Z',
		channelId: 'UCiONA5rrHjHQTPA6i3nW7Zg',
		title: 'Sabaku svela il segreto di Bayle',
		desc: '-----------------------\n• Canale primario: https://www.youtube.com/Cydoniayt\n• Canale ricaricamenti: https://www.youtube.com/c/CydoniaChiara\n• Canale Twitch: https://www.twitch.tv/cydonia_chiara\n• Piattaforme Podcast: https://linktr.ee/lacantinadicydonia\n\nMontaggio e Thumbnail di: \n• @Loudret',
		thumbnails: {
			default: 'https://i.ytimg.com/vi/8kVo3F9jSRU/default.jpg',
			medium: 'https://i.ytimg.com/vi/8kVo3F9jSRU/mqdefault.jpg',
			high: 'https://i.ytimg.com/vi/8kVo3F9jSRU/hqdefault.jpg',
			standard: 'https://i.ytimg.com/vi/8kVo3F9jSRU/sddefault.jpg',
			maxres: 'https://i.ytimg.com/vi/8kVo3F9jSRU/maxresdefault.jpg'
		},
		channelTitle: 'La Cantina di Cydonia ',
		statistics: {
			viewCount: '63410',
			likeCount: '3796',
			favoriteCount: '0',
			commentCount: '28'
		},
		avatarUrl:
			'https://yt3.ggpht.com/0SMfl91fo-mqjldoZu3y3IedPtSwhWYt1XEkznoLQ6SSuf1IZ0W3OfbbtLzwZTVe2vVkWBUL=s88-c-k-c0x00ffffff-no-rj'
	},
	{
		id: 'MjB2QMUg33k',
		publishedAt: '2025-06-14T17:57:27Z',
		channelId: 'UCOdWuiC6rZl0RKF13JWAS_Q',
		title:
			'PRESENTO LA NUOVA FIDANZATA DI KEVIN "SOFI" peccato che ci sia papi handy a mettere le distanze',
		desc: '',
		thumbnails: {
			default: 'https://i.ytimg.com/vi/MjB2QMUg33k/default.jpg',
			medium: 'https://i.ytimg.com/vi/MjB2QMUg33k/mqdefault.jpg',
			high: 'https://i.ytimg.com/vi/MjB2QMUg33k/hqdefault.jpg',
			standard: 'https://i.ytimg.com/vi/MjB2QMUg33k/sddefault.jpg',
			maxres: 'https://i.ytimg.com/vi/MjB2QMUg33k/maxresdefault.jpg'
		},
		channelTitle: 'FRATELLI IMPERFETTI',
		statistics: {
			viewCount: '179296',
			likeCount: '4630',
			favoriteCount: '0',
			commentCount: '59'
		},
		avatarUrl:
			'https://yt3.ggpht.com/j8Z67nEkLtui5PNTTxAcpJkFeKYlz54SYX7vFLcShigbrRVGnZpMuq7QFvuoqARk2yUfYpxL0Kk=s88-c-k-c0x00ffffff-no-rj'
	},
	{
		id: 'eKDfG4JWTRg',
		publishedAt: '2025-06-15T03:30:35Z',
		channelId: 'UC78e1byJq3wN1X_L7dqqKDg',
		title: '#头脑特工队#家庭#搞笑#可爱',
		desc: 'Welcome to "A happy family"! 🎉\n\nHello, friends who love funny, creative and reversal! I am your happy chieftain, specializing in collecting the most brain-opening and interesting videos on the entire network, contracting your daily source of happiness!\n\nAll videos are authorized by creators in mainland China, strictly abide by the platform regulations📺, the content is green and healthy, and the whole family can watch it!\n\nClick to subscribe + small bell🔔, join us!',
		thumbnails: {
			default: 'https://i.ytimg.com/vi/eKDfG4JWTRg/default.jpg',
			medium: 'https://i.ytimg.com/vi/eKDfG4JWTRg/mqdefault.jpg',
			high: 'https://i.ytimg.com/vi/eKDfG4JWTRg/hqdefault.jpg',
			standard: 'https://i.ytimg.com/vi/eKDfG4JWTRg/sddefault.jpg',
			maxres: 'https://i.ytimg.com/vi/eKDfG4JWTRg/maxresdefault.jpg'
		},
		channelTitle: 'A happy family',
		statistics: {
			viewCount: '15008485',
			likeCount: '179660',
			favoriteCount: '0',
			commentCount: '146'
		},
		avatarUrl:
			'https://yt3.ggpht.com/0fq3YPDMsCBHqw4HB5W7ItCvD9Jmbfn1t90m1NWEc2Px04CUgqWcIM2lsdc451WitZeXuUBrgA=s88-c-k-c0x00ffffff-no-rj'
	},
	{
		id: 'tPy6T36VSnk',
		publishedAt: '2025-06-07T17:39:01Z',
		channelId: 'UCoRVnrDmJ1Ywt11YHxfAjSw',
		title: 'Will My iPhone Get Stolen If I Leave it At The Airport For 72 Hours 📱',
		desc: 'Will My iPhone Get Stolen If I Leave it At The Airport For 72 Hours 📱',
		thumbnails: {
			default: 'https://i.ytimg.com/vi/tPy6T36VSnk/default.jpg',
			medium: 'https://i.ytimg.com/vi/tPy6T36VSnk/mqdefault.jpg',
			high: 'https://i.ytimg.com/vi/tPy6T36VSnk/hqdefault.jpg',
			standard: 'https://i.ytimg.com/vi/tPy6T36VSnk/sddefault.jpg',
			maxres: 'https://i.ytimg.com/vi/tPy6T36VSnk/maxresdefault.jpg'
		},
		channelTitle: 'The Richey Family',
		statistics: {
			viewCount: '14611135',
			likeCount: '302138',
			favoriteCount: '0',
			commentCount: '418'
		},
		avatarUrl:
			'https://yt3.ggpht.com/KTnBm8zh850H_fcmDMdqeJaupJV0oGuRLZGM3DXXkyIaN-OLLNbcfFQJ_vGgHYJcod8REmvQ=s88-c-k-c0x00ffffff-no-rj'
	},
	{
		id: 'vy7v3RE1CRs',
		publishedAt: '2025-06-15T08:46:52Z',
		channelId: 'UCQK_cRi7J_9j5AqOqsGm3qA',
		title: "🧸What's your Favorite? Send me a color 🧡💜🖤🩷 Labubu Challenge #shorts #challeger",
		desc: '',
		thumbnails: {
			default: 'https://i.ytimg.com/vi/vy7v3RE1CRs/default.jpg',
			medium: 'https://i.ytimg.com/vi/vy7v3RE1CRs/mqdefault.jpg',
			high: 'https://i.ytimg.com/vi/vy7v3RE1CRs/hqdefault.jpg',
			standard: 'https://i.ytimg.com/vi/vy7v3RE1CRs/sddefault.jpg',
			maxres: 'https://i.ytimg.com/vi/vy7v3RE1CRs/maxresdefault.jpg'
		},
		channelTitle: 'ALEX KING',
		statistics: {
			viewCount: '4470192',
			likeCount: '59291',
			favoriteCount: '0',
			commentCount: '91'
		},
		avatarUrl:
			'https://yt3.ggpht.com/DwW1ZGkfmbGvsDQSMfHjceLalnh4k_3hp_c6vUFVuS1EwSkT7eqqkurtGTsxh1dcaKFN2wFmsZ0=s88-c-k-c0x00ffffff-no-rj'
	},
	{
		id: 'L6YZImsw-LE',
		publishedAt: '2025-06-15T01:39:53Z',
		channelId: 'UC5_QJxDeFiHo5u9PXERSI_Q',
		title: 'When they forget noob in town ☠️ PT8 - Roblox Dead Rails #robloxanimation',
		desc: 'When they forget noob in town ☠️ PT8 - Roblox Dead Rails #roblox #robloxanimation #deadrails',
		thumbnails: {
			default: 'https://i.ytimg.com/vi/L6YZImsw-LE/default.jpg',
			medium: 'https://i.ytimg.com/vi/L6YZImsw-LE/mqdefault.jpg',
			high: 'https://i.ytimg.com/vi/L6YZImsw-LE/hqdefault.jpg',
			standard: 'https://i.ytimg.com/vi/L6YZImsw-LE/sddefault.jpg',
			maxres: 'https://i.ytimg.com/vi/L6YZImsw-LE/maxresdefault.jpg'
		},
		channelTitle: 'Ninja Roblox',
		statistics: {
			viewCount: '11870986',
			likeCount: '314616',
			favoriteCount: '0',
			commentCount: '1363'
		},
		avatarUrl:
			'https://yt3.ggpht.com/VCJY6HzW3rfsuG8dcjGQu9tfatyUkX2DyDzr51S0q2xCOw81hMzsYTRXU0_GXxuwm5B5QG1Yk0c=s88-c-k-c0x00ffffff-no-rj'
	},
	{
		id: 'Bk_T1SObUS4',
		publishedAt: '2025-06-12T08:05:41Z',
		channelId: 'UC5T7D-Dh1eDGtsAFCuwv_Sw',
		title: 'Man holding meat cleaver tackled and arrested at Parramatta Station, Sydney',
		desc: 'A man carrying a meat cleaver has been tackled and arrested at Parramatta Station as stunned commuters watched on. #parra #parramatta #train #trainstation #sydneytrains #westernsydney #sydney #crime #sydneycrime #police #nswpolice #7NEWS',
		thumbnails: {
			default: 'https://i.ytimg.com/vi/Bk_T1SObUS4/default.jpg',
			medium: 'https://i.ytimg.com/vi/Bk_T1SObUS4/mqdefault.jpg',
			high: 'https://i.ytimg.com/vi/Bk_T1SObUS4/hqdefault.jpg',
			standard: 'https://i.ytimg.com/vi/Bk_T1SObUS4/sddefault.jpg',
			maxres: 'https://i.ytimg.com/vi/Bk_T1SObUS4/maxresdefault.jpg'
		},
		channelTitle: '7NEWS Australia',
		statistics: {
			viewCount: '8334635',
			likeCount: '199734',
			favoriteCount: '0'
		},
		avatarUrl:
			'https://yt3.ggpht.com/w5xf-v0TWSJTOy4fKRjRvS3C0CXOUbpvp87VAo3sA4YH1BqDI4XdAXO4OunYpV3XrARuh6qiXw=s88-c-k-c0x00ffffff-no-rj'
	},
	{
		id: 'yk4QjBUBEm0',
		publishedAt: '2025-06-12T13:01:14Z',
		channelId: 'UCkUVogkdIBrfQ-yKKZNjXHQ',
		title:
			'FINALMENTE TUTTI INSIEME A BALLARE KING & QUEEN 🥰#congiuntiimperfetti #shortvideo #king #queen',
		desc: '',
		thumbnails: {
			default: 'https://i.ytimg.com/vi/yk4QjBUBEm0/default.jpg',
			medium: 'https://i.ytimg.com/vi/yk4QjBUBEm0/mqdefault.jpg',
			high: 'https://i.ytimg.com/vi/yk4QjBUBEm0/hqdefault.jpg',
			standard: 'https://i.ytimg.com/vi/yk4QjBUBEm0/sddefault.jpg',
			maxres: 'https://i.ytimg.com/vi/yk4QjBUBEm0/maxresdefault.jpg'
		},
		channelTitle: 'congiuntiimperfetti',
		statistics: {
			viewCount: '654174',
			likeCount: '13952',
			favoriteCount: '0',
			commentCount: '348'
		},
		avatarUrl:
			'https://yt3.ggpht.com/cO3RTZHGTDzE44RPuVA85rhCX8nmJANsKqAUmb0RmrEX-XmJClythKGdXq04NVAZowHJF2lCNw=s88-c-k-c0x00ffffff-no-rj'
	},
	{
		id: '6Y5XRJLmHRs',
		publishedAt: '2025-06-15T22:01:38Z',
		channelId: 'UCSZ21xyG8w_33KriMM69IxQ',
		title: 'PSG OVERPOWER Atlético Madrid In 4-0 Finish | FIFA Club World Cup',
		desc: "FIFA Club World Cup 2025 | June 14 - July 13 | EVERY GAME FREE on DAZN\nThe home for football on DAZN.\n\nWatch The FIFA Club World Cup Here \nhttp://www.dazn.com/DAZNFootballSocial\n\nPSG OVERPOWER Atlético Madrid In 4-0 Finish | FIFA Club World Cup\n\nAbout DAZN Football:\nWelcome to DAZN Football, your ultimate destination for thrilling sports action, featuring the Champions League (in New Zealand), the Saudi Pro League, the National League... and more. Watch iconic stars like Ronaldo and Neymar in intense battles for supremacy and beyond! From the FIFA Club World Cup to Champions League showdowns, we're on a mission to SHOW THE JOY IN SPORT! Immerse yourself in exclusive content and expert analysis, and join a global community of passionate fans. Subscribe now for a front-row seat to the magic of sports and get to know all your favorite players OFF THE PITCH and what makes them tick!",
		thumbnails: {
			default: 'https://i.ytimg.com/vi/6Y5XRJLmHRs/default.jpg',
			medium: 'https://i.ytimg.com/vi/6Y5XRJLmHRs/mqdefault.jpg',
			high: 'https://i.ytimg.com/vi/6Y5XRJLmHRs/hqdefault.jpg',
			standard: 'https://i.ytimg.com/vi/6Y5XRJLmHRs/sddefault.jpg',
			maxres: 'https://i.ytimg.com/vi/6Y5XRJLmHRs/maxresdefault.jpg'
		},
		channelTitle: 'DAZN Football',
		statistics: {
			viewCount: '5018635',
			likeCount: '70328',
			favoriteCount: '0',
			commentCount: '3146'
		},
		avatarUrl:
			'https://yt3.ggpht.com/YZITR3Ytb1lT_yV-eaAU-Yc6O6kcm3yvTan_uJRB0lHJm6zpzu3HYFhwhmSyse_tPpzyenUVFoc=s88-c-k-c0x00ffffff-no-rj'
	},
	{
		id: 'MLpfS1UWKsE',
		publishedAt: '2025-06-16T11:51:25Z',
		channelId: 'UCYr4pfDqgHGNmTRDIhNz2Vg',
		title: 'COSTRUISCI LA PAROLA PT.3',
		desc: '',
		thumbnails: {
			default: 'https://i.ytimg.com/vi/MLpfS1UWKsE/default.jpg',
			medium: 'https://i.ytimg.com/vi/MLpfS1UWKsE/mqdefault.jpg',
			high: 'https://i.ytimg.com/vi/MLpfS1UWKsE/hqdefault.jpg',
			standard: 'https://i.ytimg.com/vi/MLpfS1UWKsE/sddefault.jpg',
			maxres: 'https://i.ytimg.com/vi/MLpfS1UWKsE/maxresdefault.jpg'
		},
		channelTitle: 'Ale e Piè Official',
		statistics: {
			viewCount: '425098',
			likeCount: '35529',
			favoriteCount: '0',
			commentCount: '338'
		},
		avatarUrl:
			'https://yt3.ggpht.com/YpAbvJYUHnLJ9NvtVhyy_6wobUakiwaPyuiGC7NTeyUixfjTLRVEa41gQshibK8-tcsoUxIH=s88-c-k-c0x00ffffff-no-rj'
	},
	{
		id: 'MnqqQpLnWyc',
		publishedAt: '2025-06-15T09:00:07Z',
		channelId: 'UCwjrf475hoHRJZc5SMnZzng',
		title: 'Me contro Te e Tara - 4 SCIMMIE (Videoclip Ufficiale)',
		desc: '"4 Scimmie" è la canzone dell\'estate dei Me contro te insieme alla loro amica Tara! Ascolta e balla la coreografia del ballo di gruppo delle scimmie!\n\n🎶 SPOTIFY:\nhttps://spoti.fi/35z0Nhq\n\nTESTO:\nQuest’estate \nNella giungla noi andremo in gita\nPuoi restare \nIn vacanza tutta la vita \nSi fa festa sulla spiaggia tra le palme e i bambù\n4 scimmie come amiche ti puoi unire anche tu \n\nQuesta è la mia tribù \nOgnuna col suo mood  \nAu au au\n\nC’è La biondina \nC’è La bassina \nQuella un po’ diva \nLa timidina \n\nBraccia in avanti \nSalto indietro \nmani sui fianchi \nShakera un po’ \nGratta la testa \nPancia all’insù \nMuovi la coda \nE dopo vai giù \n\nLa biondina  \nDice a le altre andiamo a ballare\nLa bassina \nDice a me non mi fanno entrare \nQuella diva si prepara ma ci mette un secolo \nLa timidina si vergogna dice andate voi io no \n\nQuesta è la mia tribù\nOgnuno col suo mood\n\nC’è La biondina \nC’è La bassina \nQuella un po’ diva \nLa timidina \n\nBraccia in avanti \nSalto indietro \nmani sui fianchi \nShakera un po’ \nGratta la testa \nPancia all’insù \nMuovi la coda \nE dopo vai giù \n\nE ora tutte le ragazze con le mani sui fianchi\nMuovili Muovili Muovili\nE ora tutti i ragazzi con le mani sui fianchi\nMuovili Muovili Muovili \n\nSocial:\nhttps://instagram.com/mecontrote\nhttps://instagram.com/sofi.scalia\nhttps://instagram.com/luigi.calagna\n\nhttps://www.tiktok.com/@mecontrote\n\nCREDITI:\nProduzione: Me contro Te\nAngelica Furlato (Tara)\nGiampaolo Merletti (Guardia)\nSofia Scalia\nLuigi Calagna\n\nRegia: Luigi Calagna \nAiuto regista: Jacopo Ciampanelli\nDOP: Vito  Trecarichi\nGaffer: Jorge Abraham Silva Palma\nScenografie: Marco Borgonovo\nCostumi: Tecla Turiaco\nAiuto costumi: Alessandra Gramaglia \nMUA: Tea Bakota\nVideo backstage: Davide Borroni\nFoto backstage: Lorenzo Calzone\nCoreografie: Matteo Passini\nBallerina: Letizia Caruso\nBallerina: Michela Mortari\nBallerino: Marco Valentino\nBallerino: Simone Lo Presti\n\nProd Musicale: Riccardo Garifo\nVito Ventura\nLuigi Calagna\nSofia Scalia\n\nbrano interpretato da :\nAngelica Furlato , Sofia Scalia e Luigi Calagna\n\nRingraziamo la Fondazione Minoprio per la location\n\n#MeControTe #MeControTeMusic\n\n© ME CONTRO TE e tutti i personaggi, i nomi e i relativi marchi sono di proprietà e gestione esclusiva di Me Contro Te Srl. Tutti i Diritti Riservati.',
		thumbnails: {
			default: 'https://i.ytimg.com/vi/MnqqQpLnWyc/default.jpg',
			medium: 'https://i.ytimg.com/vi/MnqqQpLnWyc/mqdefault.jpg',
			high: 'https://i.ytimg.com/vi/MnqqQpLnWyc/hqdefault.jpg',
			standard: 'https://i.ytimg.com/vi/MnqqQpLnWyc/sddefault.jpg',
			maxres: 'https://i.ytimg.com/vi/MnqqQpLnWyc/maxresdefault.jpg'
		},
		channelTitle: 'Me contro Te Music',
		statistics: {
			viewCount: '202733',
			likeCount: '3275',
			favoriteCount: '0',
			commentCount: '615'
		},
		avatarUrl:
			'https://yt3.ggpht.com/ytc/AIdro_nqggfZ9UhfDNYhXanCjxT6KIgl69Jk9rx6dKdonRPrTnM=s88-c-k-c0x00ffffff-no-rj'
	}
];
