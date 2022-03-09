import React, { FormEvent, useState } from 'react';
import { Word } from '../../types';

export const VocabPage = ( { word, getWord}: { word: Word | null, getWord: () => void } ) => {

  const [currentTry, setCurrentTry] = useState<string>("");


  const onTry = (event: FormEvent) => {
    event.preventDefault();
    console.log('Current try' + currentTry);
    if (word) console.log(word.infinitive);
    if (word && currentTry === word.infinitive) {
      getWord();
      setCurrentTry("");
    } else {
      console.log("wrong");
      
    }
  };

  const handleChange = (event: FormEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;
    if (value !== null) {
      setCurrentTry(value);
    }
  };

  if (word === null) {
    getWord();
    return <div>Loading...</div>;
  }

  return (
    <div className="vocabPage">
      <p>
        {word.infinitive_english}
      </p>
      <div>
        <form onSubmit={onTry}>
          <p><input type='text' onChange={handleChange} value={currentTry} /></p>
          <p><button type='submit'>Try</button></p>
        </form>
      </div>
    </div>
  );
};
