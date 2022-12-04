import React from "react";
import Control from "view/Control";

export default class App extends React.Component {

	public override render(): React.ReactNode {
		return (
			<section>
				<div className="container">
					<Control className="py-2 w-100 fs-2" placeholder="Find an Emoji" />
				</div>
			</section>
		);
	}
}
