import React from "react";
import Foreach from "@stein197/react-ui/Foreach";
import EmojiListItem from "app/view/EmojiListItem";
import type {Emoji} from "app/type/Emoji";

export default class EmojiList extends React.Component<Props> {

	public constructor(props: Props) {
		super(props);
		this.state = {};
	}

	public override render(): React.ReactNode {
		return (
			<div className="row gx-3 gy-3">
				<Foreach data={this.props.data}>
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
	className?: string;
}
