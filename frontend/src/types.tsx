export interface Word {
  infinitive: string;
  infinitive_english: string;
  mood: string;
  mood_english: string;
  tense: string;
  tense_english: string;
  verb__english: string;
  form_1s: string;
  form_2s: string;
  form_3s: string;
  form_1p: string;
  form_2p: string;
  form_3p: string;
  gerund: string;
  gerund_english: string;
  pastparticiple: string;
  pastparticiple_english: string;
}


export interface User {
  username: string,
  id: string,
  token?: string,
  wordLists?: string[],
}


export interface WordList {
  title: string,
  words: string[],
  owner: User,
  _id?: string,
}

export interface StrippedWordOld {
  english: string,
  spanish: string,
  id: string
}

export interface StrippedWord {
  infinitive: string,
  infinitive_english: string
}