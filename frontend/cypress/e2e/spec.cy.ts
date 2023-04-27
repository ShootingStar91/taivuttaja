import axios from "axios";
const API_URL = "http://localhost:3001/api/words/word/";

const getRightAnswer = async (
  word: string,
  tense: string,
  mood: string,
  personform: string
) => {
  const result = await axios.get(API_URL, { params: { word, tense, mood } });
  return result;
};

const openPage = (page: string) => {
  cy.get("#navbar").contains(page.toUpperCase()).click({ force: true });
  wait();
};
const login = () => {
  openPage("Login");
  wait();
  cy.get("#usernamefield").type("testuser");
  cy.get("#passwordfield").type("testpass");
  cy.get("#loginbutton").click();
  wait();
};
const deleteUsers = () => {
  cy.request("http://localhost:3001/api/test/deleteall");
  wait();
};

const createUser = () => {
  openPage("Login");
  wait();
  cy.get("#usernamefield").type("testuser");
  cy.get("#passwordfield").type("testpass");
  cy.contains("Create new user").click();
  wait();
};

const logout = () => {
  openPage("Logout");
  wait();
};

const wait = () => {
  cy.wait(400);
};

describe("taivuttaja-app", () => {
  it("Backend is running", () => {
    deleteUsers();
  });

  it("Frontend is running", () => {
    cy.visit("http://localhost:3000");
  });

  context("when unlogged", () => {
    it("Conjugate-page opens and does not have wordlist form", () => {
      openPage("Conjugate");
      wait();
      cy.contains("Begin by choosing mode!");
      cy.contains("Select wordlist").should("not.exist");
    });
    it("Vocab-page opens", () => {
      openPage("Vocab");
      wait();
      cy.contains("Try");
    });
    it("Home page opens", () => {
      openPage("Home");
      wait();
      cy.contains("Welcome");
    });
    it("User creation works", () => {
      createUser();
      wait();
      cy.contains("Strict accents mode");
    });
  });

  context("when logged in", () => {
    before(() => {
      logout();

      login();
    });

    it("Conjugate-page opens and does not contain wordlist form", () => {
      openPage("Conjugate");
      wait();
      cy.contains("No wordlists found");
    });
    it("User page opens", () => {
      openPage("User page");
      wait();
      cy.contains("Strict accents mode");
    });

    it("Logging out works", () => {
      logout();
      cy.contains("Logged in as").should("not.exist");
    });
  });

  context("when on user page", () => {
    // daily goal can be set -test not done, have to figure out how to work with sliders
    beforeEach(() => {
      cy.visit("http://localhost:3000");
      login();
    });
    it("Strict accent mode can be set", () => {
      wait();
      cy.get("#strictaccentmode").click({ force: true });
      wait();
      logout();
      login();
      cy.contains("On");
    });

    it("Practice history works", () => {
      cy.contains("View practice history").click();
      wait();
      cy.contains("conjugated a verb");
      cy.contains("Close").click({ force: true });
    });

    it("Wordlist adding works", () => {
      cy.get("#wordlistnamefield").type("wordlist1");
      cy.get("#createwordlistbutton").click();
      wait();
      cy.contains("Add words to wordlist: wordlist1");
      openPage("User page");
      wait();
      cy.contains("Create");
      cy.contains("wordlist1");
      wait();
    });

    it("Can add words to wordlist", () => {
      wait();
      cy.get("#wordlists").contains("wordlist1").click();
      wait();
      cy.get("#wordselectfield").type("a");
      wait();
      cy.contains("aceptar").click();
      wait();
      cy.get("#addwordbutton").contains("Add").click();
      wait();
      cy.get("#words").contains("aceptar");
      openPage("User page");
      wait();
      cy.get("#wordlists").contains("wordlist1").click();
      wait();
      cy.get("#words").contains("aceptar");
    });

    it("Can delete words from wordlist", () => {
      cy.get("#wordlists").contains("wordlist1").click();
      wait();
      cy.get("#words").contains("aceptar").get("#deleteicon").click();
      wait();
      cy.get("#words").should("not.exist");
      openPage("User page");
      wait();
      cy.get("#wordlists").contains("wordlist1").click();
      wait();
      cy.get("#words").should("not.exist");
    });

    it("Can delete wordlist", () => {
      cy.get("#wordlists").contains("wordlist1").click();
      wait();
      cy.get("#deletewordlistbutton").click();
      wait();
      cy.get("#wordlists").contains("wordlist1").should("not.exist");
    });

    it("Can change password", () => {
      const changePass = (oldpass: string, newpass: string) => {
        cy.contains("Change password").click();
        wait();
        cy.get("#currentpasswordfield").type(oldpass);
        cy.get("#newpasswordfield1").type(newpass);
        cy.get("#newpasswordfield2").type(newpass);
        cy.get("#changepasswordbutton").click();
        wait();
        cy.get("#toast-default").click();
        wait();
        cy.contains("Close").click();
        wait();
      };
      changePass("testpass", "newtestpass");
      logout();
      openPage("Login");
      wait();
      cy.get("#usernamefield").type("testuser");
      cy.get("#passwordfield").type("newtestpass");
      cy.get("#loginbutton").click();
      wait();
      changePass("newtestpass", "testpass");
      wait();
    });

    it("Can delete account", () => {
      cy.contains("Delete all user data").click();
      wait();
      openPage("Login");
      wait();
      cy.get("#usernamefield").type("testuser");
      cy.get("#passwordfield").type("testpass");
      cy.get("#loginbutton").click();
      wait();
      cy.contains("Logged in as").should("not.exist");
      cy.get("#usernamefield").clear();
      cy.get("#passwordfield").clear();
      createUser();
    });
  });

  describe("Single conjugation works", async () => {
    beforeEach(() => {
      openPage("Conjugate");
    });

    it("Right and wrong answers recognized correctly", async () => {
      cy.contains("Single").click();
      wait();
      cy.get("body").then(async ($body) => {
        const tense = $body.find("#tense").text();
        const mood = $body.find("#mood").text();
        const personform = $body.find("#personform").text();
        const word = $body.find("#spanishword").text();

        console.log("Word:", word);
        console.log("Tense: ", tense);
        console.log("Mood:", mood);
        console.log("Personform: ", personform);

        const answer = await getRightAnswer(word, tense, mood, personform) as any;

        cy.get("#answerfield").type(answer);
        cy.contains("Try").click();
        wait();
        cy.get("#correctanswers").contains("1");
        cy.get("#answerfield").clear();
        wait();
        cy.contains("Next").click();
        wait();
        cy.get("#answerfield").clear();
        cy.get("#answerfield").type("wronganswer");
        cy.contains("Try").click();
        wait();
        // correctanswers holds count of so far correctly answered, so this tests
        // that the wrong answer didnt raise the count
        cy.get("#correctanswers").contains("1");
      });
    });
  });
});

export {};
