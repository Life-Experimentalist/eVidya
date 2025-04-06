/**
 * Courses page script
 * Handles displaying and interacting with the course list
 */

document.addEventListener("DOMContentLoaded", function () {
	// Get references to DOM elements
	const coursesContainer = document.getElementById("courses-container");

	// Check if courses data is available
	if (!window.courseData || !window.courseData.courses) {
		coursesContainer.innerHTML =
			'<div class="alert alert-danger">Error: Course data not available</div>';
		return;
	}

	// Function to create course elements
	function renderCourses() {
		// Clear loading message
		coursesContainer.innerHTML = "";

		// Get courses data
		const courses = window.courseData.courses;

		// Loop through courses and create elements
		courses.forEach((course) => {
			// Create column for grid layout
			const courseCol = document.createElement("div");
			courseCol.className = "col-md-6 col-lg-3";

			// Create course card element
			const courseCard = document.createElement("div");
			courseCard.className = "course-card";
			courseCard.dataset.courseId = course.id;

			// Get course progress if available
			let progressHtml = "";
			let progressPercentage = 0;
			if (window.ProgressTracker) {
				const progress = ProgressTracker.getCourseProgress(course.id);
				progressPercentage = progress.percentage;
				progressHtml = `
                    <div class="course-progress">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${progress.percentage}%"></div>
                        </div>
                        <span class="progress-text">${progress.percentage}% Complete</span>
                    </div>
                `;
			}

			// Set card content - using CSS placeholders instead of actual images
			// Make the entire title clickable by wrapping it in an anchor tag
			courseCard.innerHTML = `
                <div class="course-image" data-course="${course.title}"></div>
                <div class="course-content">
                    <h3 class="course-title">
                        <a href="#" class="course-title-link" data-course-id="${course.id}">${course.title}</a>
                    </h3>
                    <p class="course-description">${course.description}</p>
                    <div class="course-meta">
                        <span class="course-duration">${course.duration}</span>
                    </div>
                    ${progressHtml}
                    <button class="btn primary-btn view-course-btn" data-course-id="${course.id}">View Course</button>
                </div>
            `;

			// Append card to column
			courseCol.appendChild(courseCard);

			// Append column to container
			coursesContainer.appendChild(courseCol);
		});

		// Add event listeners for course buttons
		document.querySelectorAll(".view-course-btn").forEach((button) => {
			button.addEventListener("click", function () {
				const courseId = this.getAttribute("data-course-id");
				navigateToCourse(courseId);
			});
		});

		// Add event listeners for course title links
		document.querySelectorAll(".course-title-link").forEach((link) => {
			link.addEventListener("click", function (e) {
				e.preventDefault();
				const courseId = this.getAttribute("data-course-id");
				navigateToCourse(courseId);
			});
		});
	}

	// Render the courses
	renderCourses();
});
