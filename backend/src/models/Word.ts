import { Schema, model } from 'mongoose';
import { Word } from '../types';

const wordSchema = new Schema<Word>({
  infinitive: { type: String, required: true },
  infinitive_english: { type: String , required: true },
  mood: { type: String , required: true },
  mood_english: { type: String , required: true },
  tense: { type: String , required: true },
  tense_english: { type: String , required: true },
  verb__english: { type: String , required: true },
  form_1s: { type: String, required: true },
  form_2s: { type: String, required: true },
  form_3s: { type: String, required: true },
  form_1p: { type: String, required: true },
  form_2p: { type: String, required: true },
  form_3p: { type: String, required: true },
  gerund: { type: String, required: true },
  gerund_english: { type: String, required: true },
  pastparticiple: { type: String, required: true },
  pastparticiple_english: { type: String, required: true },
}, { collection: 'jehle_verb_mongo'});

export const wordModel = model<Word>('Word', wordSchema);
