// This test covers the successful login and the creation of a new House (Happy Path 1).

describe('Flow 1: Successful House Creation', () => {

  // Setup mock user credentials here (or use env variables)
  const MOCK_USER = 'user@example.com'; 
  const MOCK_PASS = 'password123';
  const NEW_HOUSE_NAME = 'My Test Summer Home';

  it('Successfully logs in and creates a new house', () => {
    
    // 1. Intercept API calls for reliable testing
    // Alias the API call based on your Swagger file POST /auth/login
    cy.intercept('POST', '/api/v1/auth/login').as('loginApiCall');
    cy.intercept('POST', '/api/v1/houses').as('createHouseApiCall');
    
    // --- Step 1: Login (Covers Screen 1: Login Page) ---
    cy.visit('/login'); 
    
    // Use the specific data-cy attributes from the updated LoginPage.jsx
    cy.get('[data-cy="email-input"]').type(MOCK_USER);
    cy.get('[data-cy="password-input"]').type(MOCK_PASS);
    cy.get('[data-cy="login-button"]').click();

    // Verify successful API call and redirection to Dashboard
    cy.wait('@loginApiCall').its('response.statusCode').should('eq', 200); 
    cy.url().should('include', '/dashboard'); // Assuming dashboard is Screen 2

    // --- Step 2: Navigate to House Creation ---
    // Selector for 'add-house-button' needs to be present on your DashboardPage.jsx
    cy.get('[data-cy="add-house-button"]').click(); 

    // Assuming House Creation page is /houses/new (Screen 3)
    cy.url().should('include', '/houses/new'); 

    // --- Step 3: Create the House (POST /houses) ---
    // Selectors for house form need to be present on AddHouseRoomPage.jsx
    cy.get('[data-cy="house-name-input"]').type(NEW_HOUSE_NAME);
    cy.get('[data-cy="submit-house-button"]').click();

    // Verify successful API call (POST /houses)
    cy.wait('@createHouseApiCall').its('response.statusCode').should('eq', 201); 

    // --- Step 4: Verification (Covers Screen 4: Dashboard/House List) ---
    cy.url().should('include', '/dashboard'); // Should redirect back to dashboard
    // Selector for the house list needs to be present on your DashboardPage.jsx
    cy.get('[data-cy="house-list"]').should('contain', NEW_HOUSE_NAME);
    
  });
});