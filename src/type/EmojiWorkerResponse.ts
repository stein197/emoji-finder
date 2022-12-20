import type {Emoji} from "app/type/Emoji";

export type EmojiWorkerResponse = {
	id: number;
} & ({
	data: Emoji[]
} | {
	error: {
		message: string;
	}
});