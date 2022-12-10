import React from "react";
import ReactDOMClient from "react-dom/client";
import {EventDispatcher} from "@stein197/observer";
import App from "view/App";
import * as u from "u";
import * as context from "view/context";
import type {EventEmitter} from "@stein197/observer";
import type {ApplicationEvent} from "type/ApplicationEvent";
import type {Config} from "type/Config";
import type {Emoji} from "type/Emoji";

export default class Application implements EventEmitter<ApplicationEvent> {

	private static readonly URL_CONFIG = "config.json";

	private readonly eventDispatcher = new EventDispatcher<ApplicationEvent>();
	private __config: Config | null = null;
	private __emoji: Emoji[] | null = null;
	private __loaded: boolean = false;
	private __loadResult?: Error;

	public get config(): Config | null {
		return this.__config;
	}

	public get emoji(): Emoji[] | null {
		return this.__emoji;
	}

	public constructor(private readonly rootElement: HTMLElement) {}

	public run(): void {
		context.set(this);
		this.render();
		this.load();
	}

	public addEventListener<K extends keyof ApplicationEvent>(key: K, listener: ApplicationEvent[K]): void {
		if (key === "Load" && this.__loaded)
			listener(this.__loadResult);
		else
			this.eventDispatcher.addEventListener(key, listener);
	}

	public removeEventListener<K extends keyof ApplicationEvent>(key: K, listener: ApplicationEvent[K]): void {
		this.eventDispatcher.removeEventListener(key, listener);
	}

	public onceEventListener<K extends keyof ApplicationEvent>(key: K, listener: ApplicationEvent[K]): void {
		if (key === "Load" && this.__loaded)
			listener(this.__loadResult);
		else
			this.eventDispatcher.onceEventListener(key, listener);
	}

	private render(): void {
		const root = ReactDOMClient.createRoot(this.rootElement);
		root.render(React.createElement(App, {
			application: this
		}));
	}

	private async load(): Promise<void> {
		try {
			this.__config = await u.loadJSON(Application.URL_CONFIG, true);
			this.__emoji = await u.loadJSON(this.__config!.url.emoji, true);
			this.eventDispatcher.dispatch("Load");
		} catch (e) {
			this.__loadResult = e as Error;
			this.eventDispatcher.dispatch("Load", this.__loadResult);
		}
		this.__loaded = true;
	}
}
