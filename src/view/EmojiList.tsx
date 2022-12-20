import React from "react";
import Foreach from "@stein197/react-ui/Foreach";
import EmojiListItem from "app/view/EmojiListItem";
import type {Emoji} from "app/type/Emoji";

export default class EmojiList extends React.Component<Props, State> {

	public constructor(props: Props) {
		super(props);
		this.state = {
			showCount: this.props.pagination
		};
	}

	public override render(): React.ReactNode {
		return (
			<div className="row gx-3 gy-3">
				<Foreach data={this.props.data.slice(0, this.state.showCount)}>
					{emoji => (
						<div key={emoji.codes.join("-")} className="col col-6 col-md-4 col-lg-3 col-xl-2">
							<EmojiListItem data={emoji} />
						</div>
					)}
				</Foreach>
			</div>
		);
	}
}

type Props = {
	data: Emoji[];
	pagination: number;
	className?: string;
}

type State = {
	showCount: number;
}
