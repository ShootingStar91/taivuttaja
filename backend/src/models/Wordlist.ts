import { Schema, model } from 'mongoose';
import { WordList } from '../types';

const wordlistSchema = new Schema<WordList>({
  title: String,
  words: [String],
  owner: Schema.Types.ObjectId
});

export const wordlistModel = model<WordList>('Wordlist', wordlistSchema);
