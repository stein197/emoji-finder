import React from "react";
import Foreach from "@stein197/react-ui/Foreach";
import EmojiTableRow from "./EmojiTableRow";
import type {Emoji} from "type/Emoji";

export default class EmojiTable extends React.Component<Props, State> {

	private readonly ref: React.RefObject<HTMLTableElement> = React.createRef();

	public constructor(props: Props) {
		super(props);
		this.state = {
			showCount: this.props.pagination
		};
	}

	public override componentDidMount(): void {
		window.document.addEventListener("scroll", this.onScroll);
	}

	public override componentWillUnmount(): void {
		window.document.removeEventListener("scroll", this.onScroll);
	}

	public override render(): React.ReactNode {
		return (
			<table ref={this.ref} className="table text-center">
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
					<Foreach data={this.props.data.slice(0, this.state.showCount)}>
						{emoji => (
							<EmojiTableRow key={emoji.codes.join("-")} data={emoji} />
						)}
					</Foreach>
				</tbody>
			</table>
		);
	}

	private readonly onScroll = () => {
		const tableElement = this.ref.current!;
		const tableRect = tableElement.getBoundingClientRect();
		if (0 <= tableRect.bottom && tableRect.bottom <= window.innerHeight && this.state.showCount < this.props.data.length)
			this.setState({
				showCount: this.state.showCount + this.props.pagination
			});
	}
}

type Props = {
	data: Emoji[];
	pagination: number;
}

type State = {
	showCount: number;
}
