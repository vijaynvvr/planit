import React from "react";
import ReactLoading from "react-loading";

const Loader = (props) => {
	return (
		<ReactLoading
			className={`mx-auto ${props.className}`}
			type={"spinningBubbles"}
			color={"black"}
			height={100}
			width={100}
		/>
	);
};

export default Loader;
