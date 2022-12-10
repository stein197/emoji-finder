import React from "react";
import Foreach from "@stein197/react-ui/Foreach";
import EmojiTableRow from "./EmojiTableRow";
import type {Emoji} from "type/Emoji";

export default class EmojiTable extends React.Component<Props, State> {

	public constructor(props: Props) {
		super(props);
		this.state = {
			data: this.props.data.slice(0, this.props.pagination)
		};
	}

	public override render(): React.ReactNode {
		return (
			<table className="table text-center">
				<thead>
					<tr>
						<th>Emoji</th>
						<th>Apple</th>
						<th>Google</th>
						<th>Facebook</th>
						<th>Windows</th>
						<th>Twitter</th>
						<th>JoyPixels</th>
						<th>Samsung</th>
						<th>GMail</th>
						<th>SoftBank</th>
						<th>DCM</th>
						<th>KDDI</th>
						<th>Copy</th>
					</tr>
				</thead>
				<tbody>
					<Foreach data={this.state.data}>
						{emoji => (
							<EmojiTableRow key={emoji.codes.join("-")} data={emoji} />
						)}
					</Foreach>
				</tbody>
			</table>
		);
	}
}

type Props = {
	data: Emoji[];
	pagination: number;
}

type State = {
	data: Emoji[];
}
