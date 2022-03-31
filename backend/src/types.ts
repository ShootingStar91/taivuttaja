import { User } from "./models/User";

export interface WordList {
  _id: string,
  title: string,
  words: Word[],
  owner: User,
}

export interface StrippedWord {
  english: string,
  spanish: string,
  id: string
}

export type Tense = 'Present' | 'Imperfect' | 'Preterite' | 'Present Perfect'
                    | 'Past Perfect' | 'Future Perfect' | 'Conditional Perfect'
                    | 'Future' | 'Preterite (Archaic)' | 'Conditional';

export type Mood = 'Indicative' | 'Subjunctive' | 'Imperative Affirmative'
                   | 'Imperative Negative';

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
