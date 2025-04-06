/**
 * Course Details Page Script
 * Handles loading and displaying course content, videos, and quizzes
 */

document.addEventListener("DOMContentLoaded", function () {
	// Get courseId from URL parameters or localStorage
	let courseId = null;

	// First check URL parameters
	const urlParams = new URLSearchParams(window.location.search);
	if (urlParams.has("courseId")) {
		courseId = urlParams.get("courseId");
		// Save to localStorage for persistence
		localStorage.setItem("selectedCourseId", courseId);
	} else {
		// Try to get from localStorage as fallback
		courseId = localStorage.getItem("selectedCourseId");
	}

	// If still no courseId, default to first course
	if (
		!courseId &&
		window.courseData &&
		window.courseData.courses.length > 0
	) {
		courseId = window.courseData.courses[0].id;
		localStorage.setItem("selectedCourseId", courseId);
	}

	// Get the course data
	const course = window.courseData.getCourseById(courseId);

	if (!course) {
		document.getElementById("course-content").innerHTML = `
            <div class="alert alert-danger">
                <i class="fas fa-exclamation-circle me-2"></i>Course not found. Please <a href="./courses.html">go back</a> and select a course.
            </div>
        `;
		return;
	}

	// Update page title and header
	document.title = course.title + " - eVidya";
	document.getElementById("course-title").textContent = course.title;
	document.getElementById("course-description").textContent =
		course.description;

	// Initialize progress tracking
	const progress = window.ProgressTracker.getCourseProgress(courseId);
	updateProgressDisplay(progress);

	// Populate course content
	populateCourseContent(course);

	// Setup reset progress button
	document
		.getElementById("reset-progress-btn")
		.addEventListener("click", function () {
			if (
				confirm(
					"Are you sure you want to reset your progress for this course?"
				)
			) {
				window.ProgressTracker.resetCourseProgress(courseId);
				window.location.reload();
			}
		});
});

function updateProgressDisplay(progress) {
	const progressBar = document.getElementById("progress-bar");
	progressBar.style.width = progress.percentage + "%";
	progressBar.textContent = progress.percentage + "%";
	progressBar.setAttribute("aria-valuenow", progress.percentage);

	document.getElementById("progress-details").innerHTML =
		`<i class="fas fa-video me-2"></i>Videos: ${progress.completedVideos}/${progress.totalVideos} completed | ` +
		`<i class="fas fa-tasks me-2"></i>Quizzes: ${progress.completedQuizzes}/${progress.totalQuizzes} completed`;
}

// Store the flat structure of all course content elements for navigation
let allContentElements = [];
let currentElementIndex = -1;

function populateCourseContent(course) {
	const contentContainer = document.getElementById("course-content");
	contentContainer.innerHTML = "";

	// Reset content elements array
	allContentElements = [];

	// Check if there are sections to render
	if (!course.sections || course.sections.length === 0) {
		contentContainer.innerHTML = `
            <div class="alert alert-info">
                <i class="fas fa-info-circle me-2"></i>This course has no content yet. Please check back later.
            </div>
        `;
		return;
	}

	// Process all sections and flatten the content structure for easy navigation
	course.sections.forEach((section) => {
		// Add videos to the flat structure
		if (section.videos && section.videos.length > 0) {
			section.videos.forEach((video) => {
				allContentElements.push({
					type: "video",
					id: video.id,
					sectionId: section.id,
					data: video,
					title: video.title,
				});
			});
		}

		// Add quiz to the flat structure
		if (section.quiz) {
			allContentElements.push({
				type: "quiz",
				id: section.quiz.id,
				sectionId: section.id,
				data: section.quiz,
				title: section.quiz.title,
			});
		}
	});

	// Create sections from the course data
	course.sections.forEach((section) => {
		const sectionElement = document.createElement("div");
		sectionElement.className = "section-container mb-5";
		sectionElement.id = "section-" + section.id;

		// Add section title
		const titleElement = document.createElement("h2");
		titleElement.className = "section-title mb-4";
		titleElement.innerHTML = `<i class="fas fa-book me-2"></i>${section.title}`;
		sectionElement.appendChild(titleElement);

		// Container for all section content
		const contentElement = document.createElement("div");
		contentElement.className = "section-content";

		// Add videos if available
		if (section.videos && section.videos.length > 0) {
			const videosContainer = document.createElement("div");
			videosContainer.className = "section-videos list-group mb-4";

			section.videos.forEach((video) => {
				// Check if video is completed
				const isCompleted = window.ProgressTracker.isVideoCompleted(
					course.id,
					video.id
				);

				// Create video item
				const videoItem = document.createElement("a");
				videoItem.href = "#";
				videoItem.className =
					"list-group-item list-group-item-action d-flex justify-content-between align-items-center";
				videoItem.id = "content-" + video.id;
				videoItem.innerHTML = `
                    <span>
                        <i class="fas fa-play-circle me-2 text-primary"></i>${
							video.title
						}
                        ${
							isCompleted
								? '<span class="badge bg-success ms-2"><i class="fas fa-check me-1"></i>Completed</span>'
								: ""
						}
                    </span>
                    <span class="badge bg-secondary"><i class="far fa-clock me-1"></i>${
						video.duration
					}</span>
                `;

				// Add click event to load video
				videoItem.addEventListener("click", function (e) {
					e.preventDefault();
					// Find the index of this element
					currentElementIndex = allContentElements.findIndex(
						(item) => item.id === video.id
					);
					loadVideo(course.id, video);
				});

				videosContainer.appendChild(videoItem);
			});

			contentElement.appendChild(videosContainer);
		}

		// Add quiz if available
		if (section.quiz) {
			const quizContainer = document.createElement("div");
			quizContainer.className = "section-quiz";

			const quizScore = window.ProgressTracker.getQuizScore(
				course.id,
				section.quiz.id
			);
			const isCompleted = quizScore !== null;

			const quizItem = document.createElement("a");
			quizItem.href = "#";
			quizItem.className =
				"list-group-item list-group-item-action d-flex justify-content-between align-items-center";
			quizItem.id = "content-" + section.quiz.id;
			quizItem.innerHTML = `
                <span>
                    <i class="fas fa-question-circle me-2 text-primary"></i>${
						section.quiz.title
					}
                    ${
						isCompleted
							? `<span class="badge bg-success ms-2"><i class="fas fa-award me-1"></i>Score: ${quizScore}%</span>`
							: ""
					}
                </span>
                <span class="badge bg-primary"><i class="fas fa-tasks me-1"></i>Quiz</span>
            `;

			// Add click event to load quiz
			quizItem.addEventListener("click", function (e) {
				e.preventDefault();
				// Find the index of this element
				currentElementIndex = allContentElements.findIndex(
					(item) => item.id === section.quiz.id
				);
				loadQuiz(course.id, section.quiz);
			});

			quizContainer.appendChild(quizItem);
			contentElement.appendChild(quizContainer);
		}

		sectionElement.appendChild(contentElement);
		contentContainer.appendChild(sectionElement);
	});
}

function loadVideo(courseId, video) {
	// Create modal to display video
	const modal = document.createElement("div");
	modal.className = "modal fade";
	modal.id = "videoModal";
	modal.setAttribute("tabindex", "-1");
	modal.setAttribute("aria-labelledby", "videoModalLabel");
	modal.setAttribute("aria-hidden", "true");

	// Determine if there's a next element
	const hasNextElement = currentElementIndex < allContentElements.length - 1;
	const nextElement = hasNextElement
		? allContentElements[currentElementIndex + 1]
		: null;

	// Prepare next button text
	const nextButtonText = nextElement
		? `<i class="fas fa-arrow-right me-2"></i>Next: ${nextElement.title}`
		: `<i class="fas fa-check-circle me-2"></i>Complete Course`;

	modal.innerHTML = `
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="videoModalLabel"><i class="fas fa-play-circle me-2"></i>${
						video.title
					}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="ratio ratio-16x9">
                        <iframe id="youtube-video"
                            src="https://www.youtube.com/embed/${
								video.videoId
							}?enablejsapi=1"
                            title="YouTube video player"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowfullscreen>
                        </iframe>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-success" id="mark-complete-btn">
                        <i class="fas fa-check-circle me-2"></i>Mark as Complete
                    </button>
                    ${
						hasNextElement
							? `<button type="button" class="btn btn-primary" id="next-content-btn">
                        ${nextButtonText}
                    </button>`
							: ""
					}
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                        <i class="fas fa-times me-2"></i>Close
                    </button>
                </div>
            </div>
        </div>
    `;

	document.body.appendChild(modal);

	// Initialize Bootstrap modal
	const modalInstance = new bootstrap.Modal(modal);
	modalInstance.show();

	// Initialize YouTube player
	let player;
	window.onYouTubeIframeAPIReady = function () {
		player = new YT.Player("youtube-video", {
			videoId: video.videoId,
			events: {
				onStateChange: onPlayerStateChange,
			},
		});
	};

	// If YouTube API is already loaded
	if (window.YT && window.YT.Player) {
		window.onYouTubeIframeAPIReady();
	}

	// Handle YouTube player state changes
	function onPlayerStateChange(event) {
		// When video ends (state = 0), automatically mark as complete
		if (event.data === 0) {
			console.log("Video ended - marking as complete");
			markVideoComplete();
		}
	}

	// Function to mark video as complete
	function markVideoComplete() {
		window.ProgressTracker.markVideoComplete(courseId, video.id);

		// Show completion message
		const successMessage = document.createElement("div");
		successMessage.className = "alert alert-success mt-3";
		successMessage.innerHTML =
			'<i class="fas fa-check-circle me-2"></i>Video completed! Moving to next content...';
		modal.querySelector(".modal-body").appendChild(successMessage);

		// Update progress display
		const progress = window.ProgressTracker.getCourseProgress(courseId);
		updateProgressDisplay(progress);

		// Update video list to show completed status
		const videoItem = document.getElementById("content-" + video.id);
		if (videoItem) {
			const statusSpan = videoItem.querySelector("span:first-child");
			if (statusSpan && !statusSpan.innerHTML.includes("Completed")) {
				statusSpan.innerHTML +=
					'<span class="badge bg-success ms-2"><i class="fas fa-check me-1"></i>Completed</span>';
			}
		}

		// If there's a next element, move to it after a short delay
		if (hasNextElement) {
			document.getElementById("next-content-btn").disabled = false;

			// Auto-navigate after 3 seconds
			setTimeout(() => {
				modalInstance.hide();
				navigateToNextContent();
			}, 3000);
		}
	}

	// Navigate to the next content element
	function navigateToNextContent() {
		if (hasNextElement) {
			currentElementIndex++;
			const nextItem = allContentElements[currentElementIndex];

			if (nextItem.type === "video") {
				loadVideo(courseId, nextItem.data);
			} else if (nextItem.type === "quiz") {
				modalInstance.hide();
				loadQuiz(courseId, nextItem.data);
			}
		}
	}

	// Handle marking video as complete manually
	document
		.getElementById("mark-complete-btn")
		.addEventListener("click", function () {
			markVideoComplete();
		});

	// Handle next button click
	if (hasNextElement) {
		document
			.getElementById("next-content-btn")
			.addEventListener("click", function () {
				modalInstance.hide();
				navigateToNextContent();
			});
	}

	// Clean up when modal is hidden
	modal.addEventListener("hidden.bs.modal", function () {
		document.body.removeChild(modal);
	});
}

function loadQuiz(courseId, quiz) {
	// Create div to hold quiz content
	const quizContainer = document.createElement("div");
	quizContainer.className = "quiz-container mt-4 p-4 bg-light rounded";

	// Determine if there's a next element
	const hasNextElement = currentElementIndex < allContentElements.length - 1;
	const nextElement = hasNextElement
		? allContentElements[currentElementIndex + 1]
		: null;

	// Prepare next button HTML
	const nextButtonHtml = hasNextElement
		? `<button id="next-content-btn" class="btn primary-btn ms-2">
            <i class="fas fa-arrow-right me-2"></i>Next: ${nextElement.title}
        </button>`
		: "";

	quizContainer.innerHTML = `
        <h3><i class="fas fa-question-circle me-2"></i>${quiz.title}</h3>
        <form id="quiz-form" class="mt-3">
            <!-- Questions will be inserted here -->
            <div class="quiz-questions"></div>
            <button type="submit" class="btn primary-btn mt-4">
                <i class="fas fa-paper-plane me-2"></i>Submit Answers
            </button>
        </form>
        <div id="quiz-results" class="mt-4 d-none">
            <div class="alert" role="alert"></div>
            <div class="mt-3">
                <button id="retake-quiz" class="btn secondary-btn">
                    <i class="fas fa-redo me-2"></i>Retake Quiz
                </button>
                ${nextButtonHtml}
            </div>
        </div>
    `;

	// Insert quiz into the page
	const contentDiv = document.getElementById("course-content");

	// Save original content to restore later
	const originalContent = contentDiv.innerHTML;
	contentDiv.innerHTML = "";
	contentDiv.appendChild(quizContainer);

	// Add a back button
	const backButton = document.createElement("button");
	backButton.className = "btn secondary-btn mt-3";
	backButton.innerHTML = `<i class="fas fa-arrow-left me-2"></i>Back to Course Content`;
	backButton.addEventListener("click", function () {
		contentDiv.innerHTML = originalContent;
	});
	contentDiv.appendChild(backButton);

	// Populate quiz questions
	const questionsContainer = document.querySelector(".quiz-questions");

	if (quiz.questions && quiz.questions.length > 0) {
		quiz.questions.forEach((question, index) => {
			const questionDiv = document.createElement("div");
			questionDiv.className = "mb-4";

			// Question text
			const questionText = document.createElement("p");
			questionText.className = "fw-bold mb-2";
			questionText.textContent = `${index + 1}. ${question.question}`;
			questionDiv.appendChild(questionText);

			// Options
			question.options.forEach((option, optIndex) => {
				const optionDiv = document.createElement("div");
				optionDiv.className = "form-check";

				const input = document.createElement("input");
				input.className = "form-check-input";
				input.type = "radio";
				input.name = `question-${index}`;
				input.id = `q${index}-option${optIndex}`;
				input.value = optIndex;

				const label = document.createElement("label");
				label.className = "form-check-label";
				label.htmlFor = `q${index}-option${optIndex}`;
				label.textContent = option;

				optionDiv.appendChild(input);
				optionDiv.appendChild(label);
				questionDiv.appendChild(optionDiv);
			});

			questionsContainer.appendChild(questionDiv);
		});

		// Handle form submission
		document
			.getElementById("quiz-form")
			.addEventListener("submit", function (e) {
				e.preventDefault();

				let correctAnswers = 0;

				// Check each answer
				quiz.questions.forEach((question, index) => {
					const selectedOption = document.querySelector(
						`input[name="question-${index}"]:checked`
					);

					if (
						selectedOption &&
						parseInt(selectedOption.value) ===
							question.correctAnswer
					) {
						correctAnswers++;
					}
				});

				// Calculate score
				const totalQuestions = quiz.questions.length;
				const score = Math.round(
					(correctAnswers / totalQuestions) * 100
				);

				// Save score
				window.ProgressTracker.saveQuizScore(courseId, quiz.id, score);

				// Display results
				const resultsDiv = document.getElementById("quiz-results");
				resultsDiv.classList.remove("d-none");

				const alertDiv = resultsDiv.querySelector(".alert");
				alertDiv.className =
					score >= 70 ? "alert alert-success" : "alert alert-warning";
				alertDiv.innerHTML = `
                <h4>${score >= 70 ? "Congratulations!" : "Nice try!"}</h4>
                <p>You scored ${score}% (${correctAnswers} out of ${totalQuestions} correct)</p>
                ${
					score >= 70
						? "<p>You've passed this quiz!</p>"
						: "<p>Keep learning and try again.</p>"
				}
            `;

				// Hide the form
				document.getElementById("quiz-form").classList.add("d-none");

				// Update progress display
				const progress =
					window.ProgressTracker.getCourseProgress(courseId);
				updateProgressDisplay(progress);

				// Update quiz list item to show completion
				const quizItem = document.getElementById("content-" + quiz.id);
				if (quizItem) {
					const statusSpan =
						quizItem.querySelector("span:first-child");
					if (statusSpan) {
						// Remove existing score badge if any
						const existingBadge =
							statusSpan.querySelector(".badge.bg-success");
						if (existingBadge) {
							existingBadge.remove();
						}

						// Add updated score badge
						statusSpan.innerHTML += `<span class="badge bg-success ms-2"><i class="fas fa-award me-1"></i>Score: ${score}%</span>`;
					}
				}

				// Next content navigation
				if (hasNextElement) {
					document
						.getElementById("next-content-btn")
						.addEventListener("click", function () {
							currentElementIndex++;
							const nextItem =
								allContentElements[currentElementIndex];

							if (nextItem.type === "video") {
								loadVideo(courseId, nextItem.data);
							} else if (nextItem.type === "quiz") {
								loadQuiz(courseId, nextItem.data);
							}
						});
				}
			});

		// Handle retaking the quiz
		document
			.getElementById("retake-quiz")
			.addEventListener("click", function () {
				document.getElementById("quiz-form").classList.remove("d-none");
				document.getElementById("quiz-results").classList.add("d-none");
				document.getElementById("quiz-form").reset();
			});
	} else {
		questionsContainer.innerHTML = `
            <div class="alert alert-warning">
                <i class="fas fa-exclamation-circle me-2"></i>No questions available for this quiz yet.
            </div>
        `;
	}
}
