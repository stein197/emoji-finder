import SyncWorker from "app/SyncWorker";

export default class EmojiSearcher {

	private readonly __worker: SyncWorker<app.emoji.worker.Request, app.emoji.worker.Response>;

	public constructor(workerURL: string) {
		this.__worker = new SyncWorker(workerURL);
	}

	public async search(query: string, amount: number): Promise<app.emoji.worker.SuccessResponse> {
		const result = await this.__worker.post({query, amount});
		if ("data" in result)
			return result;
		throw new Error(result.error.message);
	}
}
