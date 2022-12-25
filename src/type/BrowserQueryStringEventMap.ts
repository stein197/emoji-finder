import type {BrowserQueryStringMap} from "app/type/BrowserQueryStringMap";

export type BrowserQueryStringEventMap = {
	change(query: BrowserQueryStringMap): void;
}
