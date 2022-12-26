import type {Emoji} from "app/type/Emoji";

export type EmojiWorkerResponse = EmojiWorkerSuccessResponse | EmojiWorkerErrorResponse;

export type EmojiWorkerSuccessResponse = {
	data: Emoji[];
	next: boolean;
}

export type EmojiWorkerErrorResponse = {
	error: {
		message: string;
	}
}
