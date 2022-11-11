import React from "react";

export const IndexPage = () => {
  return (
    <div>
      <h1>Conjugation app</h1>
      <p>Welcome! Learn Spanish verbs and their conjugations here!</p>
      <p>
        Click Vocab to practice <b>verb vocabulary</b>, or click Conjugate to
        practice <b>conjugating verbs</b> in different tenses and moods. You can
        also view <b>conjugation tables</b> of any verb by clicking Verbs.
      </p>
      <p>
        Create a user to set a daily goal, create wordlists, change settings and
        view what forms you have practiced most.
      </p>
      <p>
        Want to <b>test the functionality</b> without knowing Spanish? Open your
        browsers console, correct answers are printed there.
      </p>

      <h2>About</h2>
      <p>
        This app is now finished, although minor fixes may be made.{" "}
        <a className="link" href="https://github.com/ShootingStar91/taivuttaja">
          Click here for the project repository
        </a>
      </p>
      <p>
        Verb database consists of over 600 verbs from{" "}
        <a
          className="link"
          href="https://github.com/ghidinelli/fred-jehle-spanish-verbs"
        >
          this database
        </a>
        . Most of it is correct but{" "}
        <span className="font-bold">imperative forms have errors</span>: 3rd
        singular and 2nd plural forms are swapped, and 1st plural form is
        missing. Some of this may be fixed.
      </p>
      <p></p>
    </div>
  );
};
