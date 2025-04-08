/**
 * Utility for interacting with Google's Gemini API
 * Provides functions for generating AI responses
 */

// Gemini API class
class GeminiAI {
	constructor(apiKey = null) {
		this.apiKey = apiKey || config?.gemini?.getApiKey();
		this.apiEndpoint =
			"https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";
	}

	/**
	 * Set API key
	 * @param {string} apiKey - The Gemini API key
	 */
	setApiKey(apiKey) {
		this.apiKey = apiKey;
	}

	/**
	 * Check if the API key is set
	 * @returns {boolean} - Whether the API key is configured
	 */
	isConfigured() {
		return !!this.apiKey && this.apiKey.trim() !== "";
	}

	/**
	 * Generate a response from Gemini
	 * @param {string} prompt - The user question or prompt
	 * @param {Object} options - Additional options for the request
	 * @returns {Promise<Object>} - The response from Gemini
	 */
	async generateResponse(prompt, options = {}) {
		if (!this.isConfigured()) {
			throw new Error(
				"Gemini API key not configured. Please set your API key in Settings."
			);
		}

		try {
			// Prepare request body
			const requestBody = {
				contents: [
					{
						parts: [
							{
								text: prompt,
							},
						],
					},
				],
				generationConfig: {
					temperature: options.temperature || 0.7,
					topK: options.topK || 40,
					topP: options.topP || 0.95,
					maxOutputTokens: options.maxTokens || 1024,
				},
			};

			// Add course context if provided
			if (options.courseContext) {
				requestBody.contents[0].parts.unshift({
					text: `Context information about the course: ${options.courseContext}`,
				});
			}

			// Add course material if provided
			if (options.courseMaterial) {
				requestBody.contents[0].parts.unshift({
					text: `Course material for reference: ${options.courseMaterial}`,
				});
			}

			// Make request to Gemini API
			const response = await fetch(
				`${this.apiEndpoint}?key=${this.apiKey}`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(requestBody),
				}
			);

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(
					`Gemini API error: ${
						errorData.error?.message || response.statusText
					}`
				);
			}

			const data = await response.json();
			return {
				text:
					data.candidates[0]?.content?.parts[0]?.text ||
					"No response generated.",
				rawResponse: data,
			};
		} catch (error) {
			console.error("Error calling Gemini API:", error);
			throw error;
		}
	}

	/**
	 * Answer a course-related question
	 * @param {string} question - The user's question
	 * @param {Object} courseData - Information about the course
	 * @returns {Promise<string>} - The answer to the question
	 */
	async answerCourseQuestion(question, courseData) {
		try {
			// Prepare context from course data
			const courseContext = `
                Course title: ${courseData.title}
                Subject: ${courseData.subject}
                Level: ${courseData.level}
                Description: ${courseData.description}
            `;

			// Get relevant course material if available
			const courseMaterial = courseData.content || "";

			const response = await this.generateResponse(question, {
				courseContext,
				courseMaterial,
				temperature: 0.3, // Lower temperature for more accurate/factual responses
			});

			return response.text;
		} catch (error) {
			return `Error answering your question: ${error.message}`;
		}
	}
}

// Create and export a global instance
const geminiAI = new GeminiAI();

// For module systems
if (typeof module !== "undefined" && module.exports) {
	module.exports = { GeminiAI, geminiAI };
}
