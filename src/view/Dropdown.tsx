import React from "react";
import DropdownButton from "react-bootstrap/DropdownButton";
import BSDropdown from "react-bootstrap/Dropdown";
import Foreach from "@stein197/react-ui/Foreach";

// TODO: Tests
export default class Dropdown extends React.Component<Props, State> {

	private get className(): string {
		const result: string[] = [];
		if (this.props.className)
			result.push(this.props.className);
		return result.join(" ");
	}

	private get activeButton(): app.Button | null {
		return this.props.data.find(button => button.value === this.state.active) ?? null;
	}

	public state: State = {
		active: this.props.data.findIndex(button => button.value === this.props.default) >= 0 ? this.props.default! : this.props.data[0].value!
	};

	public override render(): React.ReactNode {
		return (
			<DropdownButton variant={this.props.variant} menuVariant={this.props.variant} className={this.className} title={this.activeButton?.text} onSelect={this.onSelect}>
				<Foreach data={this.props.data}>
					{button => (
						<BSDropdown.Item key={button.value} active={this.state.active === button.value} eventKey={button.value}>{button.text}</BSDropdown.Item>
					)}
				</Foreach>
			</DropdownButton>
		);
	}

	private readonly onSelect = (eventKey: string | null): void => {
		if (this.state.active === eventKey)
			return;
		const button = this.props.data.find(button => button.value == eventKey);
		if (!button)
			return;
		this.setState({
			active: button.value
		});
		this.props.onChange?.(button);
	}

	public static getDerivedStateFromProps(props: Props, state: State): State | null {
		if (props.default != state.active)
			return {
				...state,
				active: props.data.findIndex(button => button.value === props.default) >= 0 ? props.default! : props.data[0].value!
			};
		return null;
	}
}

type Props = {
	data: app.Button[];
	default?: string;
	className?: string;
	variant?: string;
	onChange?(button: app.Button): void;
}

type State = {
	active: string;
}
