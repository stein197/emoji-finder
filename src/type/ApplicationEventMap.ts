export type ApplicationEventMap = {

	/**
	 * Fires on application load.
	 * @param error If there was any error while loading. `undefined` if the application was loaded successfully.
	 */
	Load(error?: Error): void;
}