/**
 * Course Data - Central repository for all course content
 */
const courses = [
	{
		id: "javascript-basics",
		title: "JavaScript Basics",
		description:
			"Learn the fundamentals of JavaScript programming language.",
		get image() {
			return window.getCorrectPath
				? window.getCorrectPath("./img/javascript.jpg")
				: "./img/javascript.jpg";
		},
		duration: "4 hours",
		sections: [
			{
				id: "section1",
				title: "Getting Started with JavaScript",
				videos: [
					{
						id: "video1",
						title: "Introduction to JavaScript",
						duration: "15:30",
						videoId: "PkZNo7MFNFg", // YouTube video ID
					},
					{
						id: "video2",
						title: "Variables and Data Types",
						duration: "20:45",
						videoId: "edlFjlzxkSI",
					},
				],
				quiz: {
					id: "quiz1",
					title: "JavaScript Basics Quiz",
					questions: [
						{
							question:
								"Which keyword is used to declare a variable in JavaScript?",
							options: ["var", "int", "string", "declare"],
							correctAnswer: 0,
						},
						{
							question:
								"What will console.log(typeof([])) output?",
							options: ["array", "object", "undefined", "null"],
							correctAnswer: 1,
						},
						{
							question:
								"Which operator is used for strict equality comparison?",
							options: ["==", "===", "=", "!="],
							correctAnswer: 1,
						},
					],
				},
			},
			{
				id: "section2",
				title: "JavaScript Functions",
				videos: [
					{
						id: "video3",
						title: "Function Declarations",
						duration: "18:20",
						videoId: "xUI5Tsl2JpY",
					},
					{
						id: "video4",
						title: "Arrow Functions",
						duration: "12:15",
						videoId: "h33Srr5J9nY",
					},
				],
			},
		],
	},
	{
		id: "html-css",
		title: "HTML & CSS Fundamentals",
		description: "Master the building blocks of web development.",
		get image() {
			return window.getCorrectPath
				? window.getCorrectPath("./img/html-css.jpg")
				: "./img/html-css.jpg";
		},
		duration: "3.5 hours",
		sections: [
			{
				id: "html-section1",
				title: "HTML Document Structure",
				videos: [
					{
						id: "html-video1",
						title: "HTML Basics",
						duration: "16:20",
						videoId: "UB1O30fR-EE",
					},
					{
						id: "html-video2",
						title: "HTML5 Semantic Elements",
						duration: "14:30",
						videoId: "kUMe1FH4CHE",
					},
				],
				quiz: {
					id: "html-quiz1",
					title: "HTML Basics Quiz",
					questions: [
						{
							question:
								"Which tag is used to define an HTML document?",
							options: [
								"<html>",
								"<body>",
								"<document>",
								"<web>",
							],
							correctAnswer: 0,
						},
						{
							question:
								"Which HTML element is used for the largest heading?",
							options: ["<head>", "<h6>", "<h1>", "<heading>"],
							correctAnswer: 2,
						},
						{
							question:
								"Which HTML attribute specifies an alternate text for an image?",
							options: ["alt", "src", "title", "href"],
							correctAnswer: 0,
						},
					],
				},
			},
		],
	},
	{
		id: "python-intro",
		title: "Introduction to Python",
		description: "Get started with Python programming language.",
		get image() {
			return window.getCorrectPath
				? window.getCorrectPath("./img/python.jpg")
				: "./img/python.jpg";
		},
		duration: "5 hours",
		sections: [
			{
				id: "python-section1",
				title: "Python Basics",
				videos: [
					{
						id: "python-video1",
						title: "Getting Started with Python",
						duration: "22:15",
						videoId: "_uQrJ0TkZlc",
					},
				],
				quiz: {
					id: "python-quiz1",
					title: "Python Basics Quiz",
					questions: [
						{
							question:
								"What symbol is used for comments in Python?",
							options: ["//", "/* */", "#", "--"],
							correctAnswer: 2,
						},
						{
							question:
								"Which of the following is not a Python data type?",
							options: ["str", "int", "char", "float"],
							correctAnswer: 2,
						},
					],
				},
			},
		],
	},
	{
		id: "web-frameworks",
		title: "Web Frameworks Overview",
		description:
			"Compare popular JavaScript frameworks like React, Vue, and Angular.",
		get image() {
			return window.getCorrectPath
				? window.getCorrectPath("./img/frameworks.jpg")
				: "./img/frameworks.jpg";
		},
		duration: "4.5 hours",
		sections: [
			{
				id: "frameworks-section1",
				title: "Introduction to Modern Frameworks",
				videos: [
					{
						id: "frameworks-video1",
						title: "Why Use a Framework?",
						duration: "10:30",
						videoId: "cuHDQhDhvPE",
					},
				],
			},
		],
	},
];

/**
 * Find a course by its ID
 * @param {string} courseId - The ID of the course to find
 * @returns {Object|null} The course object or null if not found
 */
function getCourseById(courseId) {
	return courses.find((course) => course.id === courseId) || null;
}

/**
 * Get the total number of videos in a course
 * @param {string} courseId - The ID of the course
 * @returns {number} The total number of videos
 */
function getTotalVideos(courseId) {
	const course = getCourseById(courseId);
	if (!course) return 0;

	return course.sections.reduce((total, section) => {
		return total + (section.videos ? section.videos.length : 0);
	}, 0);
}

/**
 * Get the total number of quizzes in a course
 * @param {string} courseId - The ID of the course
 * @returns {number} The total number of quizzes
 */
function getTotalQuizzes(courseId) {
	const course = getCourseById(courseId);
	if (!course) return 0;

	return course.sections.reduce((total, section) => {
		return total + (section.quiz ? 1 : 0);
	}, 0);
}

// Export the course data and utility functions
window.courseData = {
	courses,
	getCourseById,
	getTotalVideos,
	getTotalQuizzes,
};
