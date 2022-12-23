import WorkerRunner from "app/WorkerRunner";
import * as util from "app/util";
import * as config from "app/config";
import type {Emoji} from "app/type/Emoji";
import type {EmojiWorkerRequest} from "app/type/EmojiWorkerRequest";
import type {EmojiWorkerResponse} from "app/type/EmojiWorkerResponse";

(function main(): void {
	const runner = new WorkerRunner<EmojiWorkerRequest, EmojiWorkerResponse>(window);
	runner.handler = onMessage;
	runner.run();
})();

async function onMessage(request: EmojiWorkerRequest): Promise<EmojiWorkerResponse> {
	try {
		await config.load();
		const data = await util.loadJSON<Emoji[]>(`/${config.get()!.url.emoji}`);
		return {
			id: request.id,
			data: util.searchEmoji(request.q, data)
		};
	} catch (err) {
		return {
			id: request.id,
			error: {
				message: String(err)
			}
		};
	}
}
