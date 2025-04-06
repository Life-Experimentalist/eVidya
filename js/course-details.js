// Course details page functionality

document.addEventListener("DOMContentLoaded", function () {
	// Get the selected course ID from storage (default to 1 now for functional programming)
	const selectedCourseId =
		parseInt(localStorage.getItem("selectedCourseId")) || 1;

	// Get course data from storage using the enhanced StorageManager
	const currentCourse = StorageManager.getCourseData(selectedCourseId);

	if (!currentCourse) {
		console.error("Course not found in storage");
		return; // Exit if course data is not found
	}

	// Get video data for this course
	const courseVideos = courseVideos[selectedCourseId] || [];

	// Update page title with course name
	document.title = currentCourse.title;

	// Set course title and other details
	const courseTitle = document.getElementById("course-title");
	if (courseTitle) {
		courseTitle.textContent = currentCourse.title;
	}

	// Update all instances of course title in the page
	const courseTitleElements = document.querySelectorAll(
		".dynamic-course-title"
	);
	courseTitleElements.forEach((element) => {
		element.textContent = currentCourse.title;
	});

	// Get section titles for this course
	const sectionTitles = CourseSections[selectedCourseId] || [
		"Getting Started",
		"Advanced Topics",
	];

	// Update section titles based on course
	const sectionTitleElements = document.querySelectorAll(".section-title");
	sectionTitleElements.forEach((element, index) => {
		if (index < sectionTitles.length) {
			element.textContent = sectionTitles[index];
		}
	});

	// Update progress bar and text
	const progressBar = document.querySelector(".progress");
	const progressText = document.querySelector(".progress-text");
	if (progressBar) {
		progressBar.style.width = `${currentCourse.progress || 0}%`;
	}
	if (progressText) {
		progressText.textContent = `Your progress: ${
			currentCourse.progress || 0
		}%`;
	}

	// Add a back button to return to courses page
	const backButton = document.createElement("button");
	backButton.className = "btn btn-secondary mt-3 mb-5";
	backButton.textContent = "Back to Courses";
	backButton.addEventListener("click", function () {
		window.location.href = "courses.html";
	});

	// Insert the back button at the top of the page
	const courseContainer = document.querySelector(".container");
	if (courseContainer) {
		courseContainer.insertBefore(backButton, courseContainer.firstChild);
	}

	// Add a reset progress button
	const resetButton = document.createElement("button");
	resetButton.className = "btn btn-danger mt-3 mb-5 ms-2";
	resetButton.textContent = "Reset Progress";
	resetButton.addEventListener("click", function () {
		if (
			confirm(
				"Are you sure you want to reset your progress for this course?"
			)
		) {
			// Reset just this course
			StorageManager.updateCourseData(selectedCourseId, {
				completed: 0,
				completedVideos: [],
				progress: 0,
				grade: null,
				quizCompleted: false,
			});

			// Refresh the page
			window.location.reload();
		}
	});

	// Add the reset button next to the back button
	if (courseContainer && backButton.parentNode) {
		backButton.parentNode.insertBefore(resetButton, backButton.nextSibling);
	}

	// Replace the existing video containers with YouTube iframes
	const videoContainers = document.querySelectorAll(".video-container");
	videoContainers.forEach((container, index) => {
		const videoIndex = parseInt(container.dataset.videoIndex);
		const videoData = courseVideos[videoIndex];

		if (!videoData) return; // Skip if no data for this index

		// Update video title in the heading
		const lessonItem = container.closest(".lesson-item");
		const heading = lessonItem.querySelector("h3");
		if (heading) {
			heading.textContent = videoData.title;
		}

		// Check if this video was already completed
		if (
			currentCourse.completedVideos &&
			currentCourse.completedVideos.includes(videoIndex)
		) {
			if (lessonItem && !lessonItem.querySelector(".badge")) {
				const completedBadge = document.createElement("span");
				completedBadge.className = "badge bg-success ms-2";
				completedBadge.textContent = "Completed";

				if (heading) {
					heading.appendChild(completedBadge);
				}
			}
		}

		// Clear container content
		container.innerHTML = "";

		// Add a placeholder and loading indicator
		const placeholder = document.createElement("div");
		placeholder.className = "video-placeholder";
		placeholder.innerHTML = `
      <div class="d-flex justify-content-center align-items-center h-100">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <span class="ms-2">Loading video...</span>
      </div>
    `;
		container.appendChild(placeholder);

		// Create YouTube iframe - directly insert it without setTimeout to prevent duplicate loading
		const iframe = document.createElement("iframe");
		iframe.className = "youtube-video";
		iframe.id = `youtube-player-${videoIndex}`;
		iframe.width = "100%";
		iframe.height = "400";
		iframe.src = videoData.youtube;
		iframe.title = videoData.title;
		iframe.frameBorder = "0";
		iframe.allow =
			"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
		iframe.allowFullscreen = true;

		// Directly append the iframe and remove the placeholder when loaded
		container.appendChild(iframe);

		// Add event listener to remove placeholder when iframe loads
		iframe.addEventListener("load", function () {
			if (placeholder && placeholder.parentNode) {
				placeholder.parentNode.removeChild(placeholder);
			}
		});
	});

	// YouTube API Integration with error handling
	let players = [];
	let apiLoaded = false;

	// This function will be called when YouTube API is ready
	window.onYouTubeIframeAPIReady = function () {
		apiLoaded = true;
		console.log("YouTube API loaded successfully");

		// Initialize all YouTube players
		document.querySelectorAll(".youtube-video").forEach((frame) => {
			const videoContainer = frame.closest(".video-container");
			const videoIndex = parseInt(videoContainer.dataset.videoIndex);

			try {
				// Create a player for each video using the iframe ID
				const player = new YT.Player(frame.id, {
					events: {
						onReady: function (event) {
							console.log(`Player ${videoIndex} ready`);
							// Remove any remaining loading indicators
							const placeholder =
								videoContainer.querySelector(
									".video-placeholder"
								);
							if (placeholder) placeholder.remove();
						},
						onStateChange: function (event) {
							// YT.PlayerState.ENDED = 0
							if (event.data === 0) {
								trackVideoCompletion(videoIndex);
							}
						},
						onError: function (event) {
							// Handle YouTube player errors
							console.error(
								`YouTube player ${videoIndex} error:`,
								event.data
							);
							const errorMessages = {
								2: "Invalid video URL",
								5: "HTML5 player error",
								100: "Video not found or removed",
								101: "Video embedding not allowed",
								150: "Video embedding not allowed",
							};

							const message =
								errorMessages[event.data] ||
								"An error occurred with the video";

							// Show error message in the container
							const errorDiv = document.createElement("div");
							errorDiv.className = "alert alert-warning mt-2 p-2";
							errorDiv.innerHTML = `<small>${message}</small>`;
							videoContainer.appendChild(errorDiv);
						},
					},
				});

				players.push({
					player: player,
					videoIndex: videoIndex,
				});
			} catch (error) {
				console.error(
					`Error initializing YouTube player ${videoIndex}:`,
					error
				);
				videoContainer.innerHTML += `
          <div class="alert alert-warning">
            Failed to load video player. Please try again later.
          </div>
        `;
			}
		});
	};

	// Function to track video completion
	function trackVideoCompletion(videoIndex) {
		const result = StorageManager.trackVideoCompletion(
			selectedCourseId,
			videoIndex
		);

		if (result) {
			// Update progress bar
			const progressBar = document.querySelector(".progress");
			const progressText = document.querySelector(".progress-text");

			if (progressBar) {
				progressBar.style.width = `${result.progress}%`;
			}

			if (progressText) {
				progressText.textContent = `Your progress: ${result.progress}%`;
			}

			// Add completed badge to the video item if not already present
			const videoContainer = document.querySelector(
				`.video-container[data-video-index="${videoIndex}"]`
			);
			const videoItem = videoContainer
				? videoContainer.closest(".lesson-item")
				: null;

			if (videoItem && !videoItem.querySelector(".badge")) {
				const completedBadge = document.createElement("span");
				completedBadge.className = "badge bg-success ms-2";
				completedBadge.textContent = "Completed";

				const videoTitle = videoItem.querySelector("h3");
				if (videoTitle) {
					videoTitle.appendChild(completedBadge);
				}
			}
		}
	}

	// Check if quiz was already completed and show result
	if (currentCourse.quizCompleted && currentCourse.grade !== null) {
		const quizForm = document.getElementById("quiz-form");
		const quizContainer = quizForm
			? quizForm.closest(".lesson-item")
			: null;

		if (quizContainer) {
			// Create a completed quiz indicator
			const quizResultDiv = document.createElement("div");
			quizResultDiv.className = "alert alert-success mt-3";
			quizResultDiv.innerHTML = `
        <strong>Quiz completed!</strong> Your score: ${currentCourse.grade}%
        <button class="btn btn-sm btn-outline-success ms-3" id="retake-quiz">Retake Quiz</button>
      `;

			// Replace the form with the result
			quizForm.style.display = "none";
			quizContainer.appendChild(quizResultDiv);

			// Add retake quiz functionality
			document
				.getElementById("retake-quiz")
				.addEventListener("click", function () {
					quizForm.style.display = "block";
					quizResultDiv.remove();
				});
		}
	}

	// Load quiz questions for this course
	const quizQuestions = CourseQuizzes[selectedCourseId] || [];
	const quizForm = document.getElementById("quiz-form");

	if (quizForm && quizQuestions.length > 0) {
		// Clear any existing content
		quizForm.innerHTML = "";

		// Generate quiz questions
		quizQuestions.forEach((questionData, qIndex) => {
			const questionDiv = document.createElement("div");
			questionDiv.className =
				"quiz-question" + (qIndex > 0 ? " mt-3" : "");

			let optionsHTML = "";
			questionData.options.forEach((option) => {
				optionsHTML += `
          <div class="form-check">
            <input class="form-check-input" type="radio" name="q${
				qIndex + 1
			}" id="${option.id}" value="${option.isCorrect}">
            <label class="form-check-label" for="${option.id}">${
					option.text
				}</label>
          </div>
        `;
			});

			questionDiv.innerHTML = `
        <p>${qIndex + 1}. ${questionData.question}</p>
        ${optionsHTML}
      `;

			quizForm.appendChild(questionDiv);
		});

		// Add submit button
		const submitBtn = document.createElement("button");
		submitBtn.type = "submit";
		submitBtn.className = "btn btn-primary mt-4";
		submitBtn.textContent = "Submit Answers";
		quizForm.appendChild(submitBtn);

		// Update quiz title
		const quizItem = quizForm.closest(".lesson-item");
		if (quizItem) {
			const quizTitle = quizItem.querySelector("h3");
			if (quizTitle) {
				quizTitle.textContent = `Quiz: Test Your ${currentCourse.title} Knowledge`;
			}
		}

		// Handle quiz submissions with real checking logic
		quizForm.addEventListener("submit", function (e) {
			e.preventDefault();

			let correctAnswers = 0;
			let totalQuestions = quizQuestions.length;

			// Check each answer
			for (let i = 1; i <= totalQuestions; i++) {
				const selectedOption = document.querySelector(
					`input[name="q${i}"]:checked`
				);
				if (selectedOption && selectedOption.value === "true") {
					correctAnswers++;
				}
			}

			// Calculate grade
			const grade = Math.round((correctAnswers / totalQuestions) * 100);

			// Update course in storage
			StorageManager.updateQuizGrade(selectedCourseId, grade);

			// Show results
			alert(`Quiz completed! Your score: ${grade}%`);

			// Refresh the page to show updated state
			window.location.reload();
		});
	}
});
