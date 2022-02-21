import React, { FormEvent, useState } from 'react';
import { Word } from '../../types';

const getWordForm = (word: Word, form: string) => {
  switch (form) {
    case '1s':
      return word.form_1s;
    case '2s':
      return word.form_2s;
    case '3s':
      return word.form_3s;
    case '1p':
      return word.form_1p;
    case '2p':
      return word.form_2p;
    case '3p':
      return word.form_3p;
  }
};

export const ConjugatePage = ({ word, getWord}: { word: Word | null, getWord: () => void }) => {
  
  const forms = ['1s', '2s', '3s', '1p', '2p', '3p'];

  const initialState: {[fieldName: string]: string } = {};

  forms.forEach(form => initialState[form] = '');

  const [formState, setFormState] = useState<{ [fieldName: string]: string }>({ ...initialState });

  const handleChange = (event: FormEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;
    if (value !== null) {
      setFormState({ ...formState, [event.currentTarget.name]: value });
    }
  };

  const onTry = (event: FormEvent) => {
    event.preventDefault();
    if (word === null) { return; }
    console.log(formState);
    let fail = false;
    forms.forEach(form => {
      if (formState[form] === getWordForm(word, form)) {
        console.log('Success at ' + form);
        
      } else {
        fail = true;
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
        {forms.map(form => <p key={form}><input type='text' name={form} onChange={handleChange} value={formState[form]}/></p>)}
          <p><button type='submit'>Try</button></p>
          <p><button type='button' onClick={onSkip}>Skip</button></p>
        </form>
      </div>
    </div>
  );
};