/**
 * Cypress configuration file using CommonJS (CJS) syntax to avoid 'import' errors.
 * This file is created in the root of the project to configure E2E testing.
 */
const { defineConfig } = require('cypress');

module.exports = defineConfig({
  // The viewport size used for tests
  viewportWidth: 1280,
  viewportHeight: 720,
  
  e2e: {
    // *** IMPORTANT: REPLACE THIS URL with your actual deployed Render Frontend URL ***
    baseUrl: 'http://localhost:3000', // e.g., 'https://your-app.onrender.com'
    
    // Path to the E2E test files
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    
    setupNodeEvents(on, config) {
      // Add node event listeners here if needed (e.g., for logging)
    },
  },
});