import { useEffect, useState } from "react";
// Import your GIF directly (you'll need to add this file to your project)
import loadingGif from "../assets/loader/loader.png";

export default function SimpleGifLoader() {
	const [showLoader, setShowLoader] = useState(true);

	useEffect(() => { 
		// Handle the hiding of the loader once your page is loaded
		const handlePageLoad = () => {
			// Add a small delay to make the transition smoother
			setTimeout(() => {
				setShowLoader(false);
			}, 500);
		};

		// Listen for the window load event
		window.addEventListener("load", handlePageLoad);

		// For cases where the page might already be loaded
		if (document.readyState === "complete") {
			handlePageLoad();
		}

		// Cleanup
		return () => {
			window.removeEventListener("load", handlePageLoad);
		};
	}, []);

	if (!showLoader) return null;

	return (
		<div className="fixed inset-0 flex items-center justify-center bg-white z-50">
			<div className="text-center">
				<img src={loadingGif} alt="Loading..." className="w-32 h-32 mx-auto" />
				<p className="mt-4 text-gray-700 font-medium">Loading...</p>
			</div>
		</div>
	);
}
