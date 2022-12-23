import type {WorkerContext} from "app/type/WorkerContext";

/**
 * Wrapper around worker backend listening.
 * @example
 * ```ts
 * // Instead of directly using window.onmessage and window.postMessage
 * const runner = new WorkerRunner<{data: string}, string>(window);
 * runner.handler = response => Promise.resolve(response.data.toLowerCase());
 * runner.run();
 * ```
 */
export default class WorkerRunner<T, U> {

	/**
	 * Handler that accepts request from frontend and returns a promise that resolved to a response back to the frontend
	 */
	public handler: ((request: T) => Promise<U>) | null = null;

	public constructor(private readonly __context: WorkerContext) {}

	/**
	 * Runs backend worker and starts to listen to incoming messages.
	 */
	public run(): void {
		this.__context.onmessage = this.onMessage;
	}

	private onMessage = async (e: MessageEvent<T>): Promise<void> => {
		if (!this.handler)
			return;
		const result = await this.handler(e.data);
		this.__context.postMessage(result);
	}
}
