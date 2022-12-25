import React from "react";
import Overlay from "react-bootstrap/Overlay";
import Tooltip from "react-bootstrap/Tooltip";
import * as context from "app/view/context";
import type Application from "app/Application";
import type {Placement} from "react-bootstrap/esm/types";

export default class TooltipButton extends React.Component<Props, State> {

	declare context: React.ContextType<React.Context<Application>>;

	public static readonly contextType: React.Context<Application> = context.get();

	public static readonly defaultProps = {
		placement: "top"
	};
	private static readonly TIMEOUT_HIDE: number = 1000;

	private readonly ref: React.RefObject<HTMLButtonElement> = React.createRef();

	private appearTimeout: number = 0;

	private get className(): string {
		const result = [
			"btn"
		];
		if (this.props.className)
			result.push(this.props.className);
		return result.join(" ");
	}

	public constructor(props: Props) {
		super(props);
		this.state = {
			tooltip: false
		}
	}

	public override render(): React.ReactNode {
		return (
			<>
				<button ref={this.ref} className={this.className} onClick={this.onClick}>{this.props.children}</button>
				<Overlay placement={this.props.placement} show={this.state.tooltip} target={this.ref.current}>
					{props => (
						<Tooltip {...props}>{this.props.tooltip}</Tooltip>
					)}
				</Overlay>
			</>
		);
	}

	private readonly onClick = (e: React.SyntheticEvent<HTMLButtonElement, MouseEvent>) => {
		this.context.global.clearTimeout(this.appearTimeout);
		this.setState({
			tooltip: true
		});
		this.appearTimeout = this.context.global.setTimeout(() => this.setState({
			tooltip: false
		}), TooltipButton.TIMEOUT_HIDE);
		this.props.onClick?.(e);
	}
}

type Props = {
	tooltip: React.ReactNode;
	children: any;
	placement?: Placement;
	className?: string;
	onClick?(e: React.SyntheticEvent<HTMLButtonElement, MouseEvent>): void;
}

type State = {
	tooltip: boolean;
}
