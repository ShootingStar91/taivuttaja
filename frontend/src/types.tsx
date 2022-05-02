export interface Word {
  _id: string;
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
  goal?: number,
  token?: string,
  wordLists?: string[],
  doneWords: DoneWord[],
  doneWordsToday: number,
  strictAccents: boolean,
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

export type MoodTense = {
  mood: Mood,
  tense: Tense,
};

export const validCombinations: MoodTense[] = [{ mood: 'Indicative', tense: 'Present' }, { mood: 'Indicative', tense: 'Imperfect' }, { mood: 'Indicative', tense: 'Preterite' }, { mood: 'Indicative', tense: 'Present Perfect' },
{ mood: 'Indicative', tense: 'Past Perfect' }, { mood: 'Indicative', tense: 'Conditional Perfect' }, { mood: 'Indicative', tense: 'Future Perfect' }, { mood: 'Indicative', tense: 'Preterite (Archaic)' }, { mood: 'Indicative', tense: 'Future' },
{ mood: 'Indicative', tense: 'Conditional' }, { mood: 'Subjunctive', tense: 'Present' }, { mood: 'Subjunctive', tense: 'Imperfect' }, { mood: 'Subjunctive', tense: 'Past Perfect' }, { mood: 'Subjunctive', tense: 'Present Perfect' }, { mood: 'Subjunctive', tense: 'Future Perfect' }
  , { mood: 'Subjunctive', tense: 'Future' }, { mood: 'Imperative Affirmative', tense: 'Present' }, { mood: 'Imperative Negative', tense: 'Present' }];


export type MoodSelections = Array<{ mood: Mood, selected: boolean }>;
export type TenseSelections = Array<{ tense: Tense, selected: boolean }>;

// Modes for conjugation page, single form, flashcard (no typing) or full (type all forms)
export enum ConjugateMode {
  Single,
  Flashcard,
  Full
}

export type ConjugateSettings = {
  wordlist: WordList | null,
  moodSelections: MoodSelections,
  tenseSelections: TenseSelections,
  mode: ConjugateMode
};


export interface DoneWord {
  word: Word,
  date: Date,
  user: string,
}

export enum ToastType {
  OK,
  ERR
}