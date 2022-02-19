import React, { useEffect, useState } from 'react';
import { wordService } from '../../services/words';
import { Word } from '../../types';

export const VocabPage = () => {

  const [word, setWord] = useState<Word | null>(null);

  useEffect(() => {
    const getWord = () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      wordService.getRandomWord().then((response) => {
        console.log("response: ");
        
        setWord(response);
      }).catch(error => console.log(error));
    };
    getWord();
  }, []);

  if (word === null) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <p>
        {word.infinitive_english}
      </p>
      <p>
        {word.infinitive}
      </p>
    </div>
  );
};
