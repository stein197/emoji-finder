export type BrowserQueryStringEventMap<T> = {
	change(query: Partial<T>): void;
}
