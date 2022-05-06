import React from 'react';

export const IndexPage = () => {
  return (
    <div>
      <h1>Welcome</h1>
      <p>Welcome to the conjugation app! Learn Spanish verbs and their conjugations here! Try the different learning modes:</p>
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
    </div>
  );
};
