

const login = () => {
  cy.get('#navbar').contains('Login').click();
  cy.wait(500);
  cy.get('#usernamefield').type('testuser');
  cy.get('#passwordfield').type('testpass');
  cy.get('#loginbutton').click();
};

const logout = () => {
  cy.get('#navbar').contains('Logout').click();
  cy.wait(500);
};


describe('taivuttaja-app', () => {

  it('Backend is running', () => {
    cy.visit('http://localhost:3001/health');
  });

  it('Frontend is running', () => {
    cy.visit('http://localhost:3000');
  });

  
  context('when unlogged', () => {
    it('Conjugate-page opens and does not have wordlist form', () => {
      cy.get('#navbar').contains('Conjugate').click();
      cy.wait(500);
      cy.contains('Begin by choosing mode!');
      cy.contains('Select wordlist').should('not.exist');
    });
    it('Vocab-page opens', () => {
      cy.get('#navbar').contains('Vocab').click();
      cy.wait(500);
      cy.contains('Try');
    });
    it('Login page opens', () => {
      cy.get('#navbar').contains('Login').click();
      cy.wait(500);
      cy.contains('Create new user');
    });
    it('Home page opens', () => {
      cy.get('#navbar').contains('Home').click();
      cy.wait(500);
      cy.contains('Welcome to the conjugation app!');
    });
  });

  context('when logged in', () => {

    it('Conjugate-page opens and contains wordlist form', () => {
      login();
      cy.wait(500);
      cy.get('#navbar').contains('Conjugate').click();
      cy.wait(500);
      cy.contains('Select wordlist');
    });
    it('User page opens', () => {
      cy.get('#navbar').contains('User page').click();
      cy.wait(500);
      cy.contains('Strict accents mode');
    });

    it('Logging out works', () => {
      logout();
      cy.contains('Logged in as').should('not.exist');
    });

  });

  context('when on user page', () => {
    // daily goal can be set -test not done, have to figure out how to work with sliders

    it('Strict accent mode can be set', () => {
      login();
      cy.wait(300);
      cy.get('#strictaccentmode').click({force: true});
      cy.wait(300);
      logout();
      login();
      cy.contains('On');
    });

    it('Practice history works', () => {
      cy.contains("View practice history").click();
      cy.wait(300);
      cy.contains("conjugated a verb");
      cy.contains("Close").click();

    });

  });

});

export {};