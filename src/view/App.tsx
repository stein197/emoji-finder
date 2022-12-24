import React from "react";
import PromiseState from "@stein197/util/PromiseState";
import Spinner from "@stein197/react-ui/Spinner";
import {Switch, Case} from "@stein197/react-ui/Switch";
import Finder from "app/view/Finder";
import * as context from "app/view/context";
import type Application from "app/Application";

export default class App extends React.Component<Props, State> {

	public static readonly contextType: React.Context<Application> = context.get();

	public constructor(props: Props) {
		super(props);
		this.state = {
			state: PromiseState.Pending
		};
	}

	public override componentDidMount(): void {
		this.props.application.addEventListener("Load", this.onApplicationLoad);
	}

	public override componentWillUnmount(): void {
		this.props.application.removeEventListener("Load", this.onApplicationLoad);
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
								<Finder data={this.props.application.emoji!} />
							</div>
						</section>
					</Case>
					<Case value={PromiseState.Rejected}>
						<section className="h-full d-flex align-items-center">
							<div className="container text-center">
								<p className="alert alert-danger m-0">{this.state.errorMessage}</p>
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
			errorMessage: error?.message
		});
	}
}

type Props = {
	application: Application;
}

type State = {
	state: PromiseState;
	errorMessage?: string;
}
