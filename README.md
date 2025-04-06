# eVidya Learning Platform

An interactive learning platform with courses, videos, and quizzes.

## Overview
The eVidya Platform is a web application designed to provide users with access to various technology courses. The platform features a clean blue and white theme, making it visually appealing and easy to navigate. Users can track their progress through courses, which include videos and quizzes.

## Project Structure
```
tech-courses-platform
├── index.html
├── css
│   ├── style.css
│   ├── courses.css
│   └── course-details.css
├── js
│   ├── main.js
│   ├── courses.js
│   ├── course-details.js
│   └── progress-tracker.js
├── pages
│   ├── courses.html
│   ├── dummy-course.html
│   └── functional-course.html
├── sections
│   ├── section1
│   │   ├── video1.html
│   │   ├── video2.html
│   │   └── quiz1.html
│   └── section2
│       ├── video3.html
│       └── video4.html
├── data
│   └── progress-data.js
└── README.md
```

## Features
- **Courses Page**: Displays a list of four static eVidya with progress tracking.
- **Progress Tracking**: Users can see metrics such as the number of videos watched, tests completed, grades, and marks.
- **Dummy Course**: A placeholder course with no interactive elements.
- **Functional Course**: A fully interactive course with two sections, four videos, and one quiz.

## Setup Instructions
1. Clone the repository to your local machine.
2. Open the `index.html` file in your web browser to access the application.
3. Click the button on the main page to navigate to the courses page.

## Technologies Used
- HTML
- CSS
- JavaScript

## Future Enhancements
- Implement user authentication to save progress across sessions.
- Add more courses and interactive elements.
- Improve the UI/UX based on user feedback.

## License
This project is open-source and available for modification and distribution.

---

# Summary of Changes to the eVidya Platform Project

Throughout our conversation, we've made several significant improvements to the eVidya eVidya platform. Here's a summary of the key changes:

### 1. Course Listing Page
- Created a responsive grid layout for displaying courses
- Added collapsible course details with a toggle feature
- Implemented course progress tracking with visual indicators
- Added quiz completion status badges
- Stored and retrieved course data from browser localStorage

### 2. Course Details Page
- Created a single functional course page that dynamically loads content based on the selected course
- Implemented YouTube video integration with proper loading states and error handling
- Added section titles that change based on the course topic
- Implemented a quiz system with automatic grading
- Added progress tracking for completed videos
- Created "Back to Courses" and "Reset Progress" buttons for navigation

### 3. Data Management
- Developed a `StorageManager` utility for handling localStorage operations
- Created a central `course-data.js` file for managing course content
- Implemented functions to track video completion and quiz grades
- Added data persistence between sessions using browser cache

### 4. Video Player Integration
- Replaced basic HTML5 video with YouTube embeds
- Added YouTube API integration for tracking video completion
- Implemented error handling for video loading issues
- Added loading states and placeholders during video loading
- Fixed infinite loading issues with proper iframe handling

### 5. UI/UX Improvements
- Added visual feedback for course completion
- Implemented responsive design for various screen sizes
- Added badges to show completed items
- Created collapsible sections for better information hierarchy
- Improved button styling and interaction states

### 6. Quiz System
- Created a dynamic quiz system that loads questions from course data
- Implemented quiz results display and storage
- Added ability to retake quizzes
- Created proper quiz result display with completion status

### 7. Performance Optimizations
- Forced medium quality YouTube videos for better loading
- Improved error handling and user feedback
- Optimized loading states to prevent duplicate content

### 8. Navigation
- Established navigation between course listing and course details pages
- Added a landing page with a clear call-to-action to view courses

These improvements transformed the platform from a basic prototype into a functional learning management system with persistent data storage, course progress tracking, and a robust video and quiz system - all while maintaining a clean, user-friendly interface.

## Developer Guidelines

### Getting Started
1. This project uses vanilla JavaScript without any build tools, making it easy to get started
2. Simply clone the repository and open index.html in a browser to begin development
3. All course data is managed through the `js/course-data.js` file

### Code Structure
- **storage.js**: Handles all localStorage operations through the StorageManager class
- **progress-tracker.js**: Manages user progress through courses and quizzes
- **course-data.js**: Contains all course content definitions
- **courses.js**: Controls the courses listing page functionality
- **course-details.js**: Manages the individual course page interactions

### Adding New Courses
To add a new course:
1. Add the course definition to `course-data.js`
2. Create corresponding section and video files in the sections directory
3. Update any quiz content in the course definition

### Testing
Before submitting changes:
1. Test course progress tracking by completing videos and quizzes
2. Verify that progress is correctly saved between browser sessions
3. Test the responsive design on multiple screen sizes

## GitHub Pages Deployment

This project is configured to be deployed to GitHub Pages. The site is entirely static and uses the browser's localStorage to store and retrieve course data.

### How to Deploy

1. Push your code to the main branch of your GitHub repository
2. GitHub Actions will automatically deploy your site to GitHub Pages
3. Your site will be available at `https://Life-Experimentalist.github.io/eVidya/`

### Local Development

To run this project locally:

1. Clone the repository
2. Open index.html in your browser or use a local server
3. All data will be stored in your browser's localStorage

### Maintaining GitHub Pages Compatibility

1. Keep all paths relative (never use absolute paths starting with /)
2. All JS/CSS references should use relative paths (e.g., "../js/main.js" not "/js/main.js")
3. If using subfolders for courses, create index.html files in each subfolder to enable navigation
4. Ensure any API calls use HTTPS instead of HTTP
5. Image and video paths should be relative to the HTML files that reference them

Remember that GitHub Pages serves content from either the root directory or the /docs folder of your main branch.
