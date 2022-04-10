import { Word } from './types';

export const baseUrl = 'http://localhost:3001/api/';

export const forms = ['1s', '2s', '3s', '1p', '2p', '3p'];

export const deAccentify = (word: string): string => {
  return word.replace('á', 'a')
  .replace('é', 'e')
  .replace('ó', 'o')
  .replace('ú', 'u')
  .replace('í', 'i');
};


export const getWordForm = (word: Word, form: string) => {
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


export const getFormDescription = (form: string): string => {
  switch (form) {
    case '1s':
      return 'First person singular (I, me)';
    case '2s':
      return 'Second person singular (you)';
    case '3s':
      return 'Third person singular (she/her/it) / Formal "you"';
    case '1p':
      return 'First person plural (we)';
    case '2p':
      return 'Second person plural (you all)';
    case '3p':
      return 'Third person plural (they) / Formal "you all"';
  }
  return "Error, form description missing!";
};

export const getForm = (form: string): string => {
  switch (form) {
    case '1s':
      return 'yo';
    case '2s':
      return 'tu';
    case '3s':
      return 'ella';
    case '1p':
      return 'nosotros';
    case '2p':
      return 'vosotros';
    case '3p':
      return 'ellas';
  }
  return "Error, form description missing!";
};