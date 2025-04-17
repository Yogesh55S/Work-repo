import { useState, useEffect } from "react";
import { FaLeaf } from "react-icons/fa";

// Product images as backgrounds
import saffronOilDesktop from "../../assets/Image/banner/safronOilDesktop.png";
import saffronOilMobile from "../../assets/Image/banner/safronOilMobile.png";

import hairOilDesktop from "../../assets/Image/banner/hairOilDesktop.png";
import hairOilMobile from "../../assets/Image/banner/hairoilMobile.png";

import camelMilkDesktop from "../../assets/Image/banner/sopBarDesktop.png";
import camelMilkMobile from "../../assets/Image/banner/sopBarMobile.png";

import handCreamDesktop from "../../assets/Image/banner/BodyOilDesktop.png";
import handCreamMobile from "../../assets/Image/banner/BodyoilMobile.png";

const products = [
	{
		id: 1,
		title: "Saffron & Gold Face Oil",
		subtitle: "Indulge in Timeless Beauty",
		description:
			"A luxurious blend of over 40 herbs and oils with 24k certified gold and Kashmiri saffron",
		buttonText: "Shop Now",
		desktopImage: saffronOilDesktop,
		mobileImage: saffronOilMobile,
	},
	{
		id: 2,
		title: "Energizing Hair Oil",
		subtitle: "Transform Your Hair",
		description:
			"17-oil blend enriched with Vitamin E, Lavender, Fenugreek, Argan, and Almond oils",
		buttonText: "Shop Now",
		desktopImage: hairOilDesktop,
		mobileImage: hairOilMobile,
	},
	{
		id: 3,
		title: "Camel Milk Soap Bar",
		subtitle: "Embrace Winter Skincare",
		description:
			"Plant-based therapeutic blend with camel milk's natural lactic acid for deep hydration",
		buttonText: "Shop Now",
		desktopImage: camelMilkDesktop,
		mobileImage: camelMilkMobile,
	},
	{
		id: 4,
		title: "Restoring Hand Cream",
		subtitle: "Pamper Your Hands",
		description:
			"Luxurious blend with rose absolute and helichrysum essential oils for deep nourishment",
		buttonText: "Shop Now",
		desktopImage: handCreamDesktop,
		mobileImage: handCreamMobile,
	},
];
const redirectToShop = () => {
	// Replace with your shop URL
	window.location.href = "/shop";
};

const Banner = () => {
	const [currentIndex, setCurrentIndex] = useState(0);

	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentIndex((prevIndex) =>
				prevIndex === products.length - 1 ? 0 : prevIndex + 1,
			);
		}, 6000); // Change banner every 6 seconds
		return () => clearInterval(interval);
	}, []);

	const handleDotClick = (index) => {
		setCurrentIndex(index);
	};

	return (
		<div className="relative h-screen w-full overflow-hidden">
			{/* Products Carousel */}
			{products.map((product, index) => (
				<div
					key={product.id}
					className={`absolute inset-0 transition-opacity duration-1000 ${
						index === currentIndex ? "opacity-100" : "opacity-0"
					}`}
				>
					{/* Background Product Image - Different for desktop vs mobile */}
					<div className="absolute inset-0 w-full h-full">
						{/* Desktop Background - Adjusted to be less right-focused */}
						<div
							className="hidden md:block absolute inset-0 bg-cover bg-center md:bg-right-top bg-no-repeat"
							style={{
								backgroundImage: `url(${product.desktopImage})`,
							}}
						/>

						{/* Mobile Background */}
						<div
							className="md:hidden absolute inset-0 bg-cover bg-center bg-no-repeat"
							style={{
								backgroundImage: `url(${product.mobileImage})`,
							}}
						/>

						{/* Overlay for better text visibility - Desktop only */}
						<div className="hidden md:block absolute inset-0 bg-gradient-to-r from-button-primary/80 via-button-primary/10 to-transparent"></div>
					</div>

					{/* Content Layer */}
					<div className="relative z-10 h-full flex items-center">
						{/* Mobile View - Moved up from center */}
						<div className="md:hidden w-full h-full flex flex-col justify-center pb-80">
							<div className="px-6 mx-auto text-center space-y-4">
								<div className="flex items-center space-x-2 text-button-primary text-sm font-medium justify-center">
									<FaLeaf className="text-xl" />
									<span>Natural Beauty</span>
								</div>

								<h1 className="text-4xl text-button-primary tracking-wider font-bold">
									{product.title}
								</h1>

								<div>
									<button
										className="px-3 py-2 bg-button-primary text-white text-lg shadow-lg hover:bg-primary transition rounded-md mt-4"
										onClick={redirectToShop}
									>
										{product.buttonText}
									</button>
								</div>
							</div>
						</div>

						{/* Desktop View - Full Content */}
						<div className="hidden md:block w-full md:w-[60%] xl:w-[80%] px-6 md:px-12 lg:px-24">
							<div className="max-w-3xl mx-auto md:mx-0 text-left  md:space-y-6">
								<div className="flex items-center space-x-2 text-white text-sm font-medium">
									<FaLeaf className="text-xl" />
									<span>Natural Beauty</span>
								</div>

								<h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white tracking-wider font-bold">
									{product.title}
								</h1>

								<h2 className="text-2xl sm:text-3xl md:text-4xl text-white tracking-wide">
									{product.subtitle}
								</h2>

								<p className="text-lg text-white opacity-90">
									{product.description}
								</p>

								<div>
									<button
										className="px-6 py-3 bg-button-primary text-white text-lg shadow-lg hover:bg-primary transition rounded-md mt-4"
										onClick={redirectToShop}
									>
										{product.buttonText}
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			))}

			{/* Navigation Dots */}
			<div className="absolute bottom-6 left-0 right-0 flex justify-center space-x-3 z-20">
				{products.map((_, index) => (
					<button
						key={index}
						onClick={() => handleDotClick(index)}
						className={`w-3 h-3 rounded-full transition-all ${
							index === currentIndex
								? "bg-white w-8"
								: "bg-white/50 hover:bg-white/80"
						}`}
						aria-label={`Go to slide ${index + 1}`}
					/>
				))}
			</div>
		</div>
	);
};

export default Banner;
