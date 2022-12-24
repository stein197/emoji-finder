import React from "react";
import TooltipButton from "app/view/TooltipButton";
import type {Emoji} from "app/type/Emoji";
import Foreach from "@stein197/react-ui/Foreach";

export default class EmojiListItem extends React.Component<Props> {

	public override render(): React.ReactNode {
		return (
			<div className="card h-100">
				<div className="card-body d-flex flex-column">
					<p className="card-title text-center fs-1">{String.fromCodePoint(...this.props.data.codes)}</p>
					<p>{this.props.data.codes.map(code => code.toString(0x10).toUpperCase()).join(", ")}</p>
					<p>
						<Foreach data={this.props.data.tags}>
							{tag => (
								<>
									<a href="javascript:void(0)" data-tag={tag} onClick={this.onTagClick}>{`#${tag}`}</a>
									&#32;
								</>
							)}
						</Foreach>
					</p>
					<TooltipButton className="btn-dark w-100 mt-auto" onClick={this.onClick} tooltip="Copied!">Copy</TooltipButton>
				</div>
			</div>
		);
	}

	private readonly onClick = async () => {
		await window.navigator.clipboard.writeText(this.props.data.codes.map(code => String.fromCodePoint(code)).join(""));
	}

	private readonly onTagClick = (e: React.SyntheticEvent<HTMLAnchorElement, MouseEvent>): void => {
		const target = e.target as HTMLAnchorElement;
		const tag = target.getAttribute("data-tag");
		if (!tag || !this.props.onTagClick)
			return;
		this.props.onTagClick(tag);
	}
}

type Props = {
	data: Emoji;
	onTagClick?(tag: string): void;
}
