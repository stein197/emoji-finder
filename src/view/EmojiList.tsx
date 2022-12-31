import React from "react";
import Foreach from "@stein197/react-ui/Foreach";
import EmojiListItem from "app/view/EmojiListItem";
import Config from "app/Config";
import * as context from "app/view/context";
import * as util from "app/util";
import type Application from "app/Application";

export default class EmojiList extends React.Component<Props> {

	public static readonly contextType: React.Context<Application> = context.get();

	declare public context: React.ContextType<React.Context<Application>>;

	public constructor(props: Props) {
		super(props);
		this.state = {};
	}

	public override render(): React.ReactNode {
		return (
			<div {...util.className("row", `g-${this.context.container.get(Config)!.data!.ui.gap}`)}>
				<Foreach data={this.props.data}>
					{emoji => (
						<div key={emoji.codes.join("-")} className="col col-6 col-md-4 col-lg-3 col-xl-2">
							<EmojiListItem data={emoji} variation={this.props.variation} onTagClick={this.props.onTagClick} />
						</div>
					)}
				</Foreach>
			</div>
		);
	}
}

type Props = {
	data: app.emoji.Emoji[];
	variation?: string;
	className?: string;
	onTagClick?(tag: string): void;
}
