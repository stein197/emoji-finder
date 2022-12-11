import React from "react";
import TooltipButton from "view/TooltipButton";
import type {Emoji} from "type/Emoji";

export default class EmojiListItem extends React.Component<Props> {

	public override render(): React.ReactNode {
		return (
			<div className="card h-100">
				<div className="card-body d-flex flex-column">
					<p className="card-title text-center fs-1">{String.fromCodePoint(...this.props.data.codes)}</p>
					<p>{this.props.data.codes.map(code => code.toString(0x10).toUpperCase()).join(", ")}</p>
					<TooltipButton className="btn btn-dark w-100 mt-auto" onClick={this.onClick} tooltipText="Copied!">Copy</TooltipButton>
				</div>
			</div>
		);
	}

	private readonly onClick = async () => {
		await window.navigator.clipboard.writeText(this.props.data.codes.map(code => String.fromCodePoint(code)).join(""));
	}
}

type Props = {
	data: Emoji;
}
