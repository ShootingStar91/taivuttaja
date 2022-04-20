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
    if (!user?.token) {
      return;
    }
    wordListService.getWordLists(user.token).then((result) => {
      setAllWordlists(result);
    }).catch((err) => {
      console.log("Could not load wordlists:");
      console.log(err);
    });

  }, [user]);

  const switchMoodSelection = (mood: Mood) => {
    console.log("switched");
    
    const newMoodSelections = moodSelections.map(m => {
      if (m.mood !== mood) {
        return m;
      }
      m.selected = !m.selected;
      return m;
    });
    setMoodSelections(newMoodSelections);
    
    const validTenses = tenseList.filter( tense => 
                                        validCombinations.filter(c => newMoodSelections.filter(sel => sel.selected).map(sel => sel.mood).includes(c.mood)).map(comb => comb.tense).includes(tense)
                                        );
    
    setAvailableTenses(validTenses);
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
    console.log(user);

    if (!tenseSelections.find(s => s.selected) || !moodSelections.find(s => s.selected)) {
      void dispatch(showNotification("Select at least one mood and tense"));
      return;
    }

    if (!user?.token) {
      return;
    }

    let wordlist = null;

    if (wordlistId) {
      wordlist = await wordListService.getWordList(wordlistId, user.token);

      if (!wordlist) {
        console.log("Error fetching wordlist");
        return;
      }
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
    <form>
      <div>
        <div style={{ display: "flex", marginBottom: "50px", fontSize: "20px" }}>
          <div style={{ flex: 1 }}>
            <h4>Moods</h4>
            {moodList.map(mood =>
              <div key={mood}>
                <label>
                  <input
                    type="checkbox"
                    checked={moodSelections.find(m => m.mood === mood)?.selected}
                    onChange={() => switchMoodSelection(mood)}
                  />
                  {mood}
                </label>
              </div>)}
          </div>
          <div style={{ flex: 1 }}>
            <h4>Tenses</h4>
            {availableTenses.map(tense =>
              <div key={tense}>
                <label>
                  <input
                    type="checkbox"
                    checked={tenseSelections.find(t => t.tense === tense)?.selected}
                    onChange={() => switchTenseSelection(tense)}
                  />
                  {tense}
                </label>
              </div>)}
          </div>
        </div>
      </div>
      {user && <div>
        <h4>Select wordlist or all words</h4>
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
      </div>}
      <h4>Begin by choosing mode</h4>
      <div>
        <p><button type="button" onClick={() => onStart(ConjugateMode.Full)}>All forms</button></p>
        <p><button type="button" onClick={() => onStart(ConjugateMode.Single)}>Single</button></p>
        <p><button type="button" onClick={() => onStart(ConjugateMode.Flashcard)}>Flashcard</button></p>
      </div>
    </form>
  );
};
