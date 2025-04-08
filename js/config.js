/**
 * Configuration file for eVidya
 * This handles environment variables and API keys
 */

// Environment variables configuration
const config = {
    // Unsplash API configuration
    unsplash: {
        // Use environment variable in production, fallback for development
        accessKey: process.env.UNSPLASH_ACCESS_KEY || 'YOUR_DEVELOPMENT_KEY'
    }
};

// Export the configuration
if (typeof module !== 'undefined' && module.exports) {
    module.exports = config;
}
