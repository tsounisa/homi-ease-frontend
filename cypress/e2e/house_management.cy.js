describe('Flow 1: Successful House Creation', () => {

  const MOCK_USER = 'user@example.com'; 
  const MOCK_PASS = 'password123';
  const NEW_HOUSE_NAME = 'My Test Summer Home';

  it('Successfully logs in and creates a new house', () => {
    
    // 1. Intercept API calls
    cy.intercept('POST', '**/auth/login').as('loginCall');
    cy.intercept('POST', '**/houses').as('createHouseCall');
    
    // 2. Visit Page
    cy.visit('/login'); 
    
    // 3. Login
    cy.get('[data-cy="email-input"]').type(MOCK_USER);
    cy.get('[data-cy="password-input"]').type(MOCK_PASS);
    cy.get('[data-cy="login-button"]').click();

    // 4. Verify Login
    cy.wait('@loginCall').its('response.statusCode').should('eq', 200); 
    cy.url().should('include', '/dashboard'); 

    // --- PART 2: HOUSE CREATION ---
    
    // Click the "Add House/Room" button using the data-cy attribute we added
    cy.get('[data-cy="add-house-button"]').click(); 

    // Expect the URL to be what your app actually uses (/add-house-room)
    cy.url().should('include', '/add-house-room'); 
    
    // --- FILL THE FORM ---
    // If this fails, add data-cy="house-name-input" to your input field in AddHouseRoomPage.jsx
    // using .first() ensures we type in the first input found (House Name)
    cy.get('input[type="text"]').first().type(NEW_HOUSE_NAME);
    
    // FIX: Use .first() to click the FIRST submit button found (The "Add House" button)
    // This resolves the "subject contained 2 elements" error.
    cy.get('button[type="submit"]').first().click();

    // Verify Success
    cy.wait('@createHouseCall').its('response.statusCode').should('eq', 201); 
    cy.url().should('include', '/dashboard');
    cy.contains(NEW_HOUSE_NAME).should('be.visible');
  });
});