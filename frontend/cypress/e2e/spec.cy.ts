const words = [{
  "infinitive": "inventar",
  "infinitive_english": "to invent",
  "mood": "Indicativo",
  "mood_english": "Indicative",
  "tense": "Presente",
  "tense_english": "Present",
  "verb_english": "I invent, am inventing",
  "form_1s": "invento",
  "form_2s": "inventas",
  "form_3s": "inventa",
  "form_1p": "inventamos",
  "form_2p": "inventáis",
  "form_3p": "inventan",
  "gerund": "inventando",
  "gerund_english": "inventing",
  "pastparticiple": "inventado",
  "pastparticiple_english": "invented"
},
{
  "infinitive": "despertarse",
  "infinitive_english": "to wake up, lie down",
  "mood": "Indicativo",
  "mood_english": "Indicative",
  "tense": "Presente",
  "tense_english": "Present",
  "verb_english": "I wake up, am waking up",
  "form_1s": "me despierto",
  "form_2s": "te despiertas",
  "form_3s": "se despierta",
  "form_1p": "nos despertamos",
  "form_2p": "os despertáis",
  "form_3p": "se despiertan",
  "gerund": "despertándose",
  "gerund_english": "waking up",
  "pastparticiple": "despertado",
  "pastparticiple_english": "waken up"
},
{
  "infinitive": "lamentar",
  "infinitive_english": "to lament, regret, feel sorry about",
  "mood": "Indicativo",
  "mood_english": "Indicative",
  "tense": "Presente",
  "tense_english": "Present",
  "verb_english": "I lament, am lamenting",
  "form_1s": "lamento",
  "form_2s": "lamentas",
  "form_3s": "lamenta",
  "form_1p": "lamentamos",
  "form_2p": "lamentáis",
  "form_3p": "lamentan",
  "gerund": "lamentando",
  "gerund_english": "lamenting",
  "pastparticiple": "lamentado",
  "pastparticiple_english": "lamented"
},
{
  "infinitive": "aceptar",
  "infinitive_english": "to accept, approve; to agree to",
  "mood": "Indicativo",
  "mood_english": "Indicative",
  "tense": "Presente",
  "tense_english": "Present",
  "verb_english": "I accept, am accepting",
  "form_1s": "acepto",
  "form_2s": "aceptas",
  "form_3s": "acepta",
  "form_1p": "aceptamos",
  "form_2p": "aceptáis",
  "form_3p": "aceptan",
  "gerund": "aceptando",
  "gerund_english": "accepting",
  "pastparticiple": "aceptado",
  "pastparticiple_english": "accepted"
},
{
  "infinitive": "callar",
  "infinitive_english": "to keep quiet about, pass over in silence; to hush",
  "mood": "Indicativo",
  "mood_english": "Indicative",
  "tense": "Presente",
  "tense_english": "Present",
  "verb_english": "I keep quiet about, am keeping quiet about",
  "form_1s": "callo",
  "form_2s": "callas",
  "form_3s": "calla",
  "form_1p": "callamos",
  "form_2p": "calláis",
  "form_3p": "callan",
  "gerund": "callando",
  "gerund_english": "keeping quiet about",
  "pastparticiple": "callado",
  "pastparticiple_english": "kept quiet about"
}];

const getRightAnswer = (word: string, tense: string, mood: string, personform: string) => {
  const w = words.find(w => w.infinitive === word);
  if (!w) return 'error';
  switch (personform) {
    case 'yo':
      return w.form_1s;
    case 'tu':
      return w.form_2s;
    case 'ella / usted':
      return w.form_3s;
    case 'nosotros':
      return w.form_1p;
    case 'vosotros':
      return w.form_2p;
    case 'ellas / ustedes':
      return w.form_3p;
  }
  return '';
};

const openPage = (page: string) => {
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
  cy.wait(400);
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
      cy.get('#usernamefield').clear();
      cy.get('#passwordfield').clear();
      createUser();
    });

  });

  describe('Single conjugation works', () => {
    beforeEach(() => {
      openPage('Conjugate');
    });

    it('Right and wrong answers recognized correctly', () => {
      cy.contains('Single').click();
      wait();
      cy.get('body').then(($body) => {
        let tense = $body.find('#tense').text();
        let mood = $body.find('#mood').text();
        let personform = $body.find('#personform').text();
        let word = $body.find('#spanishword').text();

        console.log("Word:", word);
        console.log("Tense: ", tense);
        console.log("Mood:", mood);
        console.log("Peresonform: ", personform);

        const answer = getRightAnswer(word, tense, mood, personform);

        cy.get('#answerfield').type(answer);
        cy.contains('Try').click();
        wait();
        cy.get('#correctanswers').contains('1');
        cy.get('#answerfield').type('wronganswer');
        cy.contains('Try').click();
        wait();
        cy.get('#correctanswers').contains('1');  

      });

    });

  });



});

export { };