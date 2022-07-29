import React, { FormEvent, useEffect, useState, KeyboardEvent } from 'react';
import { COLORS } from '../../config';
import { useAppSelector } from '../../reducers/hooks';
import { errorToast } from '../../reducers/toastApi';
import { selectUser } from '../../reducers/user';
import { wordService } from '../../services/words';
import { ConjugateMode, ConjugateSettings, Mood, Tense, Word } from '../../types';
import { deAccentify, forms, getForm, getFormDescription, getRandomForm, getWordForm } from '../../utils';
import { EnglishFlag, SpanishFlag } from '../Flags';
import { FullModal } from '../Modal';

export const ConjugateSingle = ({ settings, next, stop }: { settings: ConjugateSettings, next: (max: number) => void, stop: () => void }) => {

  const [word, setWord] = useState<Word | null>(null);
  const [answer, setAnswer] = useState<string | null>(null);
  const [form, setForm] = useState<string | null>(null);
  const [attempt, setAttempt] = useState<string>('');
  const [tense, setTense] = useState<Tense | null>(null);
  const [mood, setMood] = useState<Mood | null>(null);
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const [showingCorrect, setShowingCorrect] = useState<boolean>(false);
  const [correctAnswers, setCorrectAnswers] = useState<number>(0);
  const [timeoutId, setTimeoutId] = useState<number | null>(null);

  const user = useAppSelector(selectUser);

  useEffect(() => {
    void newWord();
    // Can create unmounted error
  }, []);

  const newWord = async () => {

    const { tense: randomedTense, mood: randomedMood } = getRandomForm(settings.tenseSelections, settings.moodSelections);

    setTense(randomedTense);
    setMood(randomedMood);

    // If wordlist exist, random a word from there
    const word = settings.wordlist === null ?
      null :
      settings.wordlist.words[Math.floor(Math.random() * settings.wordlist.words.length)];
    const wordParam = word ? word.infinitive_english : null;
    const [error, result] = await wordService.getWord(wordParam, 'en', randomedMood, randomedTense);

    if (!result) {
      errorToast(error);
      return;
    }

    setWord(result);

    // Random a form only from those that are not empty
    const validForms = forms.filter(f => getWordForm(result, f) !== '');
    const randomedForm = validForms[Math.floor(Math.random() * validForms.length)];
    setForm(randomedForm);
    const rightAnswer = getWordForm(result, randomedForm);
    if (rightAnswer) {
      setAnswer(rightAnswer);
      console.log(rightAnswer);
    }

  };


  const onChange = (event: FormEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;
    if (value !== null) {
      setAttempt(value);
    }
  };

  const onKeyDown = (event: KeyboardEvent<HTMLFormElement>) => {

    if (event.key === 'Tab' || event.key === 'Enter') {
      event.preventDefault();
      if (!showingCorrect) {
        onTry();
      } else {
        goNext();
      }
    }
  };

  const onTry = () => {
    if (!answer) {
      errorToast('Invalid word data');
      return;
    }

    if (attempt.toLowerCase() === answer.toLowerCase()) {
      void correctAnswer();
    } else {
      if (user && !user.strictAccents && deAccentify(attempt.toLowerCase()) === deAccentify(answer.toLowerCase())) {
        void correctAnswer();
        return;
      }
      const field = document.getElementsByName('attemptField')[0];
      field.style.backgroundColor = COLORS.WRONG;

      setTimeout(() => {
        field.style.backgroundColor = COLORS.BLANK;
      }, 1000);
    }
  };

  const correctAnswer = () => {
    if (!answer) return;

    setShowingCorrect(true);
    const field = document.getElementsByName('attemptField')[0];
    field.style.backgroundColor = COLORS.CORRECT;
    setCorrectAnswers(correctAnswers + 1);
    const newTimeoutId = window.setTimeout(() => {
      goNext();
    }, 2000);

    setTimeoutId(newTimeoutId);

  };

  const goNext = () => {
    if (timeoutId !== null) {
      window.clearTimeout(timeoutId);
      setTimeoutId(null);
    }
    setShowingCorrect(false);
    const field = document.getElementsByName('attemptField')[0];
    void newWord();
    setAttempt('');
    next(settings.amount);
    field.style.backgroundColor = COLORS.BLANK;
  };

  const onClickSkip = () => {
    if (!word || !answer) { return; }
    if (!showAnswer) {
      setShowAnswer(true);
      setAttempt(answer);
    } else {
      setShowAnswer(false);
      void newWord();
      setAttempt('');
      next(settings.amount);
    }

  };


  if (!word || !answer || !form) {
    return <div>Word loading...</div>;
  }

  const getContent = (mode: ConjugateMode) => {

    const getFlashcardPart = () => {
      if (showAnswer) {
        return <h1 className='text-center mb-8'>{answer}</h1>;
      }
      return <h1 className='text-center mb-8'>_____</h1>;
    };

    return (
      <div className='grid justify-items-center'>
        <div className='flex auto-flex gap-x-4'>
          <SpanishFlag /> <h2 id='spanishword'>{word.infinitive}</h2>
        </div>
        <div className='flex auto-flex gap-x-4 pt-4 min-h-[100px]'>
          <EnglishFlag /> <h2>{word.infinitive_english}</h2>
        </div>
        <div className='mt-4 flex auto-flex gap-x-4'>
          <h2 id='tense' className='text-amber-600'>{tense}</h2>
          <h2 id='mood' className='text-sky-400'>{mood}</h2>
        </div>
        <h2 id='personform' className='mt-4 text-orange-500'>{getForm(form)}</h2>
        <span className='description'>{getFormDescription(form)}</span>
        <div className='mt-8'>
          {mode === ConjugateMode.Single && <>
            <form onKeyDown={onKeyDown}><div className={'rounded-lg'}><input id='answerfield' className={'textField w-[300px]' + (showAnswer ? ' showing-answer-color font-bold ' : '') + (showingCorrect ? ' correct-color ' : '')}
              name='attemptField' type='text' onChange={onChange} value={attempt} autoComplete='off' disabled={showAnswer}></input></div></form>
            <p><button className='btn w-[300px]' type='button' onClick={onTry}>Try</button></p>
          </>}
          {mode === ConjugateMode.Flashcard && getFlashcardPart()}
          <button className='btn w-[300px]' type='button' onClick={onClickSkip}>{showAnswer ? 'Next' : 'Show'}</button>


          <div id='correctanswers' style={{ display: 'none' }}>{correctAnswers}</div>

        </div>
      </div>
    );

  };

  return (
    <FullModal content={getContent(settings.mode)} closeButtonText='Stop practice' closeModal={() => stop()} />
  );


};
