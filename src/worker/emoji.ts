import type {EmojiWorkerRequest} from "type/EmojiWorkerRequest";
import type {EmojiWorkerResponse} from "type/EmojiWorkerResponse";
import * as u from "u";

const URL_DATA = "/emoji.json";

// TODO
window.onmessage = async (e: MessageEvent<EmojiWorkerRequest>): Promise<void> => {
	e;
	u.loadJSON(URL_DATA);
	const result: EmojiWorkerResponse = {
		data: []
	};
	window.postMessage(result);
}
