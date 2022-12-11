import React from "react";
import Control from "view/Control";
import EmojiList from "view/EmojiList";
import * as context from "view/context";
import type {Emoji} from "type/Emoji";
import type Application from "Application";

export default class Finder extends React.Component<Props> {

	public static readonly contextType: React.Context<Application> = context.get();

	declare context: React.ContextType<React.Context<Application>>;

	public override render(): React.ReactNode {
		return (
			<>
				<Control className="py-2 w-100 fs-2 mb-2" placeholder="Find an Emoji" />
				<div className="flex-grow-1 overflow-y-scroll overflow-x-hidden">
					<EmojiList data={this.props.data} pagination={this.context.config!.pagination} />
				</div>
			</>
		);
	}
}

type Props = {
	data: Emoji[];
}