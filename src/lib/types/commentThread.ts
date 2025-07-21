// src/lib/types/commentThread.ts
// This file defines the types used for comment threads in the application
export type Comment = {
	id: string;
	authorDisplayName: string;
	authorChannelId: string;
	authorChannelUrl: string;
	authorProfileImageUrl: string;
	textDisplay: string;
	publishedAt: string;
	likeCount: number;
};

export type CommentThread = {
	id: string;
	topLevelComment: Comment;
	replies: Comment[];
};
