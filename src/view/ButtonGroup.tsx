import React from "react";
import Foreach from "@stein197/react-ui/Foreach";
import type {Button} from "app/type/Button";

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
			active: props.data.findIndex(button => button.value === props.default) >= 0 ? props.default : undefined
		};
	}

	public override render(): React.ReactNode {
		return (
			<div className={this.className}>
				<Foreach data={this.props.data}>
					{button => (
						<button key={button.value} className={this.getButtonClassName(button)} onClick={this.onClick} value={button.value}>{button.text}</button>
					)}
				</Foreach>
			</div>
		);
	}

	private getButtonClassName(button: Button): string {
		const result = [
			"btn"
		];
		if (this.props.btnClassName)
			result.push(this.props.btnClassName);
		if (this.state.active === button.value)
			result.push("active");
		return result.join(" ");
	}

	private readonly onClick = (e: React.SyntheticEvent<HTMLButtonElement, MouseEvent>): void => {
		const target = e.target as HTMLButtonElement;
		const item = this.props.data.find(button => button.value === target.value);
		if (!item || this.state.active === item.value)
			return;
		this.setState({
			active: item.value
		});
		this.props.onChange?.(item);
	}
}

type Props = {
	data: Button[];
	default?: string;
	className?: string;
	btnClassName?: string;
	onChange?(button: Button): void;
}

type State = {
	active?: string;
}