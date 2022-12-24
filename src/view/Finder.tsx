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

	private inputRef: React.RefObject<HTMLInputElement> = React.createRef();

	public constructor(props: Props) {
		super(props);
		this.state = {
			state: PromiseState.Pending,
			data: [],
			amount: 0
		};
	}

	public override componentDidMount(): void {
		this.update();
	}

	public override render(): React.ReactNode {
		return (
			<>
				<input ref={this.inputRef} type="text" className="form-control py-2 w-100 fs-2 my-3" placeholder="Find an Emoji" onInput={this.onInput} />
				<Switch value={this.state.state}>
					<Case value={PromiseState.Pending}>
						<div className="flex-grow-1 d-flex align-items-center justify-content-center">
							<Spinner r="50" strokeWidth="5" />
						</div>
					</Case>
					<Case value={PromiseState.Fulfilled}>
						<div className="flex-grow-1 overflow-y-scroll overflow-x-hidden">
							<EmojiList data={this.state.data} pagination={this.context.container.get(Config)!.data!.pagination} />
						</div>
						<div className="text-center py-2">
							<button className="btn btn-dark">Load more</button>
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

	private async update(): Promise<void> {
		this.setState({
			state: PromiseState.Pending,
			error: undefined
		});
		try {
			const amount = this.state.amount ? this.state.amount : this.context.container.get(Config)!.data!.pagination;
			const searcher = this.context.container.get(EmojiSearcher)!;
			const query = this.inputRef.current!.value;
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

	private onInput = (): void => void this.update();
}

type Props = {}

type State = {
	state: PromiseState;
	data: Emoji[];
	amount: number;
	error?: Error;
}
