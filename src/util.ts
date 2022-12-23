import * as object from "@stein197/util/object";
import ResponseError from "app/error/ResponseError";
import type {Emoji} from "app/type/Emoji";

export const URL_CONFIG: string = "/config.json";

const REGEX_SPACE = /\s+/;

/**
 * Loads and parses JSON file and returns the resulting JSON.
 * @throws {@link ResponseError} If the request to load wasn't successful.
 * @throws {@link Error} In other cases.
 */
export async function loadJSON<T>(url: string, log: boolean = false): Promise<T> {
	if (log)
		console.info(`Loading ${url}`);
	const response = await window.fetch(url);
	if (!response.ok)
		throw new ResponseError(response);
	const data: T = await response.json();
	object.deepFreeze(data);
	return data;
}

export function searchEmoji(query: string, data: Emoji[]): Emoji[] {
	const queryTagArray = query.trim().toLowerCase().split(REGEX_SPACE).filter(tag => tag);
	return data.filter(emoji => queryTagArray.every(queryTag => emoji.tags.some(emojiTag => emojiTag.toLowerCase().indexOf(queryTag) >= 0)));
}
