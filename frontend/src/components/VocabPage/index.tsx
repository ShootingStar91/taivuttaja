import React, { FormEvent, useEffect, useState, KeyboardEvent } from 'react';
import { useAppDispatch } from '../../reducers/hooks';
import { errorToast, showToast } from '../../reducers/notification';
import { wordService } from '../../services/words';
import { Word } from '../../types';
import { EnglishFlag, SpanishFlag } from '../Flags';

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
      void dispatch(showToast(errorToast(error)));
      return;
    }
    setWord(result);
  };

  const onTry = (event: FormEvent) => {
    event.preventDefault();
    check();
  };

  const check = () => {
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

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    console.log(event.key);
    console.log("moi");
    
    if (event.key === "Tab" || event.key === "Enter") {
      event.preventDefault();
      check();     
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

    <div className="fullcard p-8" onKeyDown={onKeyDown}>
      <div className='flex auto-flex gap-x-4 pt-4 min-h-[100px]'>
        <EnglishFlag /> <h2>{word.infinitive_english}</h2>
      </div>
      <div>
        <div className='flex auto-flex gap-x-4'>
          <SpanishFlag /><input className='textField' type='text' onChange={handleChange} value={currentTry} disabled={showAnswer} />
        </div>
        <div className='flex auto-flex gap-x-4 pt-8'>
          <button className='btn w-[145px]' type='button' onClick={onTry}>Try</button>
          <button className='btn w-[145px]' type='button' onClick={onClickSkip}>{showAnswer ? "Skip" : "Show"}</button>
        </div>
      </div>
    </div>
  );
};
