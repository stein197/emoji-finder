import React from "react";
import ReactDOMClient from "react-dom/client";
import {EventDispatcher} from "@stein197/observer";
import App from "app/view/App";
import Config from "app/Config";
import Container from "app/Container";
import * as util from "app/util";
import * as context from "app/view/context";
import type {EventEmitter} from "@stein197/observer";
import type {ApplicationEventMap} from "app/type/ApplicationEventMap";
import type {Emoji} from "app/type/Emoji";

export default class Application implements EventEmitter<ApplicationEventMap> {

	private readonly eventDispatcher = new EventDispatcher<ApplicationEventMap>();
	private __emoji: Emoji[] | null = null;
	private __loaded: boolean = false;
	private __loadResult?: Error;
	private readonly __container: Container<[Config]> = new Container<[Config]>([
		new Config(util.URL_CONFIG)
	]);

	public get emoji(): Emoji[] | null {
		return this.__emoji;
	}

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
			this.eventDispatcher.addEventListener(key, listener);
	}

	public removeEventListener<K extends keyof ApplicationEventMap>(key: K, listener: ApplicationEventMap[K]): void {
		this.eventDispatcher.removeEventListener(key, listener);
	}

	public onceEventListener<K extends keyof ApplicationEventMap>(key: K, listener: ApplicationEventMap[K]): void {
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
			await this.__container.load();
			const config = this.__container.get(Config)!.data!;
			this.__emoji = await util.loadJSON(config.url.emoji, true);
			this.eventDispatcher.dispatch("Load");
		} catch (e) {
			this.__loadResult = e as Error;
			this.eventDispatcher.dispatch("Load", this.__loadResult);
		}
		this.__loaded = true;
	}
}
