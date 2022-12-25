import * as object from "@stein197/util/object";
import * as util from "app/util";

export default class Config {

	private __loaded: boolean = false;
	private __data: typeof import("../config.json") | null = null;

	/**
	 * Returns config object or `null` if it's not loaded yet.
	 */
	public get data(): typeof this.__data {
		return this.__data;
	}

	public constructor(private readonly __url: string) {}

	/**
	 * Loads config.
	 */
	public async load(): Promise<void> {
		if (this.__loaded)
			return;
		this.__data = await util.loadJSON(this.__url);
		object.deepFreeze(this.__data);
		this.__loaded = true;
	}
}
