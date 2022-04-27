/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { FormEvent, KeyboardEvent, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../reducers/hooks';
import { showNotification } from '../../reducers/notification';
import { wordService } from '../../services/words';
import { ConjugateSettings, Word } from '../../types';
import { getWordForm, getForm, getFormDescription, forms, getRandomForm } from '../../utils';
import { EnglishFlag, SpanishFlag } from '../Flags';
import userService from '../../services/user';
import { addDoneWord, selectUser } from '../../reducers/user';


export const ConjugatePage = ({ settings, next }: { settings: ConjugateSettings, next: () => void }) => {

  const [word, setWord] = useState<Word | null>(null);
  const dispatch = useAppDispatch();
  const [emptyForms, setEmptyForms] = useState<string[]>([]);
  const initialState: { [fieldName: string]: string } = {};
  const [lastId, setLastId] = useState<string | null>(null);
  const user = useAppSelector(selectUser);
  const [showingAnswers, setShowingAnswers] = useState<boolean>(false);

  forms.forEach(form => initialState[form] = '');

  const [formState, setFormState] = useState<{ [fieldName: string]: string }>({ ...initialState });
  //const [skipped, setSkipped] = useState<boolean>(false);

  useEffect(() => {
    if (!word) {
      void getWord();
    }
  }, []);

  useEffect(() => {
    // Check which forms are an empty string. Make those green and blocked from typing
    if (!word) return;
    const newEmptyForms: string[] = [];
    forms.forEach(form => {
      if (getWordForm(word, form) === "") {
        document.getElementsByName(form)[0].style.backgroundColor = "#878787"; // color for blocked text inputs
        newEmptyForms.push(form);
      }
    });

    // what is the id of the last active input field
    const emptyFormsAsNumbers = emptyForms.map(f => parseInt(f.charAt(0)));
    for (let i = 5; i >= 0; i--) {
      if (emptyFormsAsNumbers.includes(i)) {
        setLastId(i.toString());
        break;
      }
    }
    setEmptyForms(newEmptyForms);
  }, [word]);

  const getWord = async () => {

    const { tense, mood } = getRandomForm(settings.tenseSelections, settings.moodSelections);

    // If wordlist exist, random a word from there
    const randomWord = settings.wordlist === null ?
      null :
      settings.wordlist.words[Math.floor(Math.random() * settings.wordlist.words.length)];

    const [error, result] = await wordService.getWord(randomWord, 'en', mood, tense);
    if (!result) {
      void dispatch(showNotification(error));
      return;
    }

    setWord(result);

  };


  const resetFormColors = () => {
    forms.forEach(form => document.getElementsByName(form)[0].style.backgroundColor = "#ffffff");
  };


  const handleChange = (event: FormEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;
    if (value !== null) {
      setFormState({ ...formState, [event.currentTarget.name]: value });
    }
  };

  const onEnter = async (event: FormEvent) => {
    event.preventDefault();
    await onTry(true);
  };

  const onTry = async (nextField: boolean) => {

    const activeField = document.activeElement?.getAttribute('id');
    if (activeField !== undefined && activeField !== null && nextField) {
      const activeId = parseInt(activeField);
      if (activeId < 5 - emptyForms.length) {
        const nextField = document.getElementById((activeId + 1).toString());
        nextField?.focus();
      }
    }


    if (word === null) { return; }

    let all_correct = true;
    forms.forEach(form => {
      if (formState[form] === getWordForm(word, form)) {
        if (getWordForm(word, form) !== "") {
          document.getElementsByName(form)[0].style.backgroundColor = "#33cc33";
        }
      } else {
        const color = formState[form] === "" ? "#ffffff" : "#ffebeb";
        all_correct = false;
        document.getElementsByName(form)[0].style.backgroundColor = color;
      }
    });

    if (all_correct) {
      void dispatch(showNotification("¡Todo correcto!"));

      if (user?.token) {
        const [error, result] = await userService.addDoneWord(word._id, user.token);
        if (!result) {
          void dispatch(showNotification(error));
        }
        dispatch(addDoneWord());
      }
      setFormState({ ...initialState });
      await getWord();
      resetFormColors();
      const nextField = document.getElementById("0");
      nextField?.focus();
      next();

    }
  };

  const onKeyDown = async (e: KeyboardEvent<HTMLFormElement>) => {

    if (e.key === "Tab") {
      const activeField = document.activeElement?.getAttribute('id');
      if (activeField !== null && activeField !== undefined && activeField === "5" && !e.shiftKey) {
        e.preventDefault();
      }
      await onTry(false);
    }
  };

  const onSkip = async () => {
    if (!word) {
      void dispatch(showNotification("Unexpected error happened!"));
      return;
    }
    if (!showingAnswers) {
      setShowingAnswers(true);
      const newFormState = {...initialState};
      forms.forEach(f => {
        const answer = getWordForm(word, f);
        newFormState[f] = answer !== undefined ? answer : "";
        setFormState({...newFormState});
      });
      forms.forEach(form => document.getElementsByName(form)[0].style.backgroundColor = "#ffec99");

    } else {
      setShowingAnswers(false);
      setFormState({ ...initialState });
      await getWord();
      resetFormColors();
      next();
    }
  };

  if (word === null) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <p>
        <SpanishFlag /> <b>{word.infinitive}</b>
      </p>
      <p>
        <EnglishFlag /> {word.infinitive_english}
      </p>
      <p>
        {word.mood_english} {word.tense_english.toLowerCase()}
      </p>
      <div>
        <form onSubmit={onEnter} autoComplete='off' onKeyDown={onKeyDown}>
          <table>
            <tbody>
              {forms.map((form, index) =>
                <React.Fragment key={form}>
                  <tr key={form} className="conjugationRow">
                    <td><input type='text' id={index.toString()} name={form} onChange={emptyForms.includes(form) ? undefined : handleChange} value={formState[form]} disabled={emptyForms.includes(form) ? true : undefined} /></td>
                    <td className="formDescription"><div className="tooltip">{getForm(form)}<div className="tooltiptext">{getFormDescription(form)}</div></div></td>
                  </tr>
                  <tr></tr>
                  <tr></tr>
                  <tr></tr>
                </React.Fragment>
              )}
            </tbody>
          </table>
          <p><button type='submit' disabled={showingAnswers}>Try</button></p>
          <p><button type='button' onClick={onSkip}>{showingAnswers ? "Next" : "Show answers"}</button></p>
        </form>
      </div>
    </div>
  );
};
