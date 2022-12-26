import {EventDispatcher, EventEmitter} from "@stein197/observer";
import * as qs from "@stein197/qs";
import * as object from "@stein197/util/object";
import type {BrowserQueryStringMap} from "app/type/BrowserQueryStringMap";
import type {BrowserQueryStringEventMap} from "app/type/event/BrowserQueryStringEventMap";
import type {BrowserQueryStringContext} from "app/type/BrowserQueryStringContext";

export default class BrowserQueryString<T> implements EventEmitter<BrowserQueryStringEventMap<T>> {

	private readonly __dispatcher: EventDispatcher<BrowserQueryStringEventMap<T>> = new EventDispatcher();

	public get data(): BrowserQueryStringMap {
		return qs.parse(this.__context.location.search.replace(/^\?/, ""), {
			scalars: false
		}) as BrowserQueryStringMap;
	}

	public constructor(private readonly __context: BrowserQueryStringContext) {}

	public set(query: Partial<T>, merge: boolean = true): void {
		const prevQuery = this.data;
		const newQuery = merge ? object.deepMerge(prevQuery, query) : query;
		if (object.strictlyEqual(prevQuery, newQuery))
			return;
		const strQuery = qs.stringify(newQuery);
		const location = this.__context.location;
		const newUrl = location.protocol + "//" + location.host + location.pathname + (strQuery ? ("?" + qs.stringify(newQuery)) : "");
		this.__context.history.pushState({
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
