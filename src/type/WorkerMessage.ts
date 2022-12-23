export type WorkerMessage<T> = {
	id: number;
	data: T;
}
