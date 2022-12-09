import React from "react";

/**
 * Animated circle spinner component.
 */
export default class Spinner extends React.Component<Props> {

	public static readonly defaultProps = {
		length: .3,
		duration: 1,
		direction: "clockwise"
	}

	private get className(): string {
		const result = [
			"spinner"
		];
		if (this.props.className)
			result.push(this.props.className);
		return result.join(" ");
	}

	private get size(): number {
		return +this.props.r * 2;
	}

	private get realRadius(): number {
		return +this.props.r - Math.ceil(+this.props.width / 2);
	}

	private get style(): React.CSSProperties {
		const circleLength = Math.ceil(2 * Math.PI * this.realRadius);
		const segmentLength = Math.round(circleLength * +this.props.length!);
		const gapLength = circleLength - segmentLength;
		return {
			fill: "none",
			strokeWidth: this.props.width,
			stroke: this.props.color,
			strokeDasharray: `${segmentLength} ${gapLength}`,
			animation: `spin-clockwise ${this.props.duration}s linear 0s infinite ${this.props.direction === "clockwise" ? "normal" : "reverse"}`
		};
	}

	public override render(): React.ReactNode {
		const size = this.size;
		return (
			<svg xmlns="http://www.w3.org/2000/svg" className={this.className} viewBox={`0 0 ${size} ${size}`} width={size} height={size} style={this.style}>
				<circle cx={this.props.r} cy={this.props.r} r={this.realRadius} />
			</svg>
		);
	}
}

type Props = {

	/**
	 * Radius of the circle.
	 */
	r: number | `${number}`;

	/**
	 * Width of the circle's stroke.
	 */
	width: number | `${number}`;

	/**
	 * Color of the circle's stroke.
	 */
	color: string;

	/**
	 * Length of the segment. Accepts values from 0 to 1.
	 * @defaultValue `.3`
	 */
	length?: number | `${number}`;

	/**
	 * Duration of one loop of animation in seconds.
	 * @defaultValue `1`
	 */
	duration?: number | `${number}`;

	/**
	 * Direction in which to spin the circle.
	 * @defaultValue `"clockWise"`
	 */
	direction?: "clockwise" | "counter-clockwise";

	/**
	 * Additional CSS classname.
	 */
	className?: string;
}
