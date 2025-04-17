import { useState, useEffect } from "react";
import bigrose from "../../assets/svg/rosevector.svg";
import quotes from "../../assets/svg/quotes.svg";

const testimonials = [
	{
		text: "I’ve struggled with sensitive skin and acne for a really long time. Finding a product that’s both effective and gentle has always been a challenge—until I discovered Nida's Pure. Their camel milk soap and saffron and gold face oil is a game changer! It leaves my skin feeling fresh and glowing without any irritation. I love that it’s made from natural, Ayurvedic ingredients. It’s like I’m treating my skin with love every time I use it.",
		name: "Sara Patel",
		age: 19,
	},
	{
		text: "I've struggled with sensitive skin and acne for a really long time. Finding a product that's both effective and gentle has always been a challenge—until I discovered Nida's Pure. Their camel milk soap and saffron and gold face oil is a game changer! It leaves my skin feeling fresh and glowing without any irritation. I love that it's made from natural, Ayurvedic ingredients. It's like I’m treating my skin with love every time I use it.",
		name: "Amit Singh",
		age: 25,
		// country: 'USA',
	},
	{
		text: "I've struggled with sensitive skin and acne for a really long time. Finding a product that's both effective and gentle has always been a challenge—until I discovered Nida's Pure. Their camel milk soap and saffron and gold face oil is a game changer! It leaves my skin feeling fresh and glowing without any irritation. I love that it's made from natural, Ayurvedic ingredients. It's like I’m treating my skin with love every time I use it.",
		name: "Parul Sharma",
		age: 30,
		// country: 'UK',
	},
];

const Testimonial = () => {
	const [activeIndex, setActiveIndex] = useState(0);

	useEffect(() => {
		const interval = setInterval(() => {
			setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
		}, 5000); // Auto-slide every 5 seconds
		return () => clearInterval(interval);
	}, []);

	return (
		<div className="flex flex-col items-center p-4">
			<div className="relative bg-white shadow-lg rounded-lg overflow-hidden max-w-full lg:max-w-[1240px] lg:h-[490px] md:h-[530px] xs:h-[460px] md-sm:h-[540px] sm:h-[580px]">
				<div
					className="flex transition-transform duration-[2000ms] ease-in-out"
					style={{ transform: `translateX(-${activeIndex * 100}%)` }}
				>
					{testimonials.map((testimonial, index) => (
						<div
							key={index}
							className="flex-shrink-0 w-full max-w-full sm:max-w-[1240px] h-[420px] text-center p-8 relative"
						>
							<div className="absolute top-0  left-0 right-0 flex justify-center items-center">
								<img
									src={bigrose}
									alt="Horizontal Decoration"
									className="w-[250px] sm:w-[300px] md:w-[400px] opacity-20"
								/>
							</div>
							<div className="flex justify-center mt-12 sm:mt-16">
								<img
									src={quotes}
									alt="Quotes Decoration"
									className="w-[52px] h-[38px] sm:w-[76px] sm:h-[56px] md:w-[104px] md:h-[76px] lg:mt-3 md-sm:mt-0 sm:mt-[-10px] xs:mt-[-10px]  z-50"
								/>
							</div>
							<p className="text-gray-800 lg:mt-3 xl:mt-7 md:mt-1 text-sm sm:text-base md:text-lg md:px-2 ">
								{testimonial.text}
							</p>
							<h4 className="text-base sm:text-lg md:text-xl font-semibold mt-2">
								{testimonial.name}, {testimonial.age}
							</h4>
							<p className="text-gray-800 mt-1 text-sm sm:text-base md:text-lg z-50  ">
								{testimonial.country}
							</p>
							<div className="absolute lg:bottom-[-70px] md:bottom-[-110px] xs:bottom-[-40px] md-sm:bottom-[-120px] sm:bottom-[-160px] left-0 right-0 flex justify-center items-center">
								<img
									src={bigrose}
									alt="Horizontal Decoration"
									className="w-[250px] sm:w-[300px] md:w-[400px] rotate-180 opacity-20"
								/>
							</div>
						</div>
					))}
				</div>
			</div>

			{/* circle */}
			<div className="flex justify-center items-center mt-4 space-x-4">
				{testimonials.map((_, index) => (
					<div
						key={index}
						className={`relative flex items-center justify-center transition-all ${
							index === activeIndex ? "w-6 h-6" : "w-4 h-4"
						}`}
					>
						{/* Outer Circle */}
						<div
							className={`absolute w-full h-full rounded-full border-2 transition-all ${
								index === activeIndex ? "border-gray-600" : "border-gray-300"
							}`}
						></div>

						{/* Inner Circle */}
						<div
							className={`absolute ${
								index === activeIndex ? "w-3 h-3" : "w-2 h-2"
							} rounded-full transition-all ${
								index === activeIndex ? "bg-gray-600" : "bg-gray-300"
							}`}
						></div>
					</div>
				))}
			</div>
		</div>
	);
};

export default Testimonial;
