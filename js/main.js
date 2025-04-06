/**
 * Main JavaScript file for the eVidya Platform
 * Handles initialization and global utilities
 */

// Detect if we're running on GitHub Pages and adjust paths if needed
(function () {
	// For GitHub Pages - set the expected base path (can be empty for username.github.io repos)
	const githubPagesRepo = "eVidya";

	// Function to determine if we're running on GitHub Pages
	function isRunningOnGitHubPages() {
		return window.location.hostname.includes("github.io");
	}

	// Function to get the correct base path
	function getBasePath() {
		if (isRunningOnGitHubPages()) {
			// We're on GitHub Pages, use the repository name as the base path
			// Some repos might be deployed at the root (username.github.io)
			if (window.location.pathname.includes(`/${githubPagesRepo}/`)) {
				return `/${githubPagesRepo}`;
			}
			return ""; // No base path needed for username.github.io repos
		}
		// We're running locally, use the current directory
		return "";
	}

	// Set the base path globally so it can be used throughout the app
	window.basePath = getBasePath();

	// Helper function to get correct paths for resources
	window.getCorrectPath = function (path) {
		// If path is empty or null, return an empty string
		if (!path) return "";

		// If we're not on GitHub Pages, just return the path
		if (!isRunningOnGitHubPages()) {
			return path;
		}

		// If the path already includes the base path, return it as is
		if (window.basePath && path.includes(window.basePath)) {
			return path;
		}

		// If path starts with /, append it to the base path
		if (path.startsWith("/")) {
			return window.basePath + path;
		}

		// If path is relative (starts with ./ or ../), we need to be careful
		if (path.startsWith("./") || path.startsWith("../")) {
			// If we're at the root and using a relative path, drop the ./ prefix
			if (
				window.location.pathname === window.basePath + "/" &&
				path.startsWith("./")
			) {
				return window.basePath + path.substring(1);
			}
			return path; // Otherwise keep the relative path
		}

		// For other paths that don't start with / or ./, treat as relative to current page
		return path;
	};

	console.log("Base path set to: " + window.basePath);
	console.log("eVidya Platform initialized");
})();

// Global error handler to provide better UX if something fails
window.addEventListener("error", function (event) {
	console.error("Global error caught:", event.error);
	// Don't show error messages to the user in production
	if (window.location.hostname === "localhost") {
		alert("An error occurred: " + event.error.message);
	}
});

document.addEventListener("DOMContentLoaded", function () {
	// Fix all links in the document to use the correct path
	document
		.querySelectorAll('a[href]:not([href^="http"]):not([href^="#"])')
		.forEach((link) => {
			const originalHref = link.getAttribute("href");
			link.setAttribute("href", window.getCorrectPath(originalHref));
		});

	// Get the courses button
	const coursesButton = document.querySelector(".cta-button .btn");

	// Add click event listener
	if (coursesButton) {
		coursesButton.addEventListener("click", function (e) {
			// Use the correct path function for navigation
			e.preventDefault();
			const targetPath = window.getCorrectPath("./pages/courses.html");
			console.log("Navigating to:", targetPath);
			window.location.href = targetPath;
		});
	}

	console.log("eVidya Platform initialized successfully!");
});
