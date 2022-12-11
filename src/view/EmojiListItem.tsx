import React from "react";
import Tippy from "@tippyjs/react";
import type {Instance} from "tippy.js";
import type {Emoji} from "type/Emoji";

export default class EmojiListItem extends React.Component<Props> {

	private static readonly TIPPY_TIMEOUT_HIDE = 1000;

	public override render(): React.ReactNode {
		return (
			<div className="card h-100">
				<div className="card-body d-flex flex-column">
					<p className="card-title text-center fs-1">{String.fromCodePoint(...this.props.data.codes)}</p>
					<p>{this.props.data.codes.map(code => code.toString(0x10).toUpperCase()).join(", ")}</p>
					<Tippy content="Copied!" trigger="click" onShow={this.onTippyClick}>
						<button className="btn btn-dark w-100 mt-auto" onClick={this.onClick}>Copy</button>
					</Tippy>
				</div>
			</div>
		);
	}

	private readonly onClick = async () => {
		await window.navigator.clipboard.writeText(this.props.data.codes.map(code => String.fromCodePoint(code)).join(""));
	}

	private readonly onTippyClick = (tippy: Instance) => {
		window.setTimeout(tippy.hide, EmojiListItem.TIPPY_TIMEOUT_HIDE);
	}
}

type Props = {
	data: Emoji;
}
