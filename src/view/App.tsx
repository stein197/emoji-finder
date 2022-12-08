import React from "react";
import Control from "view/Control";
import type Application from "Application";

export default class App extends React.Component<Props, State> {

	declare applicationContext: React.Context<Application>;

	public constructor(props: Props) {
		super(props);
		this.state = {
			state: "pending"
		};
		this.applicationContext = React.createContext(props.application);
	}

	public override componentDidMount(): void {
		this.props.application.addEventListener("Load", this.onApplicationLoad);
	}

	public override componentWillUnmount(): void {
		this.props.application.removeEventListener("Load", this.onApplicationLoad);
	}

	public override render(): React.ReactNode {
		const ApplicationContext = this.applicationContext;
		return (
			<ApplicationContext.Provider value={this.props.application}>
				<section>
					<div className="container">
						<Control className="py-2 w-100 fs-2" placeholder="Find an Emoji" />
					</div>
				</section>
			</ApplicationContext.Provider>
		);
	}

	private onApplicationLoad = (error?: Error) => {
		this.setState({
			state: error ? "error" : "loaded"
		});
	}
}

type Props = {
	application: Application;
}

type State = {
	state: "pending" | "loaded" | "error";
}
