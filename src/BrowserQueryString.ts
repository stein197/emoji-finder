import * as qs from "@stein197/qs";
import * as object from "@stein197/util/object";

export default class BrowserQueryString<T> {

	public get data(): Partial<app.bqs.Data> {
		return qs.parse(this.__context.location.search.replace(/^\?/, ""), {
			scalars: false
		}) as Partial<app.bqs.Data>;
	}

	public constructor(private readonly __context: app.bqs.Context) {}

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
