// import winterCollection from "../../assets/Image/SummerCollection.png";
// import Snowfall from "./Snowfall";

// const WinterBanner = () => {
// 	return (
// 		<>
// 			<div className="relative h-80 flex items-center justify-center lg:pt-72 ">
// 				{/* Snowfall Effect */}
// 				{/* <div className="absolute inset-0">
// 					<Snowfall />
// 				</div> */}

// 				{/* Background Image */}
// 				<div
// 					className="absolute inset-0 bg-cover  bg-center  "
// 					style={{
// 						backgroundImage: `url(${winterCollection})`,
// 					}}
// 				></div>

// 				{/* Banner Title */}
// 				{/* <h1
//           className='relative text-gradient px-4 py-2 z-10'
//           data-text='Winter Collection'
//         >
//           Winter Collection
//         </h1> */}
// 			</div>
// 		</>
// 	);
// };

// export default WinterBanner;

import winterCollection from "../../assets/Image/banner/raincollection.png";
import winterCollectionmobile from "../../assets/Image/banner/phonesize.png";

const WinterBanner = () => {
	return (
		<div className="relative h-96 flex items-center justify-center overflow-hidden">
			{/* Background Image */}
			<img
				src={winterCollection}
				alt="Winter Collection"
				className=" hidden  md:block absolute inset-0 w-full h-[1000px] object-cover"
			/>

			<img
				src={winterCollectionmobile}
				alt="Winter Collection"
				className=" block md:hidden absolute inset-0 w-full h-[450px] object-cover"
			/>

			{/* Overlay */}
			{/* <div className="absolute inset-0 bg-black bg-opacity-30"></div> */}

			{/* Banner Title */}
			{/* <h1 className="relative text-4xl font-bold text-white px-4 py-2 z-10">
				Winter Collection
			</h1> */}
		</div>
	);
};

export default WinterBanner;
