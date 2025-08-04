export interface Channel {
	id: string;
	subscriptionId?: string; // Optional, used to store the subscription ID if available
	title: string;
	description: string;
	customUrl: string;
	publishedAt: string;
	thumbnails: {
		default: {
			url: string;
			width: number;
			height: number;
		};
		medium: {
			url: string;
			width: number;
			height: number;
		};
		high: {
			url: string;
			width: number;
			height: number;
		};
	};
	statistics: {
		viewCount: string;
		subscriberCount: string;
		hiddenSubscriberCount: boolean;
		videoCount: string;
	};
}
