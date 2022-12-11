import React from "react";
import Foreach from "@stein197/react-ui/Foreach";
import EmojiListItem from "./EmojiListItem";
import type {Emoji} from "type/Emoji";

export default class EmojiList extends React.Component<Props, State> {

	private readonly ref: React.RefObject<HTMLTableElement> = React.createRef();

	private get className(): string {
		const result = [
			"table", "text-center"
		];
		if (this.props.className)
			result.push(this.props.className);
		return result.join(" ");
	}

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
	className?: string;
}

type State = {
	showCount: number;
}
