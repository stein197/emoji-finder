import React from "react";
import PromiseState from "@stein197/util/PromiseState";
import Spinner from "@stein197/react-ui/Spinner";
import ErrorAlert from "app/view/ErrorAlert";
import Finder from "app/view/Finder";
import BrowserQueryString from "app/BrowserQueryString";
import {Switch, Case} from "@stein197/react-ui/Switch";
import * as context from "app/view/context";
import type Application from "app/Application";
import type {BrowserQueryStringMap} from "app/type/BrowserQueryStringMap";

/**
 * Root React component.
 */
export default class App extends React.Component<Props, State> {

	public static readonly contextType: React.Context<Application> = context.get();

	public declare readonly context: React.ContextType<React.Context<Application>>;

	private get query(): Partial<BrowserQueryStringMap> | null {
		return this.props.application.container.get(BrowserQueryString)?.data ?? null;
	}

	public constructor(props: Props) {
		super(props);
		this.state = {
			state: PromiseState.Pending
		};
	}

	public override componentDidMount(): void {
		this.props.application.addEventListener("load", this.onApplicationLoad);
	}

	public override componentWillUnmount(): void {
		this.props.application.removeEventListener("load", this.onApplicationLoad);
	}

	public override render(): React.ReactNode {
		const ApplicationContext = App.contextType;
		return (
			<ApplicationContext.Provider value={this.props.application}>
				<Switch value={this.state.state}>
					<Case value={PromiseState.Pending}>
						<section className="h-full d-flex align-items-center">
							<div className="container text-center">
								<Spinner r="50" strokeColor="lightblue" strokeWidth="5" duration=".5" />
								<p className="fs-1" style={{color: "lightblue"}}>Loading...</p>
							</div>
						</section>
					</Case>
					<Case value={PromiseState.Fulfilled}>
						<section className="h-full">
							<div className="h-100 container d-flex flex-column flex-nowrap">
								<Finder query={this.query?.query} variation={this.query?.variation} onChange={this.onFinderChange} />
							</div>
						</section>
					</Case>
					<Case value={PromiseState.Rejected}>
						<section className="h-full d-flex align-items-center">
							<div className="container text-center">
								<ErrorAlert error={this.state.error!} />
							</div>
						</section>
					</Case>
				</Switch>
			</ApplicationContext.Provider>
		);
	}

	private onApplicationLoad = (error?: Error) => {
		this.setState({
			state: error ? PromiseState.Rejected : PromiseState.Fulfilled,
			error
		});
	}

	private readonly onFinderChange = (query: string, variation?: string): void => {
		this.props.application.container.get(BrowserQueryString)?.set({query, variation});
	}
}

type Props = {
	application: Application;
}

type State = {
	state: PromiseState;
	error?: Error;
}
