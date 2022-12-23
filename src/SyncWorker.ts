import type {WorkerMessage} from "app/type/WorkerMessage";

export default class SyncWorker<T, U> {

	private readonly __postResolveCallbackMap: {[ID in number]: (response: U) => void} = {};
	private readonly __worker: Worker;
	private __id: number = 0;

	public constructor(url: string) {
		this.__worker = new Worker(url);
		this.__worker.onmessage = this.onMessage;
	}

	public post(data: T): Promise<U> {
		this.__id++;
		const id = this.__id;
		return new Promise<U>(resolve => {
			this.__postResolveCallbackMap[id] = resolve;
			this.__worker.postMessage({
				id: this.__id,
				data: data
			} as WorkerMessage<T>);
		});

	}

	private onMessage = (e: MessageEvent<WorkerMessage<U>>): void => {
		const callback = this.__postResolveCallbackMap[e.data.id];
		if (!callback)
			return;
		delete this.__postResolveCallbackMap[e.data.id];
		callback(e.data.data);
	}
}
