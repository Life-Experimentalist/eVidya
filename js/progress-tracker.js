// Progress Tracker Module
// Handles tracking user progress through courses

// Create the ProgressTracker namespace if it doesn't exist
window.ProgressTracker = window.ProgressTracker || {};

(function () {
	// Get progress data from localStorage
	function getProgressData() {
		try {
			const data = localStorage.getItem("courseProgress");
			return data ? JSON.parse(data) : {};
		} catch (e) {
			console.error("Error loading progress data:", e);
			return {};
		}
	}

	// Save progress data to localStorage
	function saveProgressData(data) {
		try {
			localStorage.setItem("courseProgress", JSON.stringify(data));
		} catch (e) {
			console.error("Error saving progress data:", e);
		}
	}

	// Initialize a course if it doesn't exist in the progress data
	function initCourse(progressData, courseId) {
		if (!progressData[courseId]) {
			progressData[courseId] = {
				started: new Date().toISOString(),
				lastAccessed: new Date().toISOString(),
				completed: [],
				started: [],
				totalItems: 0,
			};
		}
		return progressData;
	}

	// Mark a content item as started
	window.ProgressTracker.markContentStarted = function (courseId, contentId) {
		let progressData = getProgressData();
		progressData = initCourse(progressData, courseId);

		progressData[courseId].lastAccessed = new Date().toISOString();

		// Add to started array if not already there
		if (!progressData[courseId].started.includes(contentId)) {
			progressData[courseId].started.push(contentId);
		}

		saveProgressData(progressData);
	};

	// Mark content as completed
	window.ProgressTracker.markContentCompleted = function (
		courseId,
		contentId
	) {
		let progressData = getProgressData();
		progressData = initCourse(progressData, courseId);

		progressData[courseId].lastAccessed = new Date().toISOString();

		// Add to completed array if not already there
		if (!progressData[courseId].completed.includes(contentId)) {
			progressData[courseId].completed.push(contentId);
		}

		saveProgressData(progressData);
	};

	// Check if content is completed
	window.ProgressTracker.isContentCompleted = function (courseId, contentId) {
		const progressData = getProgressData();
		return (
			progressData[courseId] &&
			progressData[courseId].completed &&
			progressData[courseId].completed.includes(contentId)
		);
	};

	// Check if content is started
	window.ProgressTracker.isContentStarted = function (courseId, contentId) {
		const progressData = getProgressData();
		return (
			progressData[courseId] &&
			progressData[courseId].started &&
			progressData[courseId].started.includes(contentId)
		);
	};

	// Get course progress percentage
	window.ProgressTracker.getCourseProgress = function (courseId) {
		try {
			// Get course data to count total items
			let totalItems = 0;
			let course = null;

			if (typeof getCourses === "function") {
				course = getCourses().find((c) => c.id === courseId);
			}

			if (course && course.sections) {
				course.sections.forEach((section) => {
					if (section.videos) totalItems += section.videos.length;
					if (section.quiz) totalItems += 1;
				});
			}

			const progressData = getProgressData();

			if (!progressData[courseId]) {
				return {
					completed: 0,
					total: totalItems,
					percentage: 0,
				};
			}

			const completed = progressData[courseId].completed
				? progressData[courseId].completed.length
				: 0;

			const percentage =
				totalItems > 0 ? Math.round((completed / totalItems) * 100) : 0;

			return {
				completed: completed,
				total: totalItems,
				percentage: percentage,
			};
		} catch (e) {
			console.error("Error calculating course progress:", e);
			return { completed: 0, total: 0, percentage: 0 };
		}
	};

	// Reset course progress
	window.ProgressTracker.resetCourseProgress = function (courseId) {
		let progressData = getProgressData();

		if (progressData[courseId]) {
			progressData[courseId] = {
				started: new Date().toISOString(),
				lastAccessed: new Date().toISOString(),
				completed: [],
				started: [],
			};

			saveProgressData(progressData);
		}
	};

	// Get all courses progress (for dashboard)
	window.ProgressTracker.getAllCoursesProgress = function () {
		const progressData = getProgressData();
		const result = [];

		for (const courseId in progressData) {
			const courseProgress = this.getCourseProgress(courseId);
			if (courseProgress.total > 0) {
				result.push({
					courseId: courseId,
					completed: courseProgress.completed,
					total: courseProgress.total,
					percentage: courseProgress.percentage,
					lastAccessed: progressData[courseId].lastAccessed,
				});
			}
		}

		return result;
	};

	// For backward compatibility with older API calls
	window.ProgressTracker.markVideoComplete = function (courseId, videoId) {
		this.markContentCompleted(courseId, videoId);
	};

	window.ProgressTracker.isVideoCompleted = function (courseId, videoId) {
		return this.isContentCompleted(courseId, videoId);
	};

	console.log("Progress Tracker module initialized");
})();
