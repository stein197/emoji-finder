import React from "react";
import ReactDOMClient from "react-dom/client";
import {EventDispatcher} from "@stein197/observer";
import App from "app/view/App";
import Config from "app/Config";
import Container from "app/Container";
import EmojiSearcher from "app/EmojiSearcher";
import * as util from "app/util";
import * as context from "app/view/context";
import type {EventEmitter} from "@stein197/observer";
import type {ApplicationEventMap} from "app/type/ApplicationEventMap";

export default class Application implements EventEmitter<ApplicationEventMap> {

	private readonly __dispatcher: EventDispatcher<ApplicationEventMap> = new EventDispatcher();
	private readonly __container: Container<[Config, EmojiSearcher]> = new Container();
	private __loaded: boolean = false;
	private __loadResult?: Error;

	public get container(): typeof this.__container {
		return this.__container;
	}

	public constructor(private readonly rootElement: HTMLElement) {}

	public run(): void {
		context.set(this);
		this.render();
		this.load();
	}

	public addEventListener<K extends keyof ApplicationEventMap>(key: K, listener: ApplicationEventMap[K]): void {
		if (key === "Load" && this.__loaded)
			listener(this.__loadResult);
		else
			this.__dispatcher.addEventListener(key, listener);
	}

	public removeEventListener<K extends keyof ApplicationEventMap>(key: K, listener: ApplicationEventMap[K]): void {
		this.__dispatcher.removeEventListener(key, listener);
	}

	public onceEventListener<K extends keyof ApplicationEventMap>(key: K, listener: ApplicationEventMap[K]): void {
		if (key === "Load" && this.__loaded)
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
			await this.__container.register(new Config(util.URL_CONFIG));
			await this.__container.register(new EmojiSearcher(util.URL_WORKER_EMOJI));
			this.__dispatcher.dispatch("Load");
		} catch (e) {
			this.__loadResult = e as Error;
			this.__dispatcher.dispatch("Load", this.__loadResult);
		}
		this.__loaded = true;
	}
}
