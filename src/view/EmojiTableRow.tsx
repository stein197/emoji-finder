import React from "react";
import type {Emoji} from "type/Emoji";

export default class EmojiTableRow extends React.Component<Props> {

	public override render(): React.ReactNode {
		return (
			<tr>
				<td>{String.fromCodePoint(...this.props.data.codes)}</td>
				<td>
					<img src={this.props.data.variations.apple} />
				</td>
				<td>
					<img src={this.props.data.variations.google} />
				</td>
				<td>
					<img src={this.props.data.variations.facebook} />
				</td>
				<td>
					<img src={this.props.data.variations.windows} />
				</td>
				<td>
					<img src={this.props.data.variations.twitter} />
				</td>
				<td>
					<img src={this.props.data.variations.joypixels} />
				</td>
				<td>
					<img src={this.props.data.variations.samsung} />
				</td>
				<td>
					<img src={this.props.data.variations.gmail} />
				</td>
				<td>
					<img src={this.props.data.variations.softbank} />
				</td>
				<td>
					<img src={this.props.data.variations.dcm} />
				</td>
				<td>
					<img src={this.props.data.variations.kddi} />
				</td>
				<td>
					<button type="button" className="btn btn-dark" onClick={this.onClick}>Copy</button>
				</td>
			</tr>
		);
	}

	private readonly onClick = async () => {
		await window.navigator.clipboard.writeText(this.props.data.codes.map(code => String.fromCodePoint(code)).join(""));
	}
}

type Props = {
	data: Emoji;
}
