import React from "react";
import PromiseState from "@stein197/util/PromiseState";
import Spinner from "@stein197/react-ui/Spinner";
import Config from "app/Config";
import EmojiList from "app/view/EmojiList";
import EmojiSearcher from "app/EmojiSearcher";
import ErrorAlert from "app/view/ErrorAlert";
import BrowserQueryString from "app/BrowserQueryString";
import ButtonGroup from "app/view/ButtonGroup";
import {If} from "@stein197/react-ui/If";
import {Switch, Case} from "@stein197/react-ui/Switch";
import * as context from "app/view/context"
import type Application from "app/Application";
import type {Emoji} from "app/type/Emoji";
import type {BrowserQueryStringMap} from "app/type/BrowserQueryStringMap";

export default class Finder extends React.Component<Props, State> {

	public static readonly contextType: React.Context<Application> = context.get();

	public static readonly VARIATION_DEFAULT: string = "Default";

	private static readonly VARIATIONS: string[] = [
		this.VARIATION_DEFAULT, "Apple", "Google", "Facebook", "Windows", "Twitter", "JoyPixels", "Samsung", "GMail", "Softbank", "DCM", "KDDI"
	];

	declare public context: React.ContextType<React.Context<Application>>;

	private get config(): Exclude<typeof Config.prototype.data, null> {
		return this.context.container.get(Config)!.data!;
	}

	public constructor(props: Props) {
		super(props);
		this.state = {
			data: [],
			state: PromiseState.Pending,
			value: "",
			amount: 0,
			variation: Finder.VARIATION_DEFAULT,
			next: true
		};
	}

	public override componentDidMount(): void {
		const value = this.context.container.get(BrowserQueryString)!.data.query ?? ""
		this.setState({value});
		this.update(value, this.config.pagination);
		this.context.container.get(BrowserQueryString)!.addEventListener("change", this.onQueryStringChange);
	}

	public override componentWillUnmount(): void {
		this.context.container.get(BrowserQueryString)!.removeEventListener("change", this.onQueryStringChange);
	}

	public override render(): React.ReactNode {
		return (
			<>
				<input className="form-control py-2 w-100 fs-2 my-3" value={this.state.value} type="text" placeholder="Find an Emoji" onChange={this.onInputChange} />
				<ButtonGroup data={Finder.VARIATIONS} className="mb-3" btnClassName="btn-dark" onChange={this.onButtonGroupChange} />
				<Switch value={this.state.state}>
					<Case value={PromiseState.Pending}>
						<div className="flex-grow-1 d-flex align-items-center justify-content-center">
							<Spinner r="50" strokeWidth="5" />
						</div>
					</Case>
					<Case value={PromiseState.Fulfilled}>
						<div className="flex-grow-1 overflow-y-scroll overflow-x-hidden">
							<EmojiList data={this.state.data} variation={this.state.variation} />
							<If value={this.state.next}>
								<div className="text-center py-3">
									<button className="btn btn-dark" onClick={this.onLoadClick}>Load more</button>
								</div>
							</If>
						</div>
					</Case>
					<Case value={PromiseState.Rejected}>
						<div className="flex-grow-1 d-flex align-items-center justify-content-center">
							<ErrorAlert error={this.state.error!} />
						</div>
					</Case>
				</Switch>
			</>
		);
	}

	private async update(query: string, amount: number): Promise<void> {
		this.setState({
			state: PromiseState.Pending,
			value: query,
			error: undefined
		});
		try {
			const searcher = this.context.container.get(EmojiSearcher)!;
			const data = await searcher.search(query, amount);
			this.setState({
				data: data.data,
				state: PromiseState.Fulfilled,
				amount,
				next: data.next
			});
		} catch (e) {
			this.setState({
				data: [],
				state: PromiseState.Rejected,
				amount: this.config.pagination,
				next: false,
				error: e as Error
			});
		}
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
		this.update(this.state.value, this.state.amount + this.config.pagination);
	}

	private readonly onQueryStringChange = (query: BrowserQueryStringMap): void => {
		this.update(query?.query ?? "", this.config.pagination);
	}

	private readonly onButtonGroupChange = (button: string): void => {
		this.setState({
			variation: button
		});
	}
}

type Props = {}

type State = {
	data: Emoji[];
	state: PromiseState;
	value: string;
	amount: number;
	variation: string;
	next: boolean;
	error?: Error;
}
