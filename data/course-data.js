/**
 * course-data.js
 * Contains the data for all courses in the platform
 */

const courses = [
	{
		id: 1,
		title: "Functional Programming",
		description:
			"Learn the core concepts of functional programming and how to apply them in JavaScript",
		image: "../images/course-functional.jpg",
		duration: "4 hours",
		level: "Intermediate",
		sections: [
			{
				title: "Introduction to Functional Programming",
				videos: [
					{
						id: "video1",
						title: "What is Functional Programming?",
						url: "https://www.youtube.com/embed/e-5obm1G_FY",
					},
					{
						id: "video2",
						title: "Pure Functions and Side Effects",
						url: "https://www.youtube.com/embed/FYXpOjwYzcs",
					},
				],
				quiz: {
					id: "quiz1",
					title: "Functional Programming Basics",
					questions: [
						{
							question: "What is a pure function?",
							options: [
								"A function that always returns the same output for same inputs with no side effects",
								"A function that uses only primitive data types",
								"A function that is written in a purely functional language",
								"A function that doesn't throw exceptions",
							],
							answer: 0,
						},
						{
							question:
								"Which of these is a key principle of functional programming?",
							options: [
								"Object mutation",
								"Inheritance",
								"Immutability",
								"Polymorphism",
							],
							answer: 2,
						},
						{
							question: "What is a side effect in programming?",
							options: [
								"When a function takes too long to execute",
								"When a function modifies state outside its local scope",
								"When a function returns an unexpected value",
								"When a function has optional parameters",
							],
							answer: 1,
						},
					],
				},
			},
			{
				title: "Functional Programming in JavaScript",
				videos: [
					{
						id: "video3",
						title: "Higher-Order Functions",
						url: "https://www.youtube.com/embed/BMUiFMZr7vk",
					},
					{
						id: "video4",
						title: "Map, Filter, and Reduce",
						url: "https://www.youtube.com/embed/rRgD1yVwIvE",
					},
				],
				quiz: {
					id: "quiz2",
					title: "JavaScript Functional Programming",
					questions: [
						{
							question: "What is a higher-order function?",
							options: [
								"A function that takes more than 3 parameters",
								"A function that returns a boolean value",
								"A function that takes a function as an argument or returns a function",
								"A function declared at the top level of a module",
							],
							answer: 2,
						},
						{
							question:
								"Which array method does NOT return a new array?",
							options: [
								"map()",
								"filter()",
								"forEach()",
								"concat()",
							],
							answer: 2,
						},
					],
				},
			},
		],
	},
	{
		id: 2,
		title: "Web Development Fundamentals",
		description:
			"Build a strong foundation in HTML, CSS, and JavaScript with practical examples",
		image: "../images/course-web.jpg",
		duration: "6 hours",
		level: "Beginner",
		sections: [
			{
				title: "HTML Basics",
				videos: [
					{
						id: "video1",
						title: "HTML Document Structure",
						url: "https://www.youtube.com/embed/UB1O30fR-EE",
					},
					{
						id: "video2",
						title: "HTML Forms and Input Elements",
						url: "https://www.youtube.com/embed/fNcJuPIZ2WE",
					},
				],
				quiz: {
					id: "quiz1",
					title: "HTML Fundamentals Quiz",
					questions: [
						{
							question:
								"Which tag is used to define an HTML document?",
							options: [
								"<html>",
								"<body>",
								"<document>",
								"<head>",
							],
							answer: 0,
						},
						{
							question:
								"Which attribute is used to specify a unique id for an HTML element?",
							options: ["class", "id", "name", "rel"],
							answer: 1,
						},
					],
				},
			},
			{
				title: "CSS Styling",
				videos: [
					{
						id: "video3",
						title: "CSS Selectors and Properties",
						url: "https://www.youtube.com/embed/1PnVor36_40",
					},
					{
						id: "video4",
						title: "CSS Layout and Flexbox",
						url: "https://www.youtube.com/embed/JJSoEo8JSnc",
					},
				],
				quiz: {
					id: "quiz2",
					title: "CSS Knowledge Check",
					questions: [
						{
							question:
								"Which CSS property is used to change the text color of an element?",
							options: [
								"color",
								"text-color",
								"font-color",
								"text-style",
							],
							answer: 0,
						},
						{
							question:
								"What is the correct CSS syntax for making all paragraphs bold?",
							options: [
								"p {text-weight: bold;}",
								"p {font-weight: bold;}",
								"<p style='font-weight: bold;'>",
								"All paragraphs {font-weight: bold;}",
							],
							answer: 1,
						},
					],
				},
			},
		],
	},
	{
		id: 3,
		title: "Data Structures and Algorithms",
		description:
			"Master the fundamental data structures and algorithms essential for efficient programming",
		image: "../images/course-dsa.jpg",
		duration: "8 hours",
		level: "Advanced",
		sections: [
			{
				title: "Basic Data Structures",
				videos: [
					{
						id: "video1",
						title: "Arrays and Linked Lists",
						url: "https://www.youtube.com/embed/zg9ih6SVACc",
					},
					{
						id: "video2",
						title: "Stacks and Queues",
						url: "https://www.youtube.com/embed/wjI1WNcIntg",
					},
				],
				quiz: {
					id: "quiz1",
					title: "Data Structures Fundamentals",
					questions: [
						{
							question:
								"What is the time complexity for accessing an element in an array?",
							options: ["O(1)", "O(n)", "O(log n)", "O(n²)"],
							answer: 0,
						},
						{
							question:
								"Which data structure operates on LIFO (Last In First Out) principle?",
							options: ["Queue", "Stack", "Linked List", "Tree"],
							answer: 1,
						},
					],
				},
			},
			{
				title: "Basic Algorithms",
				videos: [
					{
						id: "video3",
						title: "Sorting Algorithms",
						url: "https://www.youtube.com/embed/kPRA0W1kECg",
					},
					{
						id: "video4",
						title: "Searching Algorithms",
						url: "https://www.youtube.com/embed/MFhxShGxHWc",
					},
				],
				quiz: {
					id: "quiz2",
					title: "Algorithm Analysis",
					questions: [
						{
							question:
								"What is the time complexity of bubble sort in worst case?",
							options: [
								"O(n)",
								"O(n log n)",
								"O(n²)",
								"O(log n)",
							],
							answer: 2,
						},
						{
							question:
								"Which search algorithm requires a sorted array?",
							options: [
								"Linear search",
								"Binary search",
								"Depth-first search",
								"Breadth-first search",
							],
							answer: 1,
						},
					],
				},
			},
		],
	},
	{
		id: 4,
		title: "React Fundamentals",
		description:
			"Learn how to build modern web applications with React and related technologies",
		image: "../images/course-react.jpg",
		duration: "7 hours",
		level: "Intermediate",
		sections: [
			{
				title: "React Basics",
				videos: [
					{
						id: "video1",
						title: "Introduction to React",
						url: "https://www.youtube.com/embed/Tn6-PIqc4UM",
					},
					{
						id: "video2",
						title: "Components and Props",
						url: "https://www.youtube.com/embed/FdiRj-_VTVU",
					},
				],
				quiz: {
					id: "quiz1",
					title: "React Core Concepts",
					questions: [
						{
							question: "What is JSX in React?",
							options: [
								"A database query language",
								"A syntax extension to JavaScript that looks like HTML",
								"A JavaScript testing framework",
								"A state management library",
							],
							answer: 1,
						},
						{
							question: "What are props in React?",
							options: [
								"Internal data storage",
								"HTML elements",
								"Properties passed to components",
								"CSS styling settings",
							],
							answer: 2,
						},
					],
				},
			},
			{
				title: "React State and Hooks",
				videos: [
					{
						id: "video3",
						title: "Managing State with Hooks",
						url: "https://www.youtube.com/embed/O6P86uwfdR0",
					},
					{
						id: "video4",
						title: "Effect Hook and Lifecycle",
						url: "https://www.youtube.com/embed/0ZJgIjIuY7U",
					},
				],
				quiz: {
					id: "quiz2",
					title: "React Hooks Quiz",
					questions: [
						{
							question:
								"Which hook is used to add state to a functional component?",
							options: [
								"useEffect",
								"useState",
								"useContext",
								"useReducer",
							],
							answer: 1,
						},
						{
							question: "What is the purpose of useEffect hook?",
							options: [
								"To manage component state",
								"To optimize rendering performance",
								"To perform side effects in components",
								"To create new components dynamically",
							],
							answer: 2,
						},
					],
				},
			},
		],
	},
];

// Make courses available globally
window.courses = courses;
