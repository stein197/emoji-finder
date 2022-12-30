import React from "react";
import Spinner from "@stein197/react-ui/Spinner";
import Config from "app/Config";
import EmojiList from "app/view/EmojiList";
import EmojiSearcher from "app/EmojiSearcher";
import ErrorAlert from "app/view/ErrorAlert";
import BrowserQueryString from "app/BrowserQueryString";
import Dropdown from "app/view/Dropdown";
import {If, Then, Else} from "@stein197/react-ui/If";
import {Switch, Case} from "@stein197/react-ui/Switch";
import * as context from "app/view/context"
import * as util from "app/util";
import type Application from "app/Application";
import type {Emoji} from "app/type/Emoji";
import type {BrowserQueryStringMap} from "app/type/BrowserQueryStringMap";
import type {Button} from "app/type/Button";

export default class Finder extends React.Component<Props, State> {

	public static readonly contextType: React.Context<Application> = context.get();

	private static readonly VARIATIONS: Button[] = [
		{
			text: "Default"
		},
		{
			text: "Apple",
			value: "apple"
		},
		{
			text: "Google",
			value: "google"
		},
		{
			text: "Facebook",
			value: "facebook"
		},
		{
			text: "Windows",
			value: "windows"
		},
		{
			text: "Twitter",
			value: "twitter"
		},
		{
			text: "JoyPixels",
			value: "joypixels"
		},
		{
			text: "Samsung",
			value: "samsung"
		},
		{
			text: "GMail",
			value: "gmail"
		},
		{
			text: "Softbank",
			value: "softbank"
		},
		{
			text: "DCM",
			value: "dcm"
		},
		{
			text: "KDDI",
			value: "kddi"
		},
	];

	declare public context: React.ContextType<React.Context<Application>>;

	private get config(): Exclude<typeof Config.prototype.data, null> {
		return this.context.container.get(Config)!.data!;
	}

	public constructor(props: Props) {
		super(props);
		this.state = {
			data: [],
			state: "init",
			value: "",
			amount: 0,
			next: true
		};
	}

	public override componentDidMount(): void {
		const value = this.context.container.get(BrowserQueryString)!.data.query ?? ""
		this.setState({value});
		this.update(value, this.config.pagination, true);
		this.context.container.get(BrowserQueryString)!.addEventListener("change", this.onQueryStringChange);
	}

	public override componentWillUnmount(): void {
		this.context.container.get(BrowserQueryString)!.removeEventListener("change", this.onQueryStringChange);
	}

	// TODO: Clicking close button doesn't update the query. Unify query update events
	public override render(): React.ReactNode {
		return (
			<>
				<div {...util.className("d-flex", "gap-" + this.config.ui.gap, "my-" + this.config.ui.gap)}>
					<input className="form-control" value={this.state.value} type="text" placeholder="Find an Emoji" onChange={this.onInputChange} />
					<button className="btn-close h-auto" onClick={this.onCloseClick} />
					<Dropdown data={Finder.VARIATIONS} onChange={this.onButtonGroupChange} variant="dark" />
				</div>
				<Switch value={this.state.state}>
					<Case value="init">
						<div className="flex-grow-1 d-flex align-items-center justify-content-center">
							<Spinner r="50" strokeWidth="5" />
						</div>
					</Case>
					<Case value={["loading", "load"]}>
						<If value={this.state.data.length > 0}>
							<Then>
								<div className="flex-grow-1 overflow-y-scroll overflow-x-hidden">
									<EmojiList data={this.state.data} variation={this.state.variation} />
									<If value={this.state.next}>
										<div {...util.className("text-center", "py-" + this.config.ui.gap)}>
											<button className="btn btn-dark" disabled={this.state.state === "loading"} onClick={this.onLoadClick}>{this.state.state === "load" ? "Load more" : "Loading..."}</button>
										</div>
									</If>
								</div>
							</Then>
							<Else>
								<div className="flex-grow-1 d-flex align-items-center justify-content-center">
									<p className="alert alert-dark m-0">No emojis satify the search request</p>
								</div>
							</Else>
						</If>
					</Case>
					<Case value="error">
						<div className="flex-grow-1 d-flex align-items-center justify-content-center">
							<ErrorAlert error={this.state.error!} />
						</div>
					</Case>
				</Switch>
			</>
		);
	}

	private async update(query: string, amount: number, init: boolean = false): Promise<void> {
		this.setState({
			state: init ? "init" : "loading",
			value: query,
			error: undefined
		});
		try {
			const searcher = this.context.container.get(EmojiSearcher)!;
			const data = await searcher.search(query, amount);
			this.setState({
				data: data.data,
				state: "load",
				amount,
				next: data.next
			});
		} catch (e) {
			this.setState({
				data: [],
				state: "error",
				amount: this.config.pagination,
				next: false,
				error: e as Error
			});
		}
	}

	private readonly onCloseClick = () => {
		if (this.state.value)
			this.update("", this.config.pagination, true);
	}

	private readonly onInputChange = (e: React.SyntheticEvent<HTMLInputElement, Event>): void => {
		const target = e.target as HTMLInputElement;
		const value = target.value;
		this.context.container.get(BrowserQueryString)!.set({
			query: value
		});
		this.update(value, this.config.pagination);
	}

	private readonly onLoadClick = (): void => {
		if (this.state.state === "load")
			this.update(this.state.value, this.state.amount + this.config.pagination);
	}

	private readonly onQueryStringChange = (query: BrowserQueryStringMap): void => {
		this.update(query?.query ?? "", this.config.pagination);
	}

	private readonly onButtonGroupChange = (button: Button): void => {
		this.setState({
			variation: button.value
		});
	}
}

type Props = {}

type State = {
	data: Emoji[];
	state: "init" | "loading" | "load" | "error";
	value: string;
	amount: number;
	next: boolean;
	variation?: string;
	error?: Error;
}
