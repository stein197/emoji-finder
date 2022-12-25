import React from "react";
import Foreach from "@stein197/react-ui/Foreach";

export default class ButtonGroup extends React.Component<Props, State> {

	private get className(): string {
		const result = [
			"btn-group"
		];
		if (this.props.className)
			result.push(this.props.className);
		return result.join(" ");
	}

	public constructor(props: Props) {
		super(props);
		this.state = {
			active: props.default ?? props.data.length ? props.data[0] : ""
		};
	}

	public override render(): React.ReactNode {
		return (
			<div className={this.className}>
				<Foreach data={this.props.data}>
					{button => (
						<button className={this.getButtonClassName(button)} onClick={this.onClick} data-text={button}>{button}</button>
					)}
				</Foreach>
			</div>
		);
	}

	private getButtonClassName(button: string): string {
		const result = [
			"btn"
		];
		if (this.props.btnClassName)
			result.push(this.props.btnClassName);
		if (this.state.active === button)
			result.push("active");
		return result.join(" ");
	}

	private readonly onClick = (e: React.SyntheticEvent<HTMLButtonElement, MouseEvent>): void => {
		const target = e.target as HTMLButtonElement;
		const value = target.getAttribute("data-text");
		if (!value || this.state.active === value)
			return;
		this.setState({
			active: value
		});
		this.props.onChange?.(value);
	}
}

type Props = {
	data: string[];
	default?: string;
	className?: string;
	btnClassName?: string;
	onChange?(button: string): void;
}

type State = {
	active: string;
}