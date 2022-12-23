import type {WorkerContext} from "app/type/WorkerContext";
import type {WorkerMessage} from "app/type/WorkerMessage";

export default class SyncWorkerReceiver<T, U> {

	public handler: ((request: T) => Promise<U>) | null = null;

	public constructor(private readonly __context: WorkerContext) {}

	public run(): void {
		this.__context.onmessage = this.onMessage;
	}

	private onMessage = async (e: MessageEvent<WorkerMessage<T>>): Promise<void> => {
		if (!this.handler)
			return;
		const {id, data} = e.data;
		const result = await this.handler(data);
		this.__context.postMessage({
			id,
			data: result
		} as WorkerMessage<U>);
	}
}
