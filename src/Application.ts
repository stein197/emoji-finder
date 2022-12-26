import React from "react";
import ReactDOMClient from "react-dom/client";
import App from "app/view/App";
import Config from "app/Config";
import Container from "app/Container";
import EmojiSearcher from "app/EmojiSearcher";
import BrowserQueryString from "app/BrowserQueryString";
import {EventDispatcher} from "@stein197/observer";
import * as util from "app/util";
import * as context from "app/view/context";
import type {EventEmitter} from "@stein197/observer";
import type {ApplicationEventMap} from "app/type/event/ApplicationEventMap";
import type { BrowserQueryStringMap } from "./type/BrowserQueryStringMap";

export default class Application implements EventEmitter<ApplicationEventMap> {

	public readonly container: Container<[Config, EmojiSearcher, BrowserQueryString<BrowserQueryStringMap>]> = new Container();

	private readonly __dispatcher: EventDispatcher<ApplicationEventMap> = new EventDispatcher();
	private __loaded: boolean = false;
	private __loadResult?: Error;

	public constructor(public readonly global: Window, private readonly rootElement: HTMLElement) {}

	public run(): void {
		context.set(this);
		this.render();
		this.load();
	}

	public addEventListener<K extends keyof ApplicationEventMap>(key: K, listener: ApplicationEventMap[K]): void {
		if (key === "load" && this.__loaded)
			listener(this.__loadResult);
		else
			this.__dispatcher.addEventListener(key, listener);
	}

	public removeEventListener<K extends keyof ApplicationEventMap>(key: K, listener: ApplicationEventMap[K]): void {
		this.__dispatcher.removeEventListener(key, listener);
	}

	public onceEventListener<K extends keyof ApplicationEventMap>(key: K, listener: ApplicationEventMap[K]): void {
		if (key === "load" && this.__loaded)
			listener(this.__loadResult);
		else
			this.__dispatcher.onceEventListener(key, listener);
	}

	private render(): void {
		const root = ReactDOMClient.createRoot(this.rootElement);
		root.render(React.createElement(App, {
			application: this
		}));
	}

	private async load(): Promise<void> {
		if (this.__loaded)
			return;
		try {
			const config = new Config(util.URL_CONFIG);
			await config.load();
			this.container.add(config);
			this.container.add(new EmojiSearcher(util.URL_WORKER_EMOJI));
			this.container.add(new BrowserQueryString(this.global.history, this.global.location));
			this.__dispatcher.dispatch("load");
		} catch (e) {
			this.__loadResult = e as Error;
			this.__dispatcher.dispatch("load", this.__loadResult);
		}
		this.__loaded = true;
	}
}
