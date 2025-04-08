// Home page functionality

document.addEventListener("DOMContentLoaded", function () {
	console.log("Home page script initialized");
	initHomePage();
});

// Initialize the home page
function initHomePage() {
	loadFeaturedCourses();
	updateMetrics();
}

// Load featured courses on the homepage
function loadFeaturedCourses() {
	const container = document.getElementById("courses-container");
	if (!container) {
		console.log("Courses container not found");
		return;
	}

	try {
		let courses = [];

		// Get courses from window.courses global variable
		if (window.courses && Array.isArray(window.courses)) {
			courses = window.courses;
		} else {
			console.error("No courses found in window.courses");
			container.innerHTML = `
                <div class="col-12">
                    <div class="alert alert-warning">
                        <i class="fas fa-exclamation-triangle me-2"></i>
                        No courses found. Please check back later.
                    </div>
                </div>
            `;
			return;
		}

		// Clear loading indicator and populate courses
		container.innerHTML = "";

		// Limit to 3 featured courses for homepage
		const featuredCourses = courses.slice(0, 3);

		// Create course cards
		featuredCourses.forEach((course) => {
			const card = createCourseCard(course);
			container.appendChild(card);
		});
	} catch (error) {
		console.error("Error loading featured courses:", error);
		container.innerHTML = `
            <div class="col-12">
                <div class="alert alert-danger">
                    <i class="fas fa-exclamation-triangle me-2"></i>
                    Error loading courses: ${error.message}
                </div>
            </div>
        `;
	}
}

// Update platform metrics
function updateMetrics() {
	console.log("Updating metrics...");

	const coursesCountElement = document.getElementById("courses-count");
	const videosCountElement = document.getElementById("videos-count");
	const quizzesCountElement = document.getElementById("quizzes-count");

	if (!coursesCountElement) {
		console.log("Metrics elements not found, skipping metrics update");
		return;
	}

	try {
		let courses = [];

		// Get courses from window.courses global variable
		if (window.courses && Array.isArray(window.courses)) {
			console.log("Found courses for metrics:", window.courses.length);
			courses = window.courses;
		} else {
			console.error("No courses found for metrics calculation");
			return;
		}

		// Calculate metrics
		let videosCount = 0;
		let quizzesCount = 0;

		// Loop through courses to count videos and quizzes
		courses.forEach((course) => {
			if (course.sections) {
				course.sections.forEach((section) => {
					if (section.videos) videosCount += section.videos.length;
					if (section.quiz) quizzesCount++;
				});
			}
		});

		console.log(
			`Metrics calculated: ${courses.length} courses, ${videosCount} videos, ${quizzesCount} quizzes`
		);

		// Update metrics display with calculated data
		coursesCountElement.textContent = courses.length;
		if (videosCountElement) videosCountElement.textContent = videosCount;
		if (quizzesCountElement) quizzesCountElement.textContent = quizzesCount;
	} catch (error) {
		console.error("Error calculating metrics:", error);
	}
}

// Create a course card element
function createCourseCard(course) {
	const col = document.createElement("div");
	col.className = "col-md-4 mb-4";

	// Get progress data if available
	let progress = 0;
	if (window.ProgressTracker) {
		const progressData = window.ProgressTracker.getCourseProgress(
			course.id
		);
		if (progressData) {
			progress = progressData.percentage || 0;
		}
	}

	// Format level with correct badge color
	let levelClass = "bg-info";
	if (course.level) {
		switch (course.level.toLowerCase()) {
			case "beginner":
				levelClass = "bg-success";
				break;
			case "intermediate":
				levelClass = "bg-warning";
				break;
			case "advanced":
				levelClass = "bg-danger";
				break;
		}
	}

	// Use a placeholder div instead of img tag with onerror
	const courseTitle = course.title.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();

	col.innerHTML = `
        <div class="card h-100 course-card">;">
            <div class="course-placeholder" title="${course.title}">
                <i class="fas fa-graduation-cap me-2"></i>${course.title.substring(
					0,
					1
				)}
            </div>
            <div class="card-body">
                <div class="d-flex justify-content-between mb-2">
                    <span class="badge ${levelClass}">${
		course.level || "All Levels"
	}</span>
                    <span class="badge bg-secondary">${getDurationText(
						course
					)}</span>
                </div>
                <h5 class="card-title">${course.title}</h5>
                <p class="card-text text-muted">${course.description}</p>
            </div>
            <div class="card-footer bg-white">
                <div class="d-flex justify-content-between align-items-center">
                    <div class="progress flex-grow-1 me-3" style="height: 8px;">
                        <div class="progress-bar" role="progressbar" style="width: ${progress}%"
                             aria-valuenow="${progress}" aria-valuemin="0" aria-valuemax="100"></div>
                    </div>
                    <a href="pages/course-details.html?courseId=${
						course.id
					}" class="btn btn-sm btn-primary">Start Learning</a>
                </div>
            </div>
        </div>
    `;

	return col;
}

// Get formatted duration text
function getDurationText(course) {
	if (course.duration) {
		return course.duration;
	}

	// Calculate approximate duration based on content
	let totalVideos = 0;
	let totalQuizzes = 0;

	if (course.sections) {
		course.sections.forEach((section) => {
			if (section.videos) totalVideos += section.videos.length;
			if (section.quiz) totalQuizzes++;
		});
	}

	// Estimate 10 minutes per video and 5 minutes per quiz
	const estimatedMinutes = totalVideos * 10 + totalQuizzes * 5;
	const hours = Math.floor(estimatedMinutes / 60);
	const minutes = estimatedMinutes % 60;

	if (hours > 0) {
		return `${hours}h ${minutes > 0 ? minutes + "m" : ""}`;
	} else {
		return `${minutes}m`;
	}
}
