
const login = () => {
  cy.get('#navbar').contains('Login').click();
  cy.wait(500);
  cy.get('#usernamefield').type('testuser');
  cy.get('#passwordfield').type('testpass');
  cy.get('#loginbutton').click();
};


describe('taivuttaja-app', () => {
  it('is running', () => {
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
    
  });

});

export {};