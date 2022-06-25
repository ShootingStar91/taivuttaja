
const login = () => {
  cy.get('#navbar').contains('Login').click();
  wait();
  cy.get('#usernamefield').type('testuser');
  cy.get('#passwordfield').type('testpass');
  cy.get('#loginbutton').click();
  wait();
};
const deleteUsers = () => {
  cy.request('http://localhost:3001/api/test/deleteall');
  wait();
};

const createUser = () => {
  cy.get('#navbar').contains('Login').click();
  wait();
  cy.get('#usernamefield').type('testuser');
  cy.get('#passwordfield').type('testpass');
  cy.contains('Create new user').click();
  wait();
}

const logout = () => {
  cy.get('#navbar').contains('Logout').click();
  wait();
};


const wait = () => {
  cy.wait(300);
}

describe('taivuttaja-app', () => {



  it('Backend is running', () => {
    deleteUsers();
  });

  it('Frontend is running', () => {
    cy.visit('http://localhost:3000');
  });



  context('when unlogged', () => {
    it('Conjugate-page opens and does not have wordlist form', () => {
      cy.get('#navbar').contains('Conjugate').click();
      wait();
      cy.contains('Begin by choosing mode!');
      cy.contains('Select wordlist').should('not.exist');
    });
    it('Vocab-page opens', () => {
      cy.get('#navbar').contains('Vocab').click();
      wait();
      cy.contains('Try');
    });
    it('Home page opens', () => {
      cy.get('#navbar').contains('Home').click();
      wait();
      cy.contains('Welcome to the conjugation app!');
    });
    it('User creation works', () => {
      createUser();
      wait();
      cy.contains('Strict accents mode');
    });
  });

  context('when logged in', () => {
    before(() => {
      logout();

      login();
    })

    it('Conjugate-page opens and contains wordlist form', () => {
      cy.get('#navbar').contains('Conjugate').click();
      wait();
      cy.contains('Select wordlist');
    });
    it('User page opens', () => {
      cy.get('#navbar').contains('User page').click();
      wait();
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
      wait();
      cy.get('#strictaccentmode').click({ force: true });
      wait();
      logout();
      login();
      cy.contains('On');
    });

    it('Practice history works', () => {
      cy.contains("View practice history").click();
      wait();
      cy.contains("conjugated a verb");
      cy.contains("Close").click({ force: true });

    });

  });

});

export { };