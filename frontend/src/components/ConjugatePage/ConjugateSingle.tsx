import React, { FormEvent, useEffect, useState, KeyboardEvent } from "react";
import { wordService } from "../../services/words";
import { ConjugateMode, ConjugateSettings, Mood, Tense, Word } from "../../types";
import { forms, getForm, getRandomForm, getWordForm } from "../../utils";
import { EnglishFlag, SpanishFlag } from "../Flags";

export const ConjugateSingle = ({ settings }: { settings: ConjugateSettings }) => {

  const [word, setWord] = useState<Word | null>(null);
  const [showing, setShowing] = useState<boolean>(false);
  const [answer, setAnswer] = useState<string | null>(null);
  const [form, setForm] = useState<string | null>(null);
  const [attempt, setAttempt] = useState<string>("");
  const [tense, setTense] = useState<Tense | null>(null);
  const [mood, setMood] = useState<Mood | null>(null);

  useEffect(() => {
    void newWord();
  }, []);

  const newWord = () => {

    const { tense: randomedTense, mood: randomedMood } = getRandomForm(settings.tenseSelections, settings.moodSelections);

    setTense(randomedTense);
    setMood(randomedMood);

    // If wordlist exist, random a word from there
    const word = settings.wordlist === null ?
      null :
      settings.wordlist.words[Math.floor(Math.random() * settings.wordlist.words.length)];

    wordService.getWord(word, 'en', randomedMood, randomedTense).then((response) => {
      if (!response) {
        console.log("getWord failed");
        return;
      }
      console.log("response: ");
      setWord(response);
      const randomedForm = forms[Math.floor(Math.random() * forms.length)];
      setForm(randomedForm);
      const rightAnswer = getWordForm(response, randomedForm);
      if (rightAnswer) {
        setAnswer(rightAnswer);
      }

    }).catch(error => console.log(error));
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
    console.log("key down", event.key);
    
    if (event.key === "Tab" || event.key === "Enter") {
      event.preventDefault();
      console.log(attempt);
      console.log(answer);
      
      
      if (attempt.toLowerCase() === answer?.toLowerCase()) {
        void newWord();
        setAttempt("");
      } else {
        const field = document.getElementsByName("attemptField")[0];
        field.style.backgroundColor = "#ffebeb";
        setTimeout(() => {
          field.style.backgroundColor = "#ffffff";
        }, 2000);
      }
    }
  };

  if (!word || !answer || !form) {
    return <div>Word loading...</div>;
  }

  if (settings.mode === ConjugateMode.Flashcard) {
    return (
      <div>
      <h4><EnglishFlag /> {word.infinitive_english}</h4>
      <h5><SpanishFlag /> {word.infinitive}</h5>
        <h5>{getForm(form)} - {tense} - {mood}</h5>
        <button type='button' onClick={onClick}>{showing ? 'Next' : 'Show'}</button>
        {showing && answer}
      </div>
    );
  }

  return (
    <div>
      <h4><EnglishFlag /> {word.infinitive_english}</h4>
      <h5><SpanishFlag /> {word.infinitive}</h5>
      <h5>{getForm(form)} - {tense} - {mood}</h5>
      <form onKeyDown={onKeyDown}><input name="attemptField" type='text' onChange={onChange} value={attempt}></input></form>
    </div>
  );

};
