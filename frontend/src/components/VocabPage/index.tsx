import React, { FormEvent, useEffect, useState } from 'react';
import { wordService } from '../../services/words';
import { Word } from '../../types';

export const VocabPage = () => {

  const [word, setWord] = useState<Word | null>(null);
  const [currentTry, setCurrentTry] = useState<string>("");

  useEffect(() => {
    getWord();
  }, []);

  const getWord = () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    wordService.getRandomWord().then((response) => {
      console.log("response: ");
      
      setWord(response);
    }).catch(error => console.log(error));
  };

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
    return <div>Loading...</div>;
  }

  return (
    <div>
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
