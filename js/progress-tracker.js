// progress-tracker.js

/**
 * ProgressTracker - Manages user progress through courses
 * Tracks completed videos, quiz scores, and overall course completion
 */
class ProgressTracker {
	/**
	 * Marks a video as watched for a specific course
	 * @param {string} courseId - The course ID
	 * @param {string} videoId - The video ID to mark as completed
	 */
	static markVideoComplete(courseId, videoId) {
		const progressKey = `techCourses_progress_${courseId}`;
		const progress = StorageManager.getData(progressKey, {
			completedVideos: [],
			quizScores: {},
		});

		if (!progress.completedVideos.includes(videoId)) {
			progress.completedVideos.push(videoId);
			StorageManager.saveData(progressKey, progress);
		}

		this.updateCourseCompletion(courseId);
	}

	/**
	 * Saves a quiz score for a specific course and quiz
	 * @param {string} courseId - The course ID
	 * @param {string} quizId - The quiz ID
	 * @param {number} score - The score (percentage)
	 */
	static saveQuizScore(courseId, quizId, score) {
		const progressKey = `techCourses_progress_${courseId}`;
		const progress = StorageManager.getData(progressKey, {
			completedVideos: [],
			quizScores: {},
		});

		progress.quizScores[quizId] = score;
		StorageManager.saveData(progressKey, progress);

		this.updateCourseCompletion(courseId);
	}

	/**
	 * Get the completion status for a specific course
	 * @param {string} courseId - The course ID
	 * @returns {Object} Object containing completion details
	 */
	static getCourseProgress(courseId) {
		const progressKey = `techCourses_progress_${courseId}`;
		const progress = StorageManager.getData(progressKey, {
			completedVideos: [],
			quizScores: {},
		});

		const course = window.courseData.getCourseById(courseId);
		if (!course) return { completed: false, percentage: 0 };

		const totalVideos = window.courseData.getTotalVideos(courseId);
		const totalQuizzes = window.courseData.getTotalQuizzes(courseId);
		const completedVideos = progress.completedVideos.length;
		const completedQuizzes = Object.keys(progress.quizScores).length;

		const totalItems = totalVideos + totalQuizzes;
		const completedItems = completedVideos + completedQuizzes;

		const percentage =
			totalItems > 0
				? Math.floor((completedItems / totalItems) * 100)
				: 0;

		return {
			completed: percentage === 100,
			percentage,
			completedVideos,
			totalVideos,
			completedQuizzes,
			totalQuizzes,
			quizScores: progress.quizScores,
		};
	}

	/**
	 * Check if a specific video has been completed
	 * @param {string} courseId - The course ID
	 * @param {string} videoId - The video ID to check
	 * @returns {boolean} True if the video has been completed
	 */
	static isVideoCompleted(courseId, videoId) {
		const progressKey = `techCourses_progress_${courseId}`;
		const progress = StorageManager.getData(progressKey, {
			completedVideos: [],
			quizScores: {},
		});

		return progress.completedVideos.includes(videoId);
	}

	/**
	 * Get the score for a specific quiz
	 * @param {string} courseId - The course ID
	 * @param {string} quizId - The quiz ID
	 * @returns {number|null} The quiz score or null if not taken
	 */
	static getQuizScore(courseId, quizId) {
		const progressKey = `techCourses_progress_${courseId}`;
		const progress = StorageManager.getData(progressKey, {
			completedVideos: [],
			quizScores: {},
		});

		return progress.quizScores[quizId] || null;
	}

	/**
	 * Update the overall course completion data
	 * @param {string} courseId - The course ID
	 */
	static updateCourseCompletion(courseId) {
		const progress = this.getCourseProgress(courseId);
		const overallProgressKey = "techCourses_overallProgress";
		const overallProgress = StorageManager.getData(overallProgressKey, {});

		overallProgress[courseId] = {
			percentage: progress.percentage,
			completed: progress.completed,
			lastUpdated: new Date().toISOString(),
		};

		StorageManager.saveData(overallProgressKey, overallProgress);
	}

	/**
	 * Reset progress for a specific course
	 * @param {string} courseId - The course ID to reset
	 */
	static resetCourseProgress(courseId) {
		StorageManager.resetCourseProgress(courseId);

		// Also update the overall progress
		const overallProgressKey = "techCourses_overallProgress";
		const overallProgress = StorageManager.getData(overallProgressKey, {});

		if (overallProgress[courseId]) {
			delete overallProgress[courseId];
			StorageManager.saveData(overallProgressKey, overallProgress);
		}
	}
}

// Export the ProgressTracker for use in other files
window.ProgressTracker = ProgressTracker;
