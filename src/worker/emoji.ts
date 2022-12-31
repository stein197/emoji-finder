import Config from "app/config";
import SyncWorkerReceiver from "app/SyncWorkerReceiver";
import * as util from "app/util";

const config: Config = new Config(util.URL_CONFIG);
let loaded: boolean = false;
let data: app.emoji.Emoji[] = [];

(function main(): void {
	const runner = new SyncWorkerReceiver<app.emoji.worker.Request, app.emoji.worker.Response>(self);
	runner.handler = onMessage;
	runner.run();
})();

async function onMessage(request: app.emoji.worker.Request): Promise<app.emoji.worker.Response> {
	try {
		await tryLoad();
		const result = util.searchEmoji(request.query, data);
		return {
			data: result.slice(0, request.amount),
			next: request.amount < result.length
		};
	} catch (err) {
		return {
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
	data = await util.loadJSON<app.emoji.Emoji[]>(`/${config.data!.url.emoji}`);
	loaded = true;
}
