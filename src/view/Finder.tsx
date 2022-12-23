import React from "react";
import Config from "app/Config";
import EmojiList from "app/view/EmojiList";
import * as context from "app/view/context"
import type Application from "app/Application";
import type {Emoji} from "app/type/Emoji";

export default class Finder extends React.Component<Props> {

	declare context: React.ContextType<React.Context<Application>>;

	public static readonly contextType: React.Context<Application> = context.get();

	public override render(): React.ReactNode {
		return (
			<>
				<input type="text" className="form-control py-2 w-100 fs-2 my-3" placeholder="Find an Emoji" />
				<div className="flex-grow-1 overflow-y-scroll overflow-x-hidden">
					<EmojiList data={this.props.data} pagination={this.context.container.get(Config)!.data!.pagination} />
				</div>
			</>
		);
	}
}

type Props = {
	data: Emoji[];
}