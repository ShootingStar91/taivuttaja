import { Schema, model } from 'mongoose';
import { DoneWord } from '../types';

const doneWordSchema = new Schema<DoneWord>({
  word: { type: Schema.Types.ObjectId, ref: 'User' },
  date: Date,
  user: Schema.Types.ObjectId
});

export const doneWordModel = model<DoneWord>('Doneword', doneWordSchema);

