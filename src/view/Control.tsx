import React from "react";

export default class Control extends React.Component<Props, State> {

	private get className(): string {
		const result = ["control"];
		if (this.state.focus)
			result.push("focus");
		return result.join(" ");
	}

	public constructor(props: Props) {
		super(props);
		this.state = {
			focus: false
		};
	}

	public override render(): React.ReactNode {
		return (
			<div className={this.className}>
				<input className={this.props.className} onInput={this.onInput} placeholder={this.props.placeholder} onFocus={this.onFocus} onBlur={this.onBlur} type="text" />
			</div>
		);
	}

	private readonly onInput = (e: React.SyntheticEvent<HTMLInputElement, InputEvent>) => {
		this.props.onChange?.((e.target as HTMLInputElement).value);
	}

	private readonly onFocus = () => {
		this.setState({focus: true});
	}

	private readonly onBlur = () => {
		this.setState({focus: false});
	}
}

type Props = {

	/**
	 * Handler that fires each time input changes it's value.
	 * @param value Current input's value.
	 */
	onChange?(value: string): void;

	/**
	 * Text to show in `placeholder` attribute.
	 */
	placeholder?: string;

	/**
	 * Additional CSS classnames.
	 */
	className?: string;
}

type State = {
	focus: boolean;
}
