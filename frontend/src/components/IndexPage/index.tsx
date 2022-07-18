import React from 'react';

export const IndexPage = () => {
  return (
    <div>
      <h1>Conjugation app</h1>
      <p>Welcome! Learn Spanish verbs and their conjugations here! Try the different learning modes:</p>
      <h2>Vocabulary</h2>
      <p>Get a random verb in English and type it in Spanish.</p>
      <h2>Conjugate</h2>
      <p>Practice conjugations by getting random verb to conjugate and then write out all the different forms. You can choose different moods or tenses to include in the randomed words! Different modes for conjugating:</p>
      <ul className='pl-4'>
        <li><span className='font-bold'>Full mode</span>: Write all 6 forms of 1st-3rd person singular & plural</li>
        <li><span className='font-bold'>Single mode</span>: Write one random form, for example 1st person plural</li>
        <li><span className='font-bold'>Flashcard</span>: No typing, just guess the verb form and click to show it</li>
      </ul>
      <p></p>
      <h2>Conjugation tables</h2>
      <p>Click on Verbs-link to search for verbs and see all their conjugation forms.</p>
      <h2>About</h2>
      <p>This app is a work in progress, but most of it should work. <a className='link' href='https://github.com/ShootingStar91/taivuttaja'>Click here for the project repository</a></p>
      <p>Verb database consists of over 600 verbs from <a className='link' href='https://github.com/ghidinelli/fred-jehle-spanish-verbs'>this database</a>. Most of it is correct but <span className='font-bold'>imperative forms have errors</span>: 3rd singular and 2nd plural forms are swapped, and 1st plural form is missing. Some of this will be fixed.</p>
      <p></p>
    </div>
  );
};
