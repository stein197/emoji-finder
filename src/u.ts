import ResponseError from "error/ResponseError";

/**
 * The same as {@link Object.freeze} but performs it recursively.
 * @param object Object to deeply freeze.
 */
export function deepFreeze(object: any): void {
	if (object == null || typeof object !== "object")
		return;
	for (const key in object) {
		const child = object[key];
		if (child != null && !Object.isFrozen(child))
			deepFreeze(child);
	}
	Object.freeze(object);
}

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
	deepFreeze(data);
	return data;
}
