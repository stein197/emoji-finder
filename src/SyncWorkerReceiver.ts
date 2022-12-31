export default class SyncWorkerReceiver<T, U> {

	public handler: ((request: T) => Promise<U>) | null = null;

	public constructor(private readonly __context: app.worker.Context) {}

	public run(): void {
		this.__context.onmessage = this.onMessage;
	}

	private onMessage = async (e: MessageEvent<app.worker.Message<T>>): Promise<void> => {
		if (!this.handler)
			return;
		const {id, data} = e.data;
		const result = await this.handler(data);
		this.__context.postMessage({
			id,
			data: result
		} as app.worker.Message<U>);
	}
}
