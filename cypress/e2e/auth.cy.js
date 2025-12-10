/// <reference types="cypress" />

describe('Homease User Flows', () => {
  /**
   * Spec 1: Happy Path - Resource Creation & Display
   * Covers: AddHouseRoomPage, DashboardPage
   */
  it('should allow a user to create a new house and see it on the dashboard', () => {
    const newHouseName = 'My New Test House';

    // --- Mocks & Intercepts ---
    cy.intercept('GET', '/api/v1/users/me', { statusCode: 200, body: { data: { id: 1, name: 'Test User' } } }).as('getMe');
    cy.intercept('POST', '/api/v1/houses', { statusCode: 201, body: { data: { _id: '123', name: newHouseName } } }).as('postHouse');
    cy.intercept('GET', '/api/v1/houses', { statusCode: 200, body: { data: [{ _id: '123', name: newHouseName }] } }).as('getHouses');

    // --- Action Flow ---
    cy.window().then((win) => win.localStorage.setItem('token', 'fake-jwt-token'));
    cy.visit('/add-house-room');
    cy.wait('@getMe');

    cy.contains('h3', 'Add New House').parent().within(() => {
      cy.get('input[type="text"]').type(newHouseName);
      cy.contains('button', 'Add House').click();
    });
    cy.wait('@postHouse');

    // --- Assertions ---
    cy.visit('/dashboard');
    cy.wait('@getHouses');
    cy.contains('li', newHouseName).should('be.visible');
  });

  /**
   * Spec 2: Happy Path - Interact with a Device
   * Covers: LightingControlPage
   */
  it('should allow a user to toggle a light on', () => {
    const house = { _id: 'house1', name: 'My Home' };
    const room = { _id: 'room1', name: 'Living Room' };
    const light = { _id: 'light1', name: 'Ceiling Light', type: 'light', status: { isOn: false, brightness: 50 } };
    const updatedLight = { ...light, status: { ...light.status, isOn: true } };

    // Use a counter to provide different mock responses
    let getDevicesCallCount = 0;

    // --- Mocks & Intercepts ---
    cy.intercept('GET', '/api/v1/users/me', { statusCode: 200, body: { data: { id: 1, name: 'Test User' } } }).as('getMe');
    cy.intercept('GET', '/api/v1/houses', { statusCode: 200, body: { data: [house] } }).as('getHouses');
    cy.intercept('GET', `/api/v1/houses/${house._id}/rooms`, { statusCode: 200, body: { data: [room] } }).as('getRooms');
    cy.intercept('GET', `/api/v1/rooms/${room._id}/devices`, (req) => {
      getDevicesCallCount++;
      if (getDevicesCallCount === 1) {
        // On the first call, the light is off
        req.reply({ statusCode: 200, body: { data: [light] } });
      } else {
        // On the second call (after the toggle), it's on
        req.reply({ statusCode: 200, body: { data: [updatedLight] } });
      }
    }).as('getDevices');
    cy.intercept('POST', `/api/v1/devices/${light._id}/action`, { statusCode: 200, body: { data: {} } }).as('controlDevice');

    // --- Action Flow ---
    cy.window().then((win) => win.localStorage.setItem('token', 'fake-jwt-token'));
    cy.visit('/lighting');
    cy.wait(['@getMe', '@getHouses']);

    cy.get('select').first().select(house.name);
    cy.wait('@getRooms');
    cy.get('select').eq(1).select(room.name);
    cy.wait('@getDevices'); // First call to getDevices
    
    // --- Assertions ---
    cy.contains('h4', light.name).parent().as('lightControl');
    cy.get('@lightControl').contains('p', 'Status: Off').should('be.visible');

    cy.get('@lightControl').contains('button', 'Turn On').click();
    
    cy.wait(['@controlDevice', '@getDevices']); // Second call to getDevices
    cy.get('@lightControl').contains('p', 'Status: On').should('be.visible');
  });

  /**
   * Spec 3: Unhappy Path - Invalid Login Failure
   * Covers: LoginPage
   */
  it('should display an error message on failed login', () => {
    cy.intercept('POST', '/api/v1/auth/login', {
      statusCode: 401,
      body: { message: 'Invalid credentials' },
    }).as('failedLoginRequest');

    cy.visit('/login');
    cy.get('#email').type('wrong@example.com');
    cy.get('#password').type('wrongpassword');
    cy.get('button[type="submit"]').click();
    cy.wait('@failedLoginRequest');

    cy.get('.error-message')
      .should('be.visible')
      .and('contain', 'Failed to login. Please check your credentials.');
    cy.url().should('include', '/login');
  });
});
