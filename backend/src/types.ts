import { User } from './models/User';

import { Request } from 'express';

export interface WordList {
  _id: string,
  title: string,
  words: Word[],
  owner: User,
}


export interface StrippedWordWithId {
  infinitive_english: string,
  infinitive: string,
  id: string
}

export type StrippedWord = Omit<StrippedWordWithId, 'id'>;

export interface FrontendWordlist {
    _id: string,
    title: string,
    words: StrippedWord[],
    owner: User,
}


// An ugly hack until I figure out how to keep these types in just one place and also write a typeguard for them...

export const tenseList = ['Present', 'Imperfect', 'Preterite', 'Present Perfect', 'Past Perfect', 'Future Perfect', 'Conditional Perfect', 'Future', 'Preterite (Archaic)', 'Conditional'];

export type Tense = typeof tenseList[number];

//'Present' | 'Imperfect' | 'Preterite' | 'Present Perfect'
//  | 'Past Perfect' | 'Future Perfect' | 'Conditional Perfect'
//  | 'Future' | 'Preterite (Archaic)' | 'Conditional';

export const moodList = ['Indicative', 'Subjunctive', 'Imperative Affirmative', 'Imperative Negative'];

export type Mood =  typeof moodList[number]; 
//'Indicative' | 'Subjunctive' | 'Imperative Affirmative'  | 'Imperative Negative';

export interface Word {
  infinitive: string;
  infinitive_english: string;
  mood: string;
  mood_english: Mood;
  tense: string;
  tense_english: Tense;
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



export enum Language {
  English = 'en',
  Spanish = 'es'
}

export interface AuthenticatedRequest extends Request {
  user: User;
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export interface DoneWord {
  word: string | Word,
  date: Date,
  user: string,
}
