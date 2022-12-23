import type {Emoji} from "app/type/Emoji";

export type EmojiWorkerResponse = {
	data: Emoji[]
} | {
	error: {
		message: string;
	}
}
