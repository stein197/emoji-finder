export {};

declare global {

	export module app {

		export type Constructor<T> = new (...args: any[]) => T;
		
		export type Button = {
			readonly text: string;
			readonly value: string;
		}
		
		export module event {
		
			export type ApplicationEventMap = {
		
				/**
				 * Fires on application load.
				 * @param error If there was any error while loading. `undefined` if the application was loaded successfully.
				 */
				load(error?: Error): void;
			}
		}
		
		export module emoji {
		
			export type Emoji = {
				codes: number[];
				variations: {
					apple?: string;
					google?: string;
					facebook?: string;
					windows?: string;
					twitter?: string;
					joypixels?: string;
					samsung?: string;
					gmail?: string;
					softbank?: string;
					dcm?: string;
					kddi?: string;
				};
				tags: string[];
			}
		
			export module worker {
		
				export type Request = {
					query: string;
					amount: number;
				}
		
				export type Response = SuccessResponse | ErrorResponse;
		
				type SuccessResponse = {
					data: Emoji[];
					next: boolean;
				}
		
				type ErrorResponse = {
					error: {
						message: string;
					}
				}
			}
		}
		
		export module bqs {
		
			export type Context = Pick<Window, "history" | "location">;
		
			export type Data = {
				query: string;
				variation: string;
			}
		}
		
		export module worker {
		
			export type Context = Pick<Window, "onmessage" | "postMessage">;
		
			export type Message<T> = {
				id: number;
				data: T;
			}
		}
	}
}
