import React, { ChangeEvent, useEffect, useState, } from 'react';
import Select, { SingleValue } from 'react-select';
import { useAppDispatch, useAppSelector } from '../../reducers/hooks';
import { errorToast, showToast } from '../../reducers/notification';
import { selectUser } from '../../reducers/user';
import { wordListService } from '../../services/wordlists';
import { ConjugateMode, ConjugateSettings, Mood, moodList, MoodSelections, Tense, tenseList, TenseSelections, validCombinations, WordList } from '../../types';

type WordlistOption = {
  label: string | null,
  value?: string // id
};

export const ConjugateStart = ({ startConjugating }: { startConjugating: (settings: ConjugateSettings) => void }) => {

  const initialMoodSelections: MoodSelections = moodList.map((mood) => { return { mood, selected: mood === 'Indicative' ? true : false }; });
  const initialTenseSelections: TenseSelections = tenseList.map((tense) => { return { tense, selected: tense === 'Present' ? true : false }; });

  const [moodSelections, setMoodSelections] = useState<{ mood: Mood, selected: boolean }[]>(initialMoodSelections);
  const [tenseSelections, setTenseSelections] = useState<{ tense: Tense, selected: boolean }[]>(initialTenseSelections);
  const [availableTenses, setAvailableTenses] = useState<Tense[]>(tenseList);
  const [wordlistId, setWordlist] = useState<string | null>(null);
  const [allWordlists, setAllWordlists] = useState<WordList[] | null>(null);
  const [amount, setAmount] = useState<number>(10);
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();

  useEffect(() => {

    const getWordLists = async () => {
      if (!user?.token) {
        return;
      }

      const [error, result] = await wordListService.getWordLists(user.token);
      if (!result) {
        void dispatch(showToast(errorToast(error)));
        return;
      }
      setAllWordlists(result);
      const loadedSettings = loadOldSettings();

      if (loadedSettings && result.filter(wl => wl._id && loadedSettings.wordlist && wl._id === loadedSettings.wordlist._id)) {
        if (loadedSettings?.wordlist?._id && loadedSettings.wordlist.words.length > 0) {
          setWordlist(loadedSettings.wordlist._id);
        }
      }

    };

    if (!user) { loadOldSettings(); }
    void getWordLists();

  }, [user]);

  const loadOldSettings = () => {
    const oldSettingsData = window.localStorage.getItem('conjugateSettings');
    if (oldSettingsData) {
      const loadedSettings = JSON.parse(oldSettingsData) as ConjugateSettings;
      setMoodSelections(loadedSettings.moodSelections);
      setTenseSelections(loadedSettings.tenseSelections);
      setAmount(loadedSettings.amount);
      return loadedSettings;
    }
  };

  const switchMoodSelection = (mood: Mood) => {

    const newMoodSelections = moodSelections.map(m => {
      if (m.mood !== mood) {
        return m;
      }
      m.selected = !m.selected;
      return m;
    });
    setMoodSelections(newMoodSelections);

    const validTenses = tenseList.filter(tense =>
      validCombinations.filter(c => newMoodSelections.filter(sel => sel.selected).map(sel => sel.mood).includes(c.mood)).map(comb => comb.tense).includes(tense)
    );

    setAvailableTenses(validTenses);

    // Remove tense selections that are no longer valid
    const newTenseSelections = tenseSelections.map(s => validTenses.includes(s.tense) ? s : { tense: s.tense, selected: false });
    setTenseSelections(newTenseSelections);
  };

  const switchTenseSelection = (tense: Tense) => {
    const newTenseSelections = tenseSelections.map(t => {
      if (t.tense !== tense) {
        return t;
      }
      t.selected = !t.selected;
      return t;
    });
    setTenseSelections(newTenseSelections);

  };

  const onStart = async (mode: ConjugateMode) => {

    if (!tenseSelections.find(s => s.selected) || !moodSelections.find(s => s.selected)) {
      void dispatch(showToast(errorToast("Select at least one mood and tense")));
      return;
    }

    let wordlist = null;

    if (user?.token && wordlistId) {
      const [error, result] = await wordListService.getWordList(wordlistId, user.token);

      if (!result) {
        void dispatch(showToast(errorToast(error)));
        return;
      }
      wordlist = result;
    }

    const settings: ConjugateSettings = {
      tenseSelections,
      moodSelections,
      wordlist,
      mode: mode,
      amount
    };

    window.localStorage.setItem('conjugateSettings', JSON.stringify(settings));

    startConjugating(settings);

  };

  const onWordlistChange = (newValue: SingleValue<WordlistOption>) => {
    
    if (newValue?.value !== undefined) {
      setWordlist(newValue.value);
    }
  };

  const onChangeAmount = (e: ChangeEvent<HTMLSelectElement>) => {
    const val = parseInt(e.currentTarget?.value);
    if (val) {
      setAmount(val);

    }

  };

  const getOptions = (): {value: string, label: string}[] => {
    if (!allWordlists) return [];
    const list = allWordlists
      .filter(list => list.words.length > 0)
      .map(list => { return { label: list.title, value: list._id ? list._id : '' }; });
    list.push({ label: 'All words', value: ''});
    return list;
  };

  const getValue = () => {
    if (!allWordlists || !wordlistId) {
      return { label: 'All words', value: ''};
    }
    const wl = allWordlists.find(wl => wl._id === wordlistId);
    if (wl && wl._id) {
      return { label: wl.title, value: wl._id };
    }
    return { label: 'All words', value: ''};
  };

  const amountOptions = [5, 10, 15, 20, 30, 40, 50, 75, 100];

  return (
    <div>
      <form>
        <div>
          <div className="flex flex-row justify-center gap-x-24">
            <div>
              <h2>Moods</h2>
              <div className='mt-4 select-none'>
                {moodList.map(mood =>
                  <div key={mood}>
                    <label>
                      <input
                        type="checkbox"
                        checked={moodSelections.find(m => m.mood === mood)?.selected}
                        onChange={() => switchMoodSelection(mood)}
                      />
                      <span className="pl-1">
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
                        type="checkbox"
                        checked={tenseSelections.find(t => t.tense === tense)?.selected}
                        onChange={() => switchTenseSelection(tense)}
                      />
                      <span className="pl-1">
                        {tense}
                      </span>
                    </label>
                  </div>)}
              </div>
            </div>
          </div>
        </div>
        {user && <div className='pt-6'>
          <h2 className='flex justify-center mb-6'>Select wordlist or include all words</h2>
          <div className=''>
            {allWordlists !== null && allWordlists.length > 0 ?
              <Select
                className="basic-single"
                classNamePrefix="select"
                name="wordField"
                options={getOptions()}
                onChange={onWordlistChange}
                value={getValue()}
              /> :
              user && <p className='flex justify-center'>No wordlists found. Create wordlists on user page.</p>
            }
          </div>
        </div>}
        <div className='flex justify-center mb-6 pt-4'>
          <h2 className='pr-4'>How many verbs to practice?</h2>
          <select className='bg-white font-bold text-xl' name='amount' onChange={onChangeAmount} value={amount}>
            {amountOptions.map(amt => <option key={amt} value={amt.toString()}>{amt}</option>)}
          </select>
        </div>
        <div className=''>
          <h2 className='flex justify-center'>Begin by choosing mode!</h2>
          <div className="container flex flex-wrap justify-center items-center gap-12 mx-auto p-1">
            <p><button type="button" className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
              onClick={() => onStart(ConjugateMode.Full)}>All forms</button></p>
            <p><button type="button" className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
              onClick={() => onStart(ConjugateMode.Single)}>Single</button></p>
            <p><button type="button" className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
              onClick={() => onStart(ConjugateMode.Flashcard)}>Flashcard</button></p>
          </div>
        </div>
      </form>
    </div>
  );
};
