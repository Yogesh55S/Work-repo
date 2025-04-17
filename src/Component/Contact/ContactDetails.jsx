import { FiMapPin, FiPhone, FiMail } from "react-icons/fi"; // Icons for contact details

const ContactDetails = () => {
	// Information for interactive elements
	const address =
		"41, RAJASTHALI APARTMENT, C-1 Rd, Block C-2, Pocket 2, Sector 16C, Pitampura, Delhi, 110034";
	const phoneNumber = "+91 96432 48874";
	const emailAddress = "nidaspure2@gmail.com";

	// URL for Google Maps
	const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

	return (
		<div className="bg-gray-50 py-10 px-4 sm:px-6">
			<div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
				{/* Left Section - Contact Details */}
				<div className="bg-[#F9F4F2] p-6 shadow-md col-span-1">
					<h2 className="text-2xl text-black mb-4">Our Contact Information</h2>
					<p className="text-[#909F8C] mb-6">
						Have an inquiry or some feedback for us? Contact us using the
						details below.
					</p>

					<div className="space-y-6">
						{/* Address - Interactive */}
						<div className="flex items-start p-4 bg-white shadow-md hover:shadow-lg transition-shadow">
							<div className="bg-[#c28565] p-3 mr-4 flex-shrink-0">
								<FiMapPin className="text-white text-xl" />
							</div>
							<div>
								<h3 className="text-lg text-black mb-1">Our Address</h3>
								<a
									href={mapUrl}
									target="_blank"
									rel="noopener noreferrer"
									className="text-[#909F8C] hover:text-[#c28565] transition-colors text-sm sm:text-base"
								>
									{address}
								</a>
							</div>
						</div>

						{/* Phone - Interactive */}
						<div className="flex items-start p-4 bg-white shadow-md hover:shadow-lg transition-shadow">
							<div className="bg-[#c28565] p-3 mr-4 flex-shrink-0">
								<FiPhone className="text-white text-xl" />
							</div>
							<div>
								<h3 className="text-lg text-black mb-1">Phone Number</h3>
								<a
									href={`tel:${phoneNumber}`}
									className="text-[#909F8C] hover:text-[#c28565] transition-colors text-sm sm:text-base"
								>
									Mobile: {phoneNumber}
								</a>
							</div>
						</div>

						{/* Email Address - Interactive */}
						<div className="flex items-start p-4 bg-white shadow-md hover:shadow-lg transition-shadow">
							<div className="bg-[#c28565] p-3 mr-4 flex-shrink-0">
								<FiMail className="text-white text-xl" />
							</div>
							<div>
								<h3 className="text-lg text-black mb-1">Email Address</h3>
								<a
									href={`mailto:${emailAddress}`}
									className="text-[#909F8C] hover:text-[#c28565] transition-colors text-sm sm:text-base"
								>
									{emailAddress}
								</a>
							</div>
						</div>
					</div>
				</div>

				{/* Right Section - Map */}
				<div className="rounded-lg overflow-hidden shadow-md col-span-1 lg:col-span-2 h-[450px] lg:h-auto">
					<iframe
						src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3499.584673628323!2d77.12992437599966!3d28.70206807562688!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d03d96f5c3159%3A0x8afa270160707310!2sRajasthali%20Apartments!5e0!3m2!1sen!2sin!4v1744870756216!5m2!1sen!2sin"
						width="100%"
						height="100%"
						style={{ border: 0 }}
						allowFullScreen=""
						loading="lazy"
						referrerPolicy="no-referrer-when-downgrade"
						title="Nida's Pure Location Map"
					/>
				</div>
			</div>
		</div>
	);
};

export default ContactDetails;
