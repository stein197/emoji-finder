import ResponseError from "app/error/ResponseError";
import * as object from "@stein197/util/object";

export const URL_CONFIG: string = "/config.json";
export const URL_WORKER_EMOJI: string = "/worker/emoji.js";

const REGEX_SPACE = /\s+/;

/**
 * Loads and parses JSON file and returns the resulting JSON.
 * @throws {@link ResponseError} If the request to load wasn't successful.
 * @throws {@link Error} In other cases.
 */
export async function loadJSON<T>(url: string, log: boolean = false): Promise<T> {
	if (log)
		console.info(`Loading ${url}`);
	const response = await self.fetch(url);
	if (!response.ok)
		throw new ResponseError(response);
	const data: T = await response.json();
	object.deepFreeze(data);
	return data;
}

export function searchEmoji(query: string, data: app.emoji.Emoji[]): app.emoji.Emoji[] {
	const queryTagArray = query.trim().toLowerCase().split(REGEX_SPACE).filter(tag => tag);
	return data.filter(emoji => queryTagArray.every(queryTag => emoji.tags.some(emojiTag => emojiTag.toLowerCase().indexOf(queryTag) >= 0)));
}

/**
 * Creates className attribute for JSX elements. Filters out empty items.
 * @param names List of class names.
 * @returns Object of React-attributes that contain single `className` property.
 */
export function className(...names: string[]): {className: string} {
	return {
		className: names.filter(name => name).join(" ")
	};
}
