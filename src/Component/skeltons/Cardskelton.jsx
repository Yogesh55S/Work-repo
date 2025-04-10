import { useState, useEffect } from "react";

const CardSkeleton = () => {
	const [skeletonsToShow, setSkeletonsToShow] = useState(4);

	const calculateSkeletonsToShow = () => {
		const screenWidth = window.innerWidth;
		const cardWidth = 300;
		const spaceBetweenCards = 20;
		const totalCardWidth = cardWidth + spaceBetweenCards;

		if (screenWidth >= 1440) {
			setSkeletonsToShow(4);
		} else {
			const calculatedSkeletons = Math.floor(screenWidth / totalCardWidth);
			setSkeletonsToShow(Math.max(1, calculatedSkeletons)); // Ensure at least 1 skeleton is shown
		}
	};

	useEffect(() => {
		calculateSkeletonsToShow();
		window.addEventListener("resize", calculateSkeletonsToShow);
		return () => {
			window.removeEventListener("resize", calculateSkeletonsToShow);
		};
	}, []);

	const SingleCardSkeleton = () => (
		<div className="p-2">
			<div className="animate-pulse flex flex-col">
				{/* Image placeholder */}
				<div className="bg-gray-200 rounded-lg h-64 w-full mb-4"></div>
				{/* Title placeholder */}
				<div className="bg-gray-200 h-6 w-3/4 mb-2 rounded"></div>
				{/* Price placeholder */}
				<div className="bg-gray-200 h-5 w-1/4 rounded"></div>
			</div>
		</div>
	);

	return (
		<div className="flex flex-wrap">
			{Array(skeletonsToShow)
				.fill()
				.map((_, index) => (
					<div
						key={index}
						className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/4"
						style={{ padding: "0 10px" }}
					>
						<SingleCardSkeleton />
					</div>
				))}
		</div>
	);
};

export default CardSkeleton;
