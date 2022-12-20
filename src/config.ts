import * as u from "u";
import type {Config} from "type/Config";

const URL_CONFIG = "/config.json";
let config: Config | null;

/**
 * Returns config object or `null` if it's not loaded yet.
 * @returns Config object or `null`.
 */
export function get(): Config | null {
	return config;
}

/**
 * Loads and returns config. Returns config if the one is already loaded.
 * @returns Loaded config.
 */
export async function load(): Promise<Config> {
	if (!config)
		config = await u.loadJSON(URL_CONFIG);
	return config!;
}
