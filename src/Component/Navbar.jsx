// Navbar.js - Fixed user panel navigation
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiShoppingCart, FiUser, FiLogOut } from "react-icons/fi";
import { HiMenu, HiX } from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "./providers/AuthContext";
import { useCart } from "./providers/CartContext";
import logo from "../assets/svg/logos/Group24.svg";
import GuestCartService from "../services/GuestCartService";

const Navbar = () => {
	const { cartCount, updateCartCount } = useCart();
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
	const location = useLocation();
	const navigate = useNavigate();
	const { isLoggedIn, logout, user } = useAuth();

	useEffect(() => {
		const handleResize = () => {
			setIsDesktop(window.innerWidth >= 1024);
		};
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	useEffect(() => {
		// Update cart count on location change or when logged in state changes
		if (isLoggedIn && user?._id) {
			updateCartCount(user._id);
		} else if (!isLoggedIn) {
			// For guest users, update cart count from localStorage
			const count = GuestCartService.getCartCount();
			updateCartCount(count);
		}
	}, [isLoggedIn, user, location, updateCartCount]);

	useEffect(() => {
		// Scroll to top on location change
		window.scrollTo(0, 0);
	}, [location]);

	const handleLogout = async () => {
		await logout();
		updateCartCount(null);
		navigate("/login");
	};

	const handleUserIconClick = () => {
		// Add console logging to debug
		console.log("User icon clicked, isLoggedIn:", isLoggedIn);
		console.log("Current user:", user);

		if (isLoggedIn && user) {
			// Check for both role and _id to ensure proper user object
			const role = user.role || "user";
			console.log(
				"Navigating to:",
				role === "admin" ? "/admin-panel" : "/user-panel",
			);
			navigate(role === "admin" ? "/admin-panel" : "/user-panel");
		} else {
			navigate("/login");
		}
	};

	return (
		<nav className="backdrop-blur-md bg-button-primary/50 text-white h-20 fixed w-full z-50 border-b border-white/10 shadow-lg">
			<div className="container mx-auto px-4 lg:px-8 flex justify-between items-center h-full">
				{/* Brand */}
				<div className="text-2xl font-bold">
					<Link to="/" className="hover:text-secondary transition-colors">
						<img src={logo} alt="nidaspure" className="h-12" />
					</Link>
				</div>

				{/* Desktop Navigation */}
				{isDesktop ? (
					<ul className="hidden lg:flex space-x-8 text-base font-medium">
						{[
							{ name: "Home", path: "/" },
							{ name: "Monsoon Collection", path: "/monsoon-collection" },
							{ name: "Shop", path: "/shop" },
							{ name: "Contact Us", path: "/contact" },
						].map((navItem) => (
							<li key={navItem.path}>
								<Link
									to={navItem.path}
									className={`hover:text-secondary transition-colors ${
										location.pathname === navItem.path ? "text-secondary" : ""
									}`}
								>
									{navItem.name}
								</Link>
							</li>
						))}
					</ul>
				) : null}

				{/* Icons */}
				<div className="flex items-center space-x-6 text-xl">
					{/* Cart Icon with Badge */}
					<Link
						to="/cart"
						className="relative hover:text-secondary transition-colors"
					>
						<FiShoppingCart />
						{cartCount > 0 && (
							<span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
								{cartCount}
							</span>
						)}
					</Link>

					{/* User Icon (Desktop only) */}
					{isDesktop && (
						<div
							onClick={handleUserIconClick}
							className="cursor-pointer hover:text-secondary transition-colors"
						>
							<FiUser />
						</div>
					)}

					{/* Logout Button (Always visible when logged in) */}
					{isDesktop && isLoggedIn && (
						<div
							onClick={handleLogout}
							className="cursor-pointer hover:text-secondary transition-colors flex items-center"
						>
							<FiLogOut />
							<span className="ml-2 hidden lg:inline">Logout</span>
						</div>
					)}

					{/* Hamburger Menu moved here - only visible on mobile */}
					{!isDesktop && (
						<div
							className="cursor-pointer text-2xl"
							onClick={() => setIsMenuOpen((prev) => !prev)}
						>
							{isMenuOpen ? <HiX /> : <HiMenu />}
						</div>
					)}
				</div>
			</div>

			{/* Mobile Navigation */}
			<AnimatePresence>
				{isMenuOpen && !isDesktop && (
					<motion.ul
						initial={{ opacity: 0, y: -10 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -10 }}
						transition={{ duration: 0.3 }}
						className="absolute top-20 left-0 w-full bg-button-primary/50 backdrop-blur-md shadow-lg z-40 flex flex-col text-base font-medium space-y-4 px-6 py-4"
					>
						{[
							{ name: "Home", path: "/" },
							{ name: "Monsoon Collection", path: "/monsoon-collection" },
							{ name: "Shop", path: "/shop" },
							{ name: "Contact Us", path: "/contact" },
						].map((navItem) => (
							<li key={navItem.path}>
								<Link
									to={navItem.path}
									onClick={() => setIsMenuOpen(false)}
									className={`hover:text-secondary transition-colors ${
										location.pathname === navItem.path ? "text-secondary" : ""
									}`}
								>
									{navItem.name}
								</Link>
							</li>
						))}
						{/* Profile Icon */}
						<li>
							<div
								onClick={() => {
									handleUserIconClick();
									setIsMenuOpen(false);
								}}
								className="cursor-pointer hover:text-secondary transition-colors flex items-center space-x-2"
							>
								<FiUser />
								<span>{isLoggedIn ? "My Account" : "Login"}</span>
							</div>
						</li>
						{/* Logout Icon */}
						{isLoggedIn && (
							<li>
								<div
									onClick={() => {
										handleLogout();
										setIsMenuOpen(false);
									}}
									className="cursor-pointer hover:text-secondary transition-colors flex items-center space-x-2"
								>
									<FiLogOut />
									<span>Logout</span>
								</div>
							</li>
						)}
					</motion.ul>
				)}
			</AnimatePresence>
		</nav>
	);
};

export default Navbar;
