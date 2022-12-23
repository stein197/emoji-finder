import Config from "app/config";
import WorkerRunner from "app/WorkerRunner";
import * as util from "app/util";
import type {Emoji} from "app/type/Emoji";
import type {EmojiWorkerRequest} from "app/type/EmojiWorkerRequest";
import type {EmojiWorkerResponse} from "app/type/EmojiWorkerResponse";

const config: Config = new Config(util.URL_CONFIG);
let loaded: boolean = false;
let data: Emoji[] = [];

(function main(): void {
	const runner = new WorkerRunner<EmojiWorkerRequest, EmojiWorkerResponse>(window);
	runner.handler = onMessage;
	runner.run();
})();

async function onMessage(request: EmojiWorkerRequest): Promise<EmojiWorkerResponse> {
	try {
		await tryLoad();
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

async function tryLoad(): Promise<void> {
	if (loaded)
		return;
	await config.load();
	data = await util.loadJSON<Emoji[]>(`/${config.data!.url.emoji}`);
	loaded = true;
}
