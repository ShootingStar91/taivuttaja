import React, { ChangeEvent, useEffect, useState, } from 'react';
import { useAppDispatch, useAppSelector } from '../../reducers/hooks';
import { errorToast, showToast } from '../../reducers/notification';
import { selectUser } from '../../reducers/user';
import { wordListService } from '../../services/wordlists';
import { ConjugateMode, ConjugateSettings, Mood, moodList, MoodSelections, Tense, tenseList, TenseSelections, validCombinations, WordList } from '../../types';
import { AmountOption, MoodTenseSelection, WordListOption } from './ConjugateOptions';


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

  const onChangeAmount = (e: ChangeEvent<HTMLSelectElement>) => {
    const val = parseInt(e.currentTarget?.value);
    if (val) {
      setAmount(val);

    }

  };



  return (
    <div>
      <form>
        <div>
          <MoodTenseSelection {...{ availableTenses, switchMoodSelection, switchTenseSelection, moodSelections, tenseSelections }} />
        </div>
        {user &&
          <>
            {allWordlists && allWordlists.length > 0 ? 
              <WordListOption {...{ allWordlists, setWordlist: (title: string) => setWordlist(title), wordlistId }} /> : 
              <p className='flex justify-center'>No wordlists found. Create wordlists on user page.</p>
            }
          </>
        }
        <div className='flex justify-center mb-6 pt-4'>
          <AmountOption {...{ onChangeAmount, amount }} />
        </div>
        <div>
          <h2 className='flex justify-center'>Begin by choosing mode!</h2>
          <div className="container flex flex-wrap justify-center items-center gap-12 mx-auto p-1">
            <p><button type="button" className='btn'
              onClick={() => onStart(ConjugateMode.Full)}>All forms</button></p>
            <p><button type="button" className='btn'
              onClick={() => onStart(ConjugateMode.Single)}>Single</button></p>
            <p><button type="button" className='btn'
              onClick={() => onStart(ConjugateMode.Flashcard)}>Flashcard</button></p>
          </div>
        </div>
      </form>
    </div>
  );
};
