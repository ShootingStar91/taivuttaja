import React, { ChangeEvent } from 'react';
import { moodList, MoodSelections, TenseSelections, Mood, Tense, WordList } from '../../types';
import Select, { SingleValue } from 'react-select';


export const MoodTenseSelection = ({ availableTenses, moodSelections, tenseSelections, switchMoodSelection, switchTenseSelection }:
  { availableTenses: Tense[], moodSelections: MoodSelections, tenseSelections: TenseSelections, switchMoodSelection: (mood: Mood) => void, switchTenseSelection: (tense: Tense) => void }) => {

  return (
    <div className='flex flex-row justify-center gap-x-24'>
      <div>
        <h2>Moods</h2>
        <div className='mt-4 select-none'>
          {moodList.map(mood =>
            <div key={mood}>
              <label>
                <input
                  type='checkbox'
                  checked={moodSelections.find(m => m.mood === mood)?.selected}
                  onChange={() => switchMoodSelection(mood)}
                />
                <span className='pl-1'>
                  {mood}
                </span>

              </label>
            </div>)}
        </div>
      </div>
      <div className='min-w-[25%] min-h-[360px]'>
        <h2>Tenses</h2>
        <div className='mt-4 select-none'>
          {availableTenses.map(tense =>
            <div key={tense}>
              <label>
                <input
                  type='checkbox'
                  checked={tenseSelections.find(t => t.tense === tense)?.selected}
                  onChange={() => switchTenseSelection(tense)}
                />
                <span className='pl-1'>
                  {tense}
                </span>
              </label>
            </div>)}
        </div>
      </div>
    </div>
  );
};

type WordlistOption = {
  label: string | null,
  value?: string // id
};

export const WordListOption = ({ allWordlists, setWordlist, wordlistId }: { allWordlists: WordList[] | null, setWordlist: (title: string) => void, wordlistId: string | null }) => {


  const onWordlistChange = (newValue: SingleValue<WordlistOption>) => {

    if (newValue?.value !== undefined) {
      setWordlist(newValue.value);
    }
  };
  const getOptions = (): { value: string, label: string }[] => {
    if (!allWordlists) return [];
    const list = allWordlists
      .filter(list => list.words.length > 0)
      .map(list => { return { label: list.title, value: list._id ? list._id : '' }; });
    list.push({ label: 'All words', value: '' });
    return list;
  };

  const getValue = () => {
    if (!allWordlists || !wordlistId) {
      return { label: 'All words', value: '' };
    }
    const wl = allWordlists.find(wl => wl._id === wordlistId);
    if (wl && wl._id) {
      return { label: wl.title, value: wl._id };
    }
    return { label: 'All words', value: '' };
  };

  return (
    <div className='pt-6'>
      <h2 className='flex justify-center mb-6'>Select wordlist or include all words</h2>
      <div className=''>
        {allWordlists !== null && allWordlists.length > 0 &&
          <Select
            className='basic-single'
            classNamePrefix='select'
            name='wordField'
            options={getOptions()}
            onChange={onWordlistChange}
            value={getValue()}
          />}
      </div>
    </div>
  );
};

export const AmountOption = ({ onChangeAmount, amount }: { onChangeAmount: (e: ChangeEvent<HTMLSelectElement>) => void, amount: number }) => {
  const amountOptions = [5, 10, 15, 20, 30, 40, 50, 75, 100];

  return (<><h2 className='pr-4'>How many verbs to practice?</h2>
    <select className='bg-white font-bold text-xl' name='amount' onChange={onChangeAmount} value={amount}>
      {amountOptions.map(amt => <option key={amt} value={amt.toString()}>{amt}</option>)}
    </select></>
  );
};