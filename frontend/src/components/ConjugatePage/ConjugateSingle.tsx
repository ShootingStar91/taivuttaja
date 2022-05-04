import React, { FormEvent, useEffect, useState, KeyboardEvent } from "react";
import { COLORS } from "../../config";
import { useAppDispatch, useAppSelector } from "../../reducers/hooks";
import { showNotification } from "../../reducers/notification";
import { selectUser } from "../../reducers/user";
import { wordService } from "../../services/words";
import { ConjugateMode, ConjugateSettings, Mood, Tense, Word } from "../../types";
import { deAccentify, forms, getForm, getFormDescription, getRandomForm, getWordForm } from "../../utils";
import { EnglishFlag, SpanishFlag } from "../Flags";
import { Modal } from "../modal";

export const ConjugateSingle = ({ settings, next, stop }: { settings: ConjugateSettings, next: () => void, stop: () => void }) => {

  const [word, setWord] = useState<Word | null>(null);
  const [showing, setShowing] = useState<boolean>(false);
  const [answer, setAnswer] = useState<string | null>(null);
  const [form, setForm] = useState<string | null>(null);
  const [attempt, setAttempt] = useState<string>("");
  const [tense, setTense] = useState<Tense | null>(null);
  const [mood, setMood] = useState<Mood | null>(null);
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const [showingCorrect, setShowingCorrect] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);

  useEffect(() => {
    void newWord();
  }, []);

  const newWord = async () => {

    const { tense: randomedTense, mood: randomedMood } = getRandomForm(settings.tenseSelections, settings.moodSelections);

    setTense(randomedTense);
    setMood(randomedMood);

    // If wordlist exist, random a word from there
    const word = settings.wordlist === null ?
      null :
      settings.wordlist.words[Math.floor(Math.random() * settings.wordlist.words.length)];

    const [error, result] = await wordService.getWord(word, 'en', randomedMood, randomedTense);

    if (!result) {
      void dispatch(showNotification(error));
      return;
    }

    setWord(result);

    // Random a form only from those that are not empty
    const validForms = forms.filter(f => getWordForm(result, f) !== "");
    const randomedForm = validForms[Math.floor(Math.random() * validForms.length)];
    setForm(randomedForm);
    const rightAnswer = getWordForm(result, randomedForm);
    if (rightAnswer) {
      setAnswer(rightAnswer);
    }

  };

  const onClick = () => {
    if (!showing) {
      setShowing(true);
      return;
    }
    setShowing(false);
    void newWord();
  };

  const onChange = (event: FormEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;
    if (value !== null) {
      setAttempt(value);
    }
  };

  const onKeyDown = (event: KeyboardEvent<HTMLFormElement>) => {

    if (event.key === "Tab" || event.key === "Enter") {
      event.preventDefault();
      onTry();
    }
  };

  const onTry = () => {
    if (!answer) {
      void dispatch(showNotification("Error: invalid word data"));
      return;
    }

    if (attempt.toLowerCase() === answer.toLowerCase()) {
      void correctAnswer();
    } else {
      if (user && !user.strictAccents && deAccentify(attempt.toLowerCase()) === deAccentify(answer.toLowerCase())) {
        void correctAnswer();
        return;
      }
      const field = document.getElementsByName("attemptField")[0];
      field.style.backgroundColor = COLORS.WRONG;

      setTimeout(() => {
        field.style.backgroundColor = COLORS.BLANK;
      }, 1000);
    }
  };

  const correctAnswer = () => {
    if (!answer) return;

    setShowingCorrect(true);
    const field = document.getElementsByName("attemptField")[0];
    field.style.backgroundColor = COLORS.CORRECT;

    setTimeout(() => {
      setShowingCorrect(false);

      void newWord();
      setAttempt("");
      next();
      field.style.backgroundColor = COLORS.BLANK;
    }, 2000);

    console.log(showingCorrect);

  };

  const onClickSkip = () => {
    if (!word || !answer) { return; }
    if (!showAnswer) {
      setShowAnswer(true);
      setAttempt(answer);
    } else {
      setShowAnswer(false);
      void newWord();
      setAttempt("");
      next();
    }

  };


  if (!word || !answer || !form) {
    return <div>Word loading...</div>;
  }

  const getContent = (mode: ConjugateMode) => {
    if (mode === ConjugateMode.Flashcard) {
      return (
        <div>
          <div className='flex auto-flex gap-x-4'>
            <SpanishFlag /> <h2>{tense}</h2>
          </div>
          <div className='flex auto-flex gap-x-4 pt-4'>
            <EnglishFlag /> <h2>{mood}</h2>
          </div>
          <div className='mt-4 flex auto-flex gap-x-4'>
            <h2 className='text-amber-600'>{word.mood_english}</h2>
            <h2 className='text-sky-400'>{word.tense_english.toLowerCase()}</h2>
          </div>
          <button type='button' onClick={onClick}>{showing ? 'Next' : 'Show'}</button>
          {showing && answer}
        </div>
      );
    }

    if (mode === ConjugateMode.Single) {
      return (
        <div className='m-8'>
          <div className='flex auto-flex gap-x-4'>
            <SpanishFlag /> <h2>{word.infinitive}</h2>
          </div>
          <div className='flex auto-flex gap-x-4 pt-4 min-h-[100px]'>
            <EnglishFlag /> <h2>{word.infinitive_english}</h2>
          </div>
          <div className='mt-4 flex auto-flex gap-x-4'>
            <h2 className='text-amber-600'>{tense}</h2>
            <h2 className='text-sky-400'>{mood}</h2>
          </div>
          <h2 className='mt-4 text-yellow-400'>{getForm(form)}</h2>
          <span className="description pl-4">{getFormDescription(form)}</span>
          <div className='mt-8'>
            <form onKeyDown={onKeyDown}><div className={'p-4 bg-amber-50 shadow-lg rounded-lg'}><input className={'textField shadow ' + (showAnswer ? ' bg-amber-300 ' : '') + (showingCorrect ? ' bg-green-300 ' : '')} name="attemptField" type='text' onChange={onChange} value={attempt} autoComplete="off" disabled={showAnswer}></input></div></form>
            <p><button className='btn' type='submit' onClick={onTry}>Try</button></p>
            <p><button className='btn' type='button' onClick={onClickSkip}>{showAnswer ? "Skip" : "Show"}</button></p>

          </div>
        </div>
      );
    }
    return <></>;

  };

  return (
    <Modal content={getContent(settings.mode)} closeButtonText="Stop practice" closeModal={() => stop()} />
  );


};
