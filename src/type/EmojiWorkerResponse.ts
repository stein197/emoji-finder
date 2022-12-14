import type {Emoji} from "type/Emoji";

export type EmojiWorkerResponse = {
	id: number;
} & ({
	data: Emoji[]
} | {
	error: {
		message: string;
	}
});