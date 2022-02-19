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
        
        console.log(response);
        if (response.length > 0) {
          setWord(response[0]);
        }
      }).catch(error => console.log(error));
    };
    getWord();
  }, []);


  return (
    <div>
      {word && word.infinitive_english}
    </div>
  );
};
