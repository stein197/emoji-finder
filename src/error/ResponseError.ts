/**
 * Error that represents HTTP response errors.
 */
export default class ResponseError extends Error {

	public constructor(public readonly response: Response, message?: string) {
		super(message ?? `Unable to request ${response.url}. Status: ${response.statusText}, ${response.status}`);
	}
}
