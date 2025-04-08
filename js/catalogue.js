// Wait for the DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
	// Get references to DOM elements
	const coursesContainer = document.getElementById("courses-container");
	const searchInput = document.getElementById("search-input");
	const searchBtn = document.getElementById("search-btn");
	const difficultyFilter = document.getElementById("difficulty-filter");
	const subjectFilter = document.getElementById("subject-filter");
	const durationFilter = document.getElementById("duration-filter");
	const gridViewBtn = document.getElementById("grid-view-btn");
	const listViewBtn = document.getElementById("list-view-btn");
	const noResults = document.getElementById("no-results");

	// Initialize the page
	init();

	function init() {
		// Check if course data is available
		if (!window.courseData || !window.courseData.courses) {
			console.error("Course data not found!");
			showNoResults("Error loading course data");
			return;
		}

		// Render all courses initially
		renderCourses(window.courseData.courses);

		// Set up event listeners
		setupEventListeners();
	}

	function setupEventListeners() {
		// Search functionality
		searchBtn.addEventListener("click", filterCourses);
		searchInput.addEventListener("keyup", function (event) {
			if (event.key === "Enter") {
				filterCourses();
			}
		});

		// Filter change events
		difficultyFilter.addEventListener("change", filterCourses);
		subjectFilter.addEventListener("change", filterCourses);
		durationFilter.addEventListener("change", filterCourses);

		// View toggle
		gridViewBtn.addEventListener("click", function () {
			setViewMode("grid");
		});

		listViewBtn.addEventListener("click", function () {
			setViewMode("list");
		});
	}

	function filterCourses() {
		const searchTerm = searchInput.value.toLowerCase();
		const difficulty = difficultyFilter.value;
		const subject = subjectFilter.value;
		const duration = durationFilter.value;

		let filteredCourses = window.courseData.courses.filter((course) => {
			// Filter by search term
			if (
				searchTerm &&
				!course.title.toLowerCase().includes(searchTerm) &&
				!course.description.toLowerCase().includes(searchTerm)
			) {
				return false;
			}

			// Filter by difficulty
			if (difficulty && course.difficulty !== difficulty) {
				return false;
			}

			// Filter by subject (assuming subject is a property, may need adjustment)
			if (subject && course.subject !== subject) {
				return false;
			}

			// Filter by duration
			if (duration) {
				const hours = parseInt(course.duration);
				if (duration === "0-5" && (hours < 0 || hours > 5))
					return false;
				if (duration === "5-10" && (hours < 5 || hours > 10))
					return false;
				if (duration === "10+" && hours <= 10) return false;
			}

			return true;
		});

		// Render the filtered courses
		renderCourses(filteredCourses);
	}

	function renderCourses(courses) {
		// Remove loading indicator
		const loadingIndicator =
			coursesContainer.querySelector(".loading-indicator");
		if (loadingIndicator) {
			loadingIndicator.remove();
		}

		// Clear the current courses
		coursesContainer.innerHTML = "";

		// Show message if no courses match filters
		if (courses.length === 0) {
			showNoResults();
			return;
		}

		// Hide no results message if showing courses
		noResults.classList.add("hidden");

		// Render each course
		courses.forEach((course) => {
			const courseCard = createCourseCard(course);
			coursesContainer.appendChild(courseCard);
		});
	}

	function createCourseCard(course) {
		const card = document.createElement("div");
		card.className = "course-card";

		// Use placeholder image if course image is not available
		const imageSrc = course.image || "../img/course-placeholder.jpg";

		card.innerHTML = `
            <div class="course-image">
                <img src="${imageSrc}" alt="${course.title}">
                <div class="difficulty-badge ${course.difficulty.toLowerCase()}">${
			course.difficulty
		}</div>
            </div>
            <div class="course-content">
                <h3>${course.title}</h3>
                <p>${course.description}</p>
                <div class="course-meta">
                    <span class="instructor"><img src="../img/icons/user.svg" alt="Instructor"> ${
						course.instructor
					}</span>
                    <span class="duration"><img src="../img/icons/clock.svg" alt="Duration"> ${
						course.duration
					}</span>
                </div>
                <a href="course-details.html?courseId=${
					course.id
				}" class="btn btn-primary btn-block">View Course</a>
            </div>
        `;

		// Add click event to the card
		card.addEventListener("click", function (event) {
			// Prevent redirection if clicking on the button
			if (!event.target.closest(".btn")) {
				window.location.href = `course-details.html?courseId=${course.id}`;
			}
		});

		return card;
	}

	function setViewMode(mode) {
		if (mode === "grid") {
			coursesContainer.className = "courses-grid";
			gridViewBtn.classList.add("active");
			listViewBtn.classList.remove("active");
		} else {
			coursesContainer.className = "courses-list";
			listViewBtn.classList.add("active");
			gridViewBtn.classList.remove("active");
		}
	}

	function showNoResults(message = null) {
		noResults.classList.remove("hidden");

		if (message) {
			const heading = noResults.querySelector("h2");
			if (heading) {
				heading.textContent = message;
			}
		}
	}
});
