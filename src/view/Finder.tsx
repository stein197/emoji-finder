import React from "react";
import Spinner from "@stein197/react-ui/Spinner";
import Config from "app/Config";
import EmojiList from "app/view/EmojiList";
import EmojiSearcher from "app/EmojiSearcher";
import ErrorAlert from "app/view/ErrorAlert";
import Dropdown from "app/view/Dropdown";
import {If, Then, Else} from "@stein197/react-ui/If";
import {Switch, Case} from "@stein197/react-ui/Switch";
import * as context from "app/view/context"
import * as util from "app/util";
import type Application from "app/Application";

export default class Finder extends React.Component<Props, State> {

	public static readonly contextType: React.Context<Application> = context.get();

	private static readonly VARIATION_DEFAULT: string = "default";

	private static readonly VARIATIONS: app.Button[] = [
		{
			text: "Default",
			value: this.VARIATION_DEFAULT
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

	public declare readonly context: React.ContextType<React.Context<Application>>;

	private get config(): Exclude<typeof Config.prototype.data, null> {
		return this.context.container.get(Config)!.data!;
	}

	public constructor(props: Props) {
		super(props);
		this.state = {
			data: [],
			state: "init",
			query: props.query ?? "",
			amount: 0,
			next: true,
			variation: props.variation
		};
	}

	public override componentDidMount(): void {
		this.fetch(this.state.query, this.config.pagination);
	}

	public override componentDidUpdate(...[, prevState]: [never, Readonly<State>]): void {
		if (this.state.query !== prevState.query || this.state.variation !== prevState.variation)
			this.props.onChange?.(this.state.query, this.state.variation);
	}

	public override render(): React.ReactNode {
		return (
			<>
				<div {...util.className("d-flex", "gap-" + this.config.ui.gap, "my-" + this.config.ui.gap)}>
					<input className="form-control" value={this.state.query} type="text" placeholder="Find an Emoji" onChange={this.onInputChange} />
					<Dropdown default={this.state.variation} data={Finder.VARIATIONS} onChange={this.onVariationDropdownChange} variant="dark" />
					<button className="btn-close h-auto" onClick={this.onCloseClick} />
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
									<EmojiList data={this.state.data} variation={this.state.variation} onTagClick={this.onTagClick} />
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

	private async fetch(query: string, amount: number): Promise<void> {
		this.setState({
			state: this.state.state === "init" ? "init" : "loading",
			query,
			error: undefined,
			amount
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
		if (!this.state.query && !this.state.variation)
			return;
		this.setState({
			variation: undefined
		});
		this.fetch("", this.config.pagination);
	}

	private readonly onInputChange = (e: React.SyntheticEvent<HTMLInputElement, Event>): void => {
		const target = e.target as HTMLInputElement;
		const value = target.value;
		this.fetch(value, this.config.pagination);
	}

	private readonly onLoadClick = (): void => {
		if (this.state.state !== "loading")
			this.fetch(this.state.query, this.state.amount + this.config.pagination);
	}

	private readonly onVariationDropdownChange = (button: app.Button): void => {
		this.setState({
			variation: button.value
		});
	}

	private readonly onTagClick = (tag: string): void => {
		this.fetch(tag, this.config.pagination);
	}
}

type Props = {

	/**
	 * Current query string.
	 * @defaultValue `""`
	 */
	query?: string;

	/**
	 * Variation of icons.
	 * @defaultValue `""`
	 */
	variation?: string;

	onChange?(query: string, variation?: string): void;
}

type State = {
	data: app.emoji.Emoji[];
	state: "init" | "loading" | "load" | "error";
	query: string;
	amount: number;
	next: boolean;
	variation?: string;
	error?: Error;
}
