import React from "react";
import PromiseState from "@stein197/util/PromiseState";
import Spinner from "@stein197/react-ui/Spinner";
import Config from "app/Config";
import EmojiList from "app/view/EmojiList";
import EmojiSearcher from "app/EmojiSearcher";
import ErrorAlert from "app/view/ErrorAlert";
import {Switch, Case} from "@stein197/react-ui/Switch";
import * as context from "app/view/context"
import type Application from "app/Application";
import type {Emoji} from "app/type/Emoji";

export default class Finder extends React.Component<Props, State> {

	declare context: React.ContextType<React.Context<Application>>;

	public static readonly contextType: React.Context<Application> = context.get();

	public constructor(props: Props) {
		super(props);
		this.state = {
			state: PromiseState.Pending,
			value: "",
			data: [],
			amount: 0
		};
	}

	public override componentDidMount(): void {
		this.update(this.state.value);
	}

	public override render(): React.ReactNode {
		return (
			<>
				<input className="form-control py-2 w-100 fs-2 my-3" value={this.state.value} type="text" placeholder="Find an Emoji" onChange={this.onInputChange} />
				<Switch value={this.state.state}>
					<Case value={PromiseState.Pending}>
						<div className="flex-grow-1 d-flex align-items-center justify-content-center">
							<Spinner r="50" strokeWidth="5" />
						</div>
					</Case>
					<Case value={PromiseState.Fulfilled}>
						<div className="flex-grow-1 overflow-y-scroll overflow-x-hidden">
							<EmojiList data={this.state.data} onTagClick={this.onTagClick} />
						</div>
						<div className="text-center py-3">
							<button className="btn btn-dark" onClick={this.onLoadClick}>Load more</button>
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

	private async update(query: string): Promise<void> {
		this.setState({
			state: PromiseState.Pending,
			value: query,
			error: undefined
		});
		try {
			const amount = this.context.container.get(Config)!.data!.pagination;
			const searcher = this.context.container.get(EmojiSearcher)!;
			const data = await searcher.search(query, amount);
			this.setState({
				state: PromiseState.Fulfilled,
				data,
				amount
			});
		} catch (e) {
			this.setState({
				state: PromiseState.Rejected,
				error: e as Error
			});
		}
	}

	private readonly onInputChange = (e: React.SyntheticEvent<HTMLInputElement, Event>): void => {
		const target = e.target as HTMLInputElement;
		const value = target.value;
		this.update(value);
	}

	// TODO
	private readonly onLoadClick = (): void => {}

	private readonly onTagClick = (tag: string): void => {
		this.update(tag);
	}
}

type Props = {}

type State = {
	state: PromiseState;
	value: string;
	data: Emoji[];
	amount: number;
	error?: Error;
}
