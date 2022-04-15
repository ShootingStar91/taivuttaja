import React, { FormEvent, KeyboardEvent, useEffect, useState } from 'react';
import { wordService } from '../../services/words';
import { ConjugateSettings, Word } from '../../types';
import { getWordForm, getForm, getFormDescription, forms, getRandomForm } from '../../utils';


export const ConjugatePage = ({ settings, next }: { settings: ConjugateSettings, next: () => void }) => {

  const [notification, setNotification] = useState<string>("");
  const [word, setWord] = useState<Word | null>(null);
  if (word) console.log("WORD: " , word.infinitive);
  else console.log("word null");
  
  

  const initialState: { [fieldName: string]: string } = {};

  forms.forEach(form => initialState[form] = '');

  const [formState, setFormState] = useState<{ [fieldName: string]: string }>({ ...initialState });
  //const [skipped, setSkipped] = useState<boolean>(false);

  useEffect(() => {
    if (!word) {
      getWord();
    }
  }, []);

  const getWord = () => {

    const { tense, mood } = getRandomForm(settings.tenseSelections, settings.moodSelections);


    // If wordlist exist, random a word from there
    const word = settings.wordlist === null ?
      null :
      settings.wordlist.words[Math.floor(Math.random() * settings.wordlist.words.length)];

    wordService.getWord(word, 'en', mood, tense).then((response) => {
      console.log("response: ");
      setWord(response);
    }).catch(error => console.log(error));

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

  const onEnter = (event: FormEvent) => {
    event.preventDefault();
    onTry(true);
  };

  const onTry = (nextField: boolean) => {

    const activeField = document.activeElement?.getAttribute('id');
    if (activeField !== undefined && activeField !== null && nextField) {
      const activeId = parseInt(activeField);
      if (activeId < 5) {
        const nextField = document.getElementById((activeId + 1).toString());
        nextField?.focus();
      }
    }


    if (word === null) { return; }
    console.log(formState);
    let fail = false;
    forms.forEach(form => {
      if (formState[form] === getWordForm(word, form)) {
        console.log('Success at ' + form);
        document.getElementsByName(form)[0].style.backgroundColor = "#33cc33";
      } else {
        const color = formState[form] === "" ? "#ffffff" : "#ffebeb";
        fail = true;
        document.getElementsByName(form)[0].style.backgroundColor = color;
      }
    });
    if (!fail) {
      setNotification("¡Todo correcto!");
      setTimeout(() => {
        setNotification("");
        setFormState({ ...initialState });
        getWord();
        resetFormColors();
        const nextField = document.getElementById("0");
        nextField?.focus();
        next();
      }, 2000);

    }
  };

  const onKeyDown = (e: KeyboardEvent<HTMLFormElement>) => {

    if (e.key === "Tab") {
      const activeField = document.activeElement?.getAttribute('id');
      if (activeField !== null && activeField !== undefined && activeField === "5" && !e.shiftKey) {
        e.preventDefault();
      }
      onTry(false);
    }
  };

  const onSkip = () => {
    setFormState({ ...initialState });
    getWord();
    resetFormColors();
    next();
  };

  if (word === null) {
    getWord();
    return <div>Loading...</div>;
  }

  return (
    <div>
      <p>
        {word.infinitive_english}
      </p>
      <p>
        {word.infinitive}
      </p>
      <div>
        <form onSubmit={onEnter} autoComplete='off' onKeyDown={onKeyDown}>
          <table>
            <tbody>
              {forms.map((form, index) =>
                <React.Fragment key={form}>
                  <tr key={form} className="conjugationRow">
                    <td><input type='text' id={index.toString()} name={form} onChange={handleChange} value={formState[form]} /></td>
                    <td className="formDescription"><div className="tooltip">{getForm(form)}<div className="tooltiptext">{getFormDescription(form)}</div></div></td>
                  </tr>
                  <tr></tr>
                  <tr></tr>
                  <tr></tr>
                </React.Fragment>
              )}
            </tbody>
          </table>
          <p><button type='submit'>Try</button></p>
          <p><button type='button' onClick={onSkip}>Skip</button></p>
        </form>
      </div>
      {notification !== "" && <div className="notificationDiv"><p className="notification">{notification}</p></div>}

    </div>
  );
};
