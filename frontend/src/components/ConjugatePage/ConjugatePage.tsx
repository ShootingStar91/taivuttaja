/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { FormEvent, KeyboardEvent, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../reducers/hooks';
import { showNotification } from '../../reducers/notification';
import { wordService } from '../../services/words';
import { ConjugateMode, ConjugateSettings, Word } from '../../types';
import { getWordForm, getForm, getFormDescription, forms, getRandomForm, deAccentify } from '../../utils';
import { EnglishFlag, SpanishFlag } from '../Flags';
import userService from '../../services/user';
import { addDoneWord, selectUser } from '../../reducers/user';
import { delay } from '../../services/util';
import { COLORS } from '../../config';
import { Modal } from '../Modal';
import { useNavigate } from 'react-router-dom';

export const ConjugatePage = ({ settings, next, stop }: { settings: ConjugateSettings, next: () => void, stop: () => void }) => {

  const [word, setWord] = useState<Word | null>(null);
  const dispatch = useAppDispatch();
  const [emptyForms, setEmptyForms] = useState<string[]>([]);
  const initialState: { [fieldName: string]: string } = {};
  const [lastId, setLastId] = useState<string | null>(null);
  const user = useAppSelector(selectUser);
  const [showingAnswers, setShowingAnswers] = useState<boolean>(false);
  const navigate = useNavigate();
  forms.forEach(form => initialState[form] = '');
  const [triggerClose, setTriggerClose] = useState<boolean>(false);
  const [formState, setFormState] = useState<{ [fieldName: string]: string }>({ ...initialState });

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
    let accentMistakes = false;
    let all_correct = true;
    forms.forEach(form => {
      const attempt = formState[form];
      const correct = getWordForm(word, form);
      if (!correct) {
        void dispatch(showNotification("Unexpected error: Invalid word data."));
        return;
      }
      if (attempt === correct) {
        const color = attempt === "" ? COLORS.BLANK : COLORS.CORRECT;
        document.getElementsByName(form)[0].style.backgroundColor = color;

      } else {
        if (user && !user.strictAccents && deAccentify(attempt) === deAccentify(correct)) {
          // Some accents were wrong but word otherwise correct
          document.getElementsByName(form)[0].style.backgroundColor = COLORS.ALMOST_CORRECT;
          accentMistakes = true;
        } else {
          // Wrong answer
          const color = formState[form] === "" ? COLORS.BLANK : COLORS.WRONG;
          all_correct = false;
          document.getElementsByName(form)[0].style.backgroundColor = color;
        }
      }
    });

    if (all_correct) {
      const message = accentMistakes ? "All correct, but remember the accents!" : "¡Todo correcto!";
      void dispatch(showNotification(message));
      await delay(3000);
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
      console.log(word);
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
      const newFormState = { ...initialState };
      forms.forEach(f => {
        const answer = getWordForm(word, f);
        newFormState[f] = answer !== undefined ? answer : "";
        setFormState({ ...newFormState });
        document.getElementsByName(f).forEach(element => element.setAttribute('disabled', 'true'));
        document.getElementsByName(f)[0].style.backgroundColor = "#ffec99";
      });

    } else {
      forms.forEach(f => document.getElementsByName(f).forEach(element => element.removeAttribute('disabled')));

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
  const getContent = () => {
    return (
      <div className='md:pl-12'>
        <div className='flex auto-flex gap-x-4'>
          <SpanishFlag /> <h2>{word.infinitive}</h2>
        </div>
        <div className='flex auto-flex gap-x-4 pt-4'>
          <EnglishFlag /> <h2>{word.infinitive_english}</h2>
        </div>
        <div className='mt-4 flex auto-flex gap-x-4'>
          <h2 className='text-amber-600'>{word.mood_english}</h2>
          <h2 className='text-sky-400'>{word.tense_english.toLowerCase()}</h2>
        </div>
        <div className='mt-8'>
          <form onSubmit={onEnter} autoComplete='off' onKeyDown={onKeyDown}>
            <table>
              <tbody>
                {forms.map((form, index) =>
                  <React.Fragment key={form}>
                    <tr key={form}>
                      <td><input className='textField' type='text' id={index.toString()} name={form} onChange={emptyForms.includes(form) ? undefined : handleChange} value={formState[form]} disabled={emptyForms.includes(form) ? true : undefined} /></td>
                      <td><div className="ml-8 min-h-[80px]"><h3>{getForm(form)}</h3><div className="description">{getFormDescription(form)}</div></div></td>
                    </tr>
                    <tr></tr>
                    <tr></tr>
                    <tr></tr>
                  </React.Fragment>
                )}
              </tbody>
            </table>
            <div className='flex gap-x-8 mt-8'>
              <button className='btn w-[220px]' type='submit' disabled={showingAnswers}>Try</button>
              <button className={'w-[220px]' + (showingAnswers ? ' btn-orange ' : ' btn ')} type='button' onClick={onSkip}>{showingAnswers ? "Next" : "Show answers"}</button>
            </div>
          </form>
        </div>
      </div>

    );
  };
  if (!triggerClose) {
  return (
    <Modal content={getContent()} closeButtonText="Stop practice" closeModal={() => stop() } />
  );
  }
  return null;
};
