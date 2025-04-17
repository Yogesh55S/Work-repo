import WinterBanner from "../Component/Winter/WinterBanner";
// import WinterProducts from '../Component/Winter/WinterProducts'
// import Snowfall from '../Component/Winter/Snowfall'
import Winter from "../Component/Home/Winter";

const WinterCollection = () => {
	return (
		<div className="pt-20">
			{/* <Snowfall/> */}
			<WinterBanner />

			<Winter />
		</div>
	);
};

export default WinterCollection;
