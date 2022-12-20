import * as util from "app/util";
import * as config from "app/config";
import type {Emoji} from "app/type/Emoji";
import type {EmojiWorkerRequest} from "app/type/EmojiWorkerRequest";
import type {EmojiWorkerResponse} from "app/type/EmojiWorkerResponse";

window.onmessage = async (e: MessageEvent<EmojiWorkerRequest>): Promise<void> => {
	try {
		await config.load();
		const data = await util.loadJSON<Emoji[]>(`/${config.get()!.url.emoji}`);
		const result: EmojiWorkerResponse = {
			id: e.data.id,
			data: util.searchEmoji(e.data.q, data)
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
