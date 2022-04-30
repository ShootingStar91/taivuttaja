import React, { useEffect, useState, } from 'react';
import Select, { SingleValue } from 'react-select';
import { useAppDispatch, useAppSelector } from '../../reducers/hooks';
import { showNotification } from '../../reducers/notification';
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
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();

  useEffect(() => {

    const getWordLists = async () => {
      if (!user?.token) {
        return;
      }

      const [error, result] = await wordListService.getWordLists(user.token);
      if (!result) {
        void dispatch(showNotification(error));
        return;
      }
      setAllWordlists(result);
    };

    void getWordLists();

  }, [user]);

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
    console.log(newTenseSelections);
  };

  const onStart = async (mode: ConjugateMode) => {

    if (!tenseSelections.find(s => s.selected) || !moodSelections.find(s => s.selected)) {
      void dispatch(showNotification("Select at least one mood and tense"));
      return;
    }

    let wordlist = null;

    if (user?.token && wordlistId) {
      const [error, result] = await wordListService.getWordList(wordlistId, user.token);

      if (!result) {
        void dispatch(showNotification(error));
        return;
      }
      wordlist = result;
    }

    const settings: ConjugateSettings = {
      tenseSelections,
      moodSelections,
      wordlist,
      mode: mode
    };

    startConjugating(settings);


  };

  const onWordlistChange = (newValue: SingleValue<WordlistOption>) => {
    if (newValue?.value) {
      setWordlist(newValue.value);
    }
  };


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
            {allWordlists !== null ?
              <Select
                className="basic-single"
                classNamePrefix="select"
                name="wordField"
                options={allWordlists.map(list => {
                  return { label: list.title, value: list._id };
                })}
                onChange={onWordlistChange}
              /> :
              <p>No wordlists found. Create wordlists on user page.</p>
            }
          </div>
        </div>}
        <div className='pt-6'>
          <h2 className='flex justify-center'>Begin by choosing mode</h2>
          <div className="container flex flex-wrap justify-center items-center gap-12 mx-auto p-1 ">
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
