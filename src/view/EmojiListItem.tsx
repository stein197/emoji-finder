import React from "react";
import Foreach from "@stein197/react-ui/Foreach";
import TooltipButton from "app/view/TooltipButton";
import BrowserQueryString from "app/BrowserQueryString";
import Finder from "app/view/Finder";
import {If, Then, Else} from "@stein197/react-ui/If";
import * as context from "app/view/context";
import type Application from "app/Application";
import type {Emoji} from "app/type/Emoji";

export default class EmojiListItem extends React.Component<Props> {

	declare context: React.ContextType<React.Context<Application>>;

	public static readonly contextType: React.Context<Application> = context.get();

	public override render(): React.ReactNode {
		return (
			<div className="card h-100">
				<div className="card-body d-flex flex-column align-items-center">
					<If value={this.props.variation == null || this.props.variation === Finder.VARIATION_DEFAULT}>
						<Then>
							<p className="card-title text-center fs-1">{String.fromCodePoint(...this.props.data.codes)}</p>
						</Then>
						<Else>
							<img src={this.props.data.variations[this.props.variation!.toLowerCase()]} />
						</Else>
					</If>
					<p>{this.props.data.codes.map(code => code.toString(0x10).toUpperCase()).join(", ")}</p>
					<p>
						<Foreach data={this.props.data.tags}>
							{tag => (
								<React.Fragment key={tag}>
									<a href="javascript:void(0)" data-tag={tag} onClick={this.onTagClick}>{`#${tag}`}</a>
									&#32;
								</React.Fragment>
							)}
						</Foreach>
					</p>
					<TooltipButton className="btn-dark w-100 mt-auto" onClick={this.onClick} tooltip="Copied!">Copy</TooltipButton>
				</div>
			</div>
		);
	}

	private readonly onClick = async () => {
		await this.context.global.navigator.clipboard.writeText(this.props.data.codes.map(code => String.fromCodePoint(code)).join(""));
	}

	private readonly onTagClick = (e: React.SyntheticEvent<HTMLAnchorElement, MouseEvent>): void => {
		const target = e.target as HTMLAnchorElement;
		const tag = target.getAttribute("data-tag");
		if (!tag)
			return;
		this.context.container.get(BrowserQueryString)!.set({
			query: tag
		});
	}
}

type Props = {
	data: Emoji;
	variation?: string;
}
