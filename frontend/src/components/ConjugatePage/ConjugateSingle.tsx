import React, { FormEvent, useEffect, useState, KeyboardEvent } from "react";
import { COLORS } from "../../config";
import { useAppDispatch, useAppSelector } from "../../reducers/hooks";
import { showNotification } from "../../reducers/notification";
import { selectUser } from "../../reducers/user";
import { wordService } from "../../services/words";
import { ConjugateMode, ConjugateSettings, Mood, Tense, Word } from "../../types";
import { deAccentify, forms, getForm, getRandomForm, getWordForm } from "../../utils";
import { EnglishFlag, SpanishFlag } from "../Flags";

export const ConjugateSingle = ({ settings }: { settings: ConjugateSettings }) => {

  const [word, setWord] = useState<Word | null>(null);
  const [showing, setShowing] = useState<boolean>(false);
  const [answer, setAnswer] = useState<string | null>(null);
  const [form, setForm] = useState<string | null>(null);
  const [attempt, setAttempt] = useState<string>("");
  const [tense, setTense] = useState<Tense | null>(null);
  const [mood, setMood] = useState<Mood | null>(null);
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
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
    if (!answer) {
      void dispatch(showNotification("Error: invalid word data"));
      return;
    }
    if (event.key === "Tab" || event.key === "Enter") {
      event.preventDefault();
      console.log(attempt);
      console.log(answer);


      if (attempt.toLowerCase() === answer.toLowerCase()) {
        void newWord();
        setAttempt("");
      } else {
        if (user && !user.strictAccents && deAccentify(attempt.toLowerCase()) === deAccentify(answer.toLowerCase())) {
          void dispatch(showNotification(`Correct, but the accents are: ${answer}`));
          void newWord();
          setAttempt("");
        }
        const field = document.getElementsByName("attemptField")[0];
        field.style.backgroundColor = COLORS.WRONG;
        setTimeout(() => {
          field.style.backgroundColor = COLORS.BLANK;
        }, 2000);
      }
    }
  };

  const onClickSkip = () => {
    if (!word) { return; }
    if (!showAnswer) {
      setShowAnswer(true);
      setAttempt(word.infinitive);
    } else {
      setShowAnswer(false);
      void newWord();
      setAttempt("");
    }
    
  };
  

  if (!word || !answer || !form) {
    return <div>Word loading...</div>;
  }

  if (settings.mode === ConjugateMode.Flashcard) {
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

  return (
    <div>
      <div className='flex auto-flex gap-x-4'>
        <SpanishFlag /> <h2>{word.infinitive}</h2>
      </div>
      <div className='flex auto-flex gap-x-4 pt-4'>
        <EnglishFlag /> <h2>{word.infinitive_english}</h2>
      </div>
      <div className='mt-4 flex auto-flex gap-x-4'>
        <h2 className='text-amber-600'>{tense}</h2>
        <h2 className='text-sky-400'>{mood}</h2>
      </div>
      <p><h2>{getForm(form)}</h2></p>
      <div className='mt-8'>
        <form onKeyDown={onKeyDown}><input className='textField' name="attemptField" type='text' onChange={onChange} value={attempt} autoComplete="off" disabled={showAnswer}></input></form>
        <p><button className='btn' type='submit'>Try</button></p>
        <p><button className='btn' type='button' onClick={onClickSkip}>{showAnswer ? "Skip" : "Show"}</button></p>

      </div>
    </div>
  );

};
