import * as u from "u";
import type {Emoji} from "type/Emoji";
import type {EmojiWorkerRequest} from "type/EmojiWorkerRequest";
import type {EmojiWorkerResponse} from "type/EmojiWorkerResponse";

const URL_DATA = "/emoji.json";
const REGEX_SPACE = /\s+/g;

window.onmessage = async (e: MessageEvent<EmojiWorkerRequest>): Promise<void> => {
	try {
		const data = await u.loadJSON<Emoji[]>(URL_DATA);
		const result: EmojiWorkerResponse = {
			id: e.data.id,
			data: u.searchEmoji(e.data.q, data)
		};
		window.postMessage(result);
	} catch (err) {
		const result: EmojiWorkerResponse = {
			id: e.data.id,
			error: {
				message: String(err)
			}
		};
		window.postMessage(result);
	}
}
