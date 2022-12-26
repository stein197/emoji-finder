import SyncWorker from "app/SyncWorker";
import type {EmojiWorkerRequest} from "app/type/EmojiWorkerRequest";
import type {EmojiWorkerResponse, EmojiWorkerSuccessResponse} from "app/type/EmojiWorkerResponse";

export default class EmojiSearcher {

	private readonly __worker: SyncWorker<EmojiWorkerRequest, EmojiWorkerResponse>;

	public constructor(workerURL: string) {
		this.__worker = new SyncWorker(workerURL);
	}

	public async search(query: string, amount: number): Promise<EmojiWorkerSuccessResponse> {
		const result = await this.__worker.post({query, amount});
		if ("data" in result)
			return result;
		throw new Error(result.error.message);
	}
}
