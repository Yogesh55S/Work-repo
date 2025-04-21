import { useState } from "react";
import leftarrow from "../../assets/svg/leftarrow.svg";
import mailIcon from "../../assets/svg/mail.svg";
import phoneIcon from "../../assets/svg/Phone.svg";

const HelpSupport = () => {
	const [openQuestion, setOpenQuestion] = useState(null);

	const toggleQuestion = (index) => {
		setOpenQuestion(openQuestion === index ? null : index);
	};

	const faqs = [
		{
			question: "Are your products suitable for all skin types?",
			answer:
				"Yes, our products are formulated with gentle, natural ingredients to suit all skin types, including sensitive skin.",
		},
		{
			question: "Is there any allergen information available?",
			answer:
				"Yes, detailed allergen information is available on each product page.",
		},
		{
			question: "What is the shelf life of your products?",
			answer:
				"Our products have a shelf life of 12-24 months depending on the type.",
		},
		{
			question: "How long will it take for my order to arrive?",
			answer: "Orders typically arrive within 3-7 business days.",
		},
		{
			question: "What if my product arrives damaged?",
			answer:
				"Please contact our support team for assistance with damaged products.",
		},
		{
			question: "Are your products free from parabens and sulfates?",
			answer: "Yes, all our products are free from parabens and sulfates.",
		},
		{
			question: "Are your products tested on animals?",
			answer: "No, we do not test any of our products on animals.",
		},
		{
			question: "Do you ship internationally?",
			answer:
				"Yes, we ship to many countries worldwide. Please check our shipping policy.",
		},
	];

	return (
		<div className="max-w-4xl  mx-auto">
			{/* Header */}
			<div className="flex items-center ">
				<h1 className=" text-[#909F8C] md:text-xl font-semibold">
					Customer Support
				</h1>
				<img
					src={leftarrow}
					alt="left arrow"
					className="w-[100px] h-[70px] ml-2"
				/>
			</div>

			{/* Description */}
			<p className="md:mt-2 text-gray-600">
				Need a hand with your order or have a question that&apos;s keeping you
				from ordering your favorite product? Don&apos;t worry, we&apos;re here
				to help! Reach out to our friendly support team 24/7 by phone or email.
			</p>

			{/* Contact Info */}
			<div className="flex items-center justify-center my-14 space-x-8 ">
				<div className="flex flex-col items-center">
					<img src={phoneIcon} alt="phone" className="w-6 h-6 mb-1" />
					<h4 className="text-[16px] text-gray-700">Phone Number</h4>
					<span className="text-gray-700">+91 96432 48874</span>
				</div>
				<div className="flex flex-col items-center">
					<img src={mailIcon} alt="email" className="w-6 h-6 mb-1" />
					<h4 className="text-[16px] text-gray-700">Email Id</h4>
					<span className="text-gray-700">nidaspure2@gmail.com</span>
				</div>
			</div>

			{/* FAQ Section */}
			<div className="mt-6">
				<div className="flex items-center space-x-2 ">
					<h1 className=" text-[#909F8C] md:text-xl font-semibold ">
						Frequently Asked Questions (FAQs)
					</h1>
					<img
						src={leftarrow}
						alt="left arrow"
						className="w-[100px] h-[70px]"
					/>
				</div>

				{/* Description */}
				<p className="mt-2 text-gray-600">
					Need a hand with your order or have a question that&apos;s keeping you
					from ordering your favorite product? Don&apos;t worry, we&apos;re here
					to help! Reach out to our friendly support team 24/7 by phone or
					email.
				</p>

				{/* Questions */}
				<div className="mt-4 space-y-4">
					{faqs.map((faq, index) => (
						<div
							key={index}
							className="shadow p-4 rounded-lg bg-white border border-gray-200"
						>
							<div
								className="flex justify-between items-center cursor-pointer"
								onClick={() => toggleQuestion(index)}
							>
								<h3 className="text-gray-800 font-medium">{faq.question}</h3>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className={`w-5 h-5 text-gray-600 transform transition-transform duration-200 ${
										openQuestion === index ? "rotate-180" : ""
									}`}
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									strokeWidth={2}
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M19 9l-7 7-7-7"
									/>
								</svg>
							</div>
							{openQuestion === index && (
								<p className="mt-2 text-gray-700">{faq.answer}</p>
							)}
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default HelpSupport;
