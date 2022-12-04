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
				<input className={this.props.className} placeholder={this.props.placeholder} onFocus={this.onFocus} onBlur={this.onBlur} type="text" />
			</div>
		);
	}

	private readonly onFocus = () => {
		this.setState({focus: true});
	}

	private readonly onBlur = () => {
		this.setState({focus: false});
	}
}

type Props = {
	className?: string;
	placeholder?: string;
}

type State = {
	focus: boolean;
}
