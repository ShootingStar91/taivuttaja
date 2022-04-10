import React, { useEffect, useState } from "react";
import { wordService } from "../../services/words";
import { Word } from "../../types";
import { forms, getForm, getWordForm } from "../../utils";

export const FlashCardPage = () => {

  const [word, setWord] = useState<Word | null>(null);
  const [showing, setShowing] = useState<boolean>(false);
  const [answer, setAnswer] = useState<string | null>(null);
  const [form, setForm] = useState<string | null>(null);

  useEffect(() => {
    void newWord();
  }, []);

  const newWord = async () => {
    // select mood and tense
    const mood = 'Indicative';
    const tense = 'Present';

    // get word
    const randomedWord = await wordService.getWord(null, 'en', mood, tense);
    if (!randomedWord) {
      console.log("Error randoming word");
      return;
    }
    setWord(randomedWord);
    // random its conjugation
    const randomedForm = forms[Math.floor(Math.random() * forms.length)];
    setForm(randomedForm);
    const rightAnswer = getWordForm(randomedWord, randomedForm);
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

  if (!word || !answer || !form) {
    return <div>Word loading...</div>;
  }

  return (
    <div>
      <h4>{word.infinitive_english}</h4>
      <h5>{word.infinitive}</h5>
      <h5>{getForm(form)}</h5>
      <button type='button' onClick={onClick}>{showing ? 'Next' : 'Show'}</button>
      {showing && answer}
    </div>
  );

};