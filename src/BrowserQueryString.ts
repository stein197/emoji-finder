import {EventDispatcher, EventEmitter} from "@stein197/observer";
import * as qs from "@stein197/qs";
import * as object from "@stein197/util/object";
import type {BrowserQueryStringMap} from "app/type/BrowserQueryStringMap";
import type {BrowserQueryStringEventMap} from "app/type/event/BrowserQueryStringEventMap";

export default class BrowserQueryString<T> implements EventEmitter<BrowserQueryStringEventMap<T>> {

	private readonly __dispatcher: EventDispatcher<BrowserQueryStringEventMap<T>> = new EventDispatcher();

	public get data(): BrowserQueryStringMap {
		return qs.parse(this.__location.search.replace(/^\?/, "")) as BrowserQueryStringMap;
	}

	public constructor(private readonly __history: History, private readonly __location: Location) {}

	public set(query: Partial<T>, merge: boolean = true): void {
		const prevQuery = this.data;
		const newQuery = merge ? object.deepMerge(prevQuery, query) : query;
		const strQuery = qs.stringify(newQuery);
		const newUrl = this.__location.protocol + "//" + this.__location.host + this.__location.pathname + (strQuery ? ("?" + qs.stringify(newQuery)) : "");
		this.__history.pushState({
			path: newUrl
		}, "", newUrl);
		this.__dispatcher.dispatch("change", newQuery);
	}

	public addEventListener<K extends keyof BrowserQueryStringEventMap<T>>(key: K, listener: BrowserQueryStringEventMap<T>[K]): void {
		this.__dispatcher.addEventListener(key, listener);
	}

	public removeEventListener<K extends keyof BrowserQueryStringEventMap<T>>(key: K, listener: BrowserQueryStringEventMap<T>[K]): void {
		this.__dispatcher.removeEventListener(key, listener);
	}

	public onceEventListener<K extends keyof BrowserQueryStringEventMap<T>>(key: K, listener: BrowserQueryStringEventMap<T>[K]): void {
		this.__dispatcher.onceEventListener(key, listener);
	}
}
