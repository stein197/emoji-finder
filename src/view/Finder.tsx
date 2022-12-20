import React from "react";
import EmojiList from "app/view/EmojiList";
import * as config from "app/config";
import type {Emoji} from "app/type/Emoji";

export default class Finder extends React.Component<Props> {

	public override render(): React.ReactNode {
		return (
			<>
				<input type="text" className="form-control py-2 w-100 fs-2 my-3" placeholder="Find an Emoji" />
				<div className="flex-grow-1 overflow-y-scroll overflow-x-hidden">
					<EmojiList data={this.props.data} pagination={config.get()!.pagination} />
				</div>
			</>
		);
	}
}

type Props = {
	data: Emoji[];
}