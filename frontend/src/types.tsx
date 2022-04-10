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


// An ugly hack until I figure out how to keep these types in just one place and also write a typeguard for them...
export type Tense = 'Present' | 'Imperfect' | 'Preterite' | 'Present Perfect'
  | 'Past Perfect' | 'Future Perfect' | 'Conditional Perfect'
  | 'Future' | 'Preterite (Archaic)' | 'Conditional';

export const tenseList: Tense[] = ['Present', 'Imperfect', 'Preterite', 'Present Perfect', 'Past Perfect', 'Future Perfect', 'Conditional Perfect', 'Future', 'Preterite (Archaic)', 'Conditional'];

export type Mood = 'Indicative' | 'Subjunctive' | 'Imperative Affirmative'
  | 'Imperative Negative';

export const moodList: Mood[] = ['Indicative', 'Subjunctive', 'Imperative Affirmative', 'Imperative Negative'];



export type MoodSelections = Array<{ mood: Mood, selected: boolean }>;
export type TenseSelections = Array<{ tense: Tense, selected: boolean }>;

export type ConjugateSettings = {
  wordlist: WordList | null,
  moodSelections: MoodSelections,
  tenseSelections: TenseSelections
};

