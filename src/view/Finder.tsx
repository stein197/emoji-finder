import React from "react";
import Control from "view/Control";
import EmojiTable from "view/EmojiTable";
import * as context from "view/context";
import type {Emoji} from "type/Emoji";
import type Application from "Application";

export default class Finder extends React.Component<Props> {

	public static readonly contextType: React.Context<Application> = context.get();

	declare context: React.ContextType<React.Context<Application>>;

	public override render(): React.ReactNode {
		return (
			<>
				<Control className="py-2 w-100 fs-2 position-sticky" placeholder="Find an Emoji" />
				<EmojiTable data={this.props.data} pagination={this.context.config!.pagination} />
			</>
		);
	}
}

type Props = {
	data: Emoji[];
}