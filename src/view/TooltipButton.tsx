import React from "react";
import Overlay from "react-bootstrap/Overlay";
import Tooltip from "react-bootstrap/Tooltip";

export default class TooltipButton extends React.Component<Props, State> {

	private static readonly TIMEOUT_HIDE: number = 1000;

	private readonly ref: React.RefObject<HTMLButtonElement> = React.createRef();

	private appearTimeout: number = 0;

	public constructor(props: Props) {
		super(props);
		this.state = {
			tooltip: false
		}
	}

	public override render(): React.ReactNode {
		return (
			<>
				<button ref={this.ref} className={this.props.className} onClick={this.onClick}>{this.props.children}</button>
				<Overlay placement="top" show={this.state.tooltip} target={this.ref.current}>
					{props => (
						<Tooltip {...props}>{this.props.tooltipText}</Tooltip>
					)}
				</Overlay>
			</>
		);
	}

	private readonly onClick = (e: React.SyntheticEvent<HTMLButtonElement, MouseEvent>) => {
		window.clearTimeout(this.appearTimeout);
		this.setState({
			tooltip: true
		});
		this.appearTimeout = window.setTimeout(() => this.setState({
			tooltip: false
		}), TooltipButton.TIMEOUT_HIDE);
		this.props.onClick?.(e);
	}
}

type Props = {
	tooltipText: string;
	children: any;
	className?: string;
	onClick?(e: React.SyntheticEvent<HTMLButtonElement, MouseEvent>): void;
}

type State = {
	tooltip: boolean;
}
