import { Word } from "./models/Word";
import { User } from "./models/User";

export interface WordList {
  title: string,
  words: Word[],
  owner: User,
}

export interface StrippedWord {
  english: string,
  spanish: string,
  id: string
}