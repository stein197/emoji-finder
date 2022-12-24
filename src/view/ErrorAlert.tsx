import React from "react";

export default class ErrorAlert extends React.Component<Props> {

	public override render(): React.ReactNode {
		return (
			<p className="alert alert-danger m-0">{this.props.error.message}</p>
		);
	}
}

type Props = {
	error: Error;
}
