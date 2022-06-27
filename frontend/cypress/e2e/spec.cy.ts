const openPage = (page) => {
  cy.get('#navbar').contains(page).click();
  wait();
}
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
    beforeEach(() => {
      cy.visit('http://localhost:3000');
      login();
    })
    it('Strict accent mode can be set', () => {
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

    it('Wordlist adding works', () => {
      cy.get('#wordlistnamefield').type('wordlist1');
      cy.contains('Create').click();
      wait();
      cy.contains('Add words to wordlist: wordlist1');
      cy.contains('User page').click();
      wait();
      cy.contains('Create');
      cy.contains('wordlist1');
      wait();
    });

    it('Can add words to wordlist', () => {
      wait();
      cy.get('#wordlists').contains('wordlist1').click();
      wait();
      cy.get('#wordselectfield').type('a');
      wait();
      cy.contains('aceptar').click();
      wait();
      cy.get('#addwordbutton').contains('Add').click();
      wait();
      cy.get('#words').contains('aceptar');
      cy.get('#navbar').contains('User page').click();
      wait();
      cy.get('#wordlists').contains('wordlist1').click();
      wait();
      cy.get('#words').contains('aceptar');

    });

    it('Can delete words from wordlist', () => {
      cy.get('#wordlists').contains('wordlist1').click();
      wait();
      cy.get('#words').contains('aceptar').get('#deleteicon').click();
      wait();
      cy.get('#words').should('not.exist');
      cy.get('#navbar').contains('User page').click();
      wait();
      cy.get('#wordlists').contains('wordlist1').click();
      wait();
      cy.get('#words').should('not.exist');
    });

    it('Can delete wordlist', () => {
      cy.get('#wordlists').contains('wordlist1').click();
      wait();
      cy.get('#deletewordlistbutton').click();
      wait();
      cy.get('#wordlists').contains('wordlist1').should('not.exist');
    })

    it('Can change password', () => {
      const changePass = (oldpass: string, newpass: string) => {
        cy.contains('Change password').click();
        wait();
        cy.get('#currentpasswordfield').type(oldpass);
        cy.get('#newpasswordfield1').type(newpass);
        cy.get('#newpasswordfield2').type(newpass);
        cy.get('#changepasswordbutton').click();
        wait();
        cy.get('#toast-default').click();
        wait();
        cy.contains('Close').click();
        wait();
      };
      changePass('testpass', 'newtestpass');
      logout();
      cy.get('#navbar').contains('Login').click();
      wait();
      cy.get('#usernamefield').type('testuser');
      cy.get('#passwordfield').type('newtestpass');
      cy.get('#loginbutton').click();
      wait();
      changePass('newtestpass', 'testpass');
      wait();
    });

    it('Can delete account', () => {
      cy.contains('Delete all user data').click();
      wait();
      cy.get('#navbar').contains('Login').click();
      wait();
      cy.get('#usernamefield').type('testuser');
      cy.get('#passwordfield').type('testpass');
      cy.get('#loginbutton').click();
      wait();
      cy.contains('Logged in as').should('not.exist');
      createUser();
    });

  });

  describe('Single conjugation works', () => {
    beforeEach(() => {
      openPage('Conjugate');
    });

    it('Correct answer works', () => {
      cy.get('body').then(($body) => {
        let word = "";
        
      });
    });
  });



});

export { };