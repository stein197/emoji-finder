import * as qs from "@stein197/qs";
import * as object from "@stein197/util/object";
import type {BrowserQueryStringMap} from "app/type/BrowserQueryStringMap";
import type {BrowserQueryStringContext} from "app/type/BrowserQueryStringContext";

export default class BrowserQueryString<T> {

	public get data(): Partial<BrowserQueryStringMap> {
		return qs.parse(this.__context.location.search.replace(/^\?/, ""), {
			scalars: false
		}) as Partial<BrowserQueryStringMap>;
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
	}
}
