import React, { FormEvent, useState } from 'react';
import { Word } from '../../types';
import { getWordForm, getFormDescription } from '../../utils';


export const ConjugatePage = ({ word, getWord }: { word: Word | null, getWord: () => void }) => {
  
  const forms = ['1s', '2s', '3s', '1p', '2p', '3p'];

  const initialState: {[fieldName: string]: string } = {};

  forms.forEach(form => initialState[form] = '');

  const [formState, setFormState] = useState<{ [fieldName: string]: string }>({ ...initialState });
  //const [skipped, setSkipped] = useState<boolean>(false);

  const handleChange = (event: FormEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;
    if (value !== null) {
      setFormState({ ...formState, [event.currentTarget.name]: value });
    }
  };

  const onTry = (event: FormEvent) => {
    event.preventDefault();

    const activeField = document.activeElement?.getAttribute('id');
    if (activeField !== undefined && activeField !== null) {
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
        document.getElementsByName(form)[0].style.backgroundColor = "#ffffff";
      } else {
        fail = true;
        document.getElementsByName(form)[0].style.backgroundColor = "#ffebeb";
      }
    });
    if (!fail) {
      setFormState({ ...initialState });
      getWord();
    }
  };

  const onSkip = () => {
    setFormState({ ...initialState });
    getWord();
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
        <form onSubmit={onTry} autoComplete='off'>
          <table>
            {forms.map((form, index) => 
            <React.Fragment key={form}>
                <tr key={form} className="conjugationRow">
                  <td><input type='text' id={index.toString()}name={form} onChange={handleChange} value={formState[form]}/></td>
                  <td className="formDescription">{getFormDescription(form)}</td>
                </tr>
                <tr></tr>
                <tr></tr>
                <tr></tr>
            </React.Fragment>
            )}
            
          </table>
        <p><button type='submit'>Try</button></p>
        <p><button type='button' onClick={onSkip}>Skip</button></p>
        </form>
      </div>
    </div>
  );
};