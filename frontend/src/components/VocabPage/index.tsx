import React, { FormEvent, useEffect, useState } from 'react';
import { useAppDispatch } from '../../reducers/hooks';
import { showNotification } from '../../reducers/notification';
import { wordService } from '../../services/words';
import { Word } from '../../types';

export const VocabPage = () => {

  const [currentTry, setCurrentTry] = useState<string>("");
  const [word, setWord] = useState<Word | null>(null);
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!word) {
      void getWord();
    }
  }, []);

  const getWord = async () => {
    const [error, result] = await wordService.getWord(null, 'en', null, null);
    if (!result) {
      void dispatch(showNotification(error));
      return;
    }
    setWord(result);
  };

  const onTry = (event: FormEvent) => {
    event.preventDefault();
    if (word && currentTry === word.infinitive) {
      void getWord();
      setCurrentTry("");
    }
  };

  const handleChange = (event: FormEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;
    if (value !== null) {
      setCurrentTry(value);
    }
  };

  const onClickSkip = () => {
    if (!word) { return; }
    if (!showAnswer) {
      setShowAnswer(true);
      setCurrentTry(word.infinitive);
    } else {
      setShowAnswer(false);
      void getWord();
      setCurrentTry("");
    }
    
  };
  
  if (word === null) {
    return <div>Loading...</div>;
  }

  return (
    <div className="vocabPage">
      <p>
        {word.infinitive_english}
      </p>
      <div>
        <form onSubmit={onTry}>
          <p><input type='text' onChange={handleChange} value={currentTry} disabled={showAnswer} /></p>
          <p><button type='submit'>Try</button></p>
          <p><button type='button' onClick={onClickSkip}>{showAnswer ? "Skip" : "Show"}</button></p>
        </form>
      </div>
    </div>
  );
};
