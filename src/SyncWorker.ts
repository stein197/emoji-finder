import type {ObjectMap} from "@stein197/ts-util";

export default class SyncWorker<T, U> {

	private readonly __postResolveCallbackMap: ObjectMap<(response: U) => void> = {};
	private readonly __worker: Worker;
	private __id: number = 0;

	public constructor(private readonly __url: string) {
		this.__worker = new Worker(__url);
		this.__worker.onmessage = this.onMessage;
		this.__worker.onerror = this.onError;
	}

	public post(data: T): Promise<U> {
		this.__id++;
		const id = this.__id;
		return new Promise<U>(resolve => {
			this.__postResolveCallbackMap[id] = resolve;
			this.__worker.postMessage({
				id: this.__id,
				data: data
			} as app.worker.Message<T>);
		});

	}

	private onMessage = (e: MessageEvent<app.worker.Message<U>>): void => {
		const {id, data} = e.data;
		const callback = this.__postResolveCallbackMap[id];
		if (!callback)
			return;
		delete this.__postResolveCallbackMap[id];
		callback(data);
	}

	private onError = (): void => {
		throw new Error(`Unable to load worker at ${this.__url}`)
	}
}
