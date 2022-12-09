import React from "react";
import Control from "view/Control";
import Spinner from "view/Spinner";
import {Switch, Case} from "@stein197/react-ui/Switch";
import type Application from "Application";

export default class App extends React.Component<Props, State> {

	private readonly rootContext: React.Context<Application>;

	public constructor(props: Props) {
		super(props);
		this.state = {
			state: "pending"
		};
		this.rootContext = React.createContext(props.application);
	}

	public override componentDidMount(): void {
		this.props.application.addEventListener("Load", this.onApplicationLoad);
	}

	public override componentWillUnmount(): void {
		this.props.application.removeEventListener("Load", this.onApplicationLoad);
	}

	public override render(): React.ReactNode {
		const ApplicationContext = this.rootContext;
		return (
			<ApplicationContext.Provider value={this.props.application}>
				<Switch value={this.state.state}>
					<Case value="pending">
						<section className="h-full d-flex align-items-center">
							<div className="container text-center">
								<Spinner r="50" color="lightblue" width="5" duration=".5" />
								<p className="fs-1" style={{color: "lightblue"}}>Loading...</p>
							</div>
						</section>
					</Case>
					<Case value="loaded">
						<section>
							<div className="container">
								<Control className="py-2 w-100 fs-2" placeholder="Find an Emoji" />
							</div>
						</section>
					</Case>
					<Case value="error">
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
			state: error ? "error" : "loaded",
			errorMessage: error?.message
		});
	}
}

type Props = {
	application: Application;
}

type State = {
	state: "pending" | "loaded" | "error";
	errorMessage?: string;
}
