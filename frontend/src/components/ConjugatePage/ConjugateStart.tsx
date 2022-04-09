import React, { FormEvent, useEffect, useState, } from 'react';
import Select, { SingleValue } from 'react-select';
import { useAppSelector } from '../../reducers/hooks';
import { selectUser } from '../../reducers/user';
import { wordListService } from '../../services/wordlists';
import { ConjugateSettings, Mood, moodList, MoodSelections, Tense, tenseList, TenseSelections, WordList } from '../../types';

type WordlistOption = {
  label: string | null,
  value?: string // id
};

export const ConjugateStart = ({ startConjugating }: {startConjugating: (settings: ConjugateSettings) => void}) => {

  const initialMoodSelections: MoodSelections = moodList.map((mood) => { return { mood, selected: mood === 'Indicative' ? true : false }; });
  const initialTenseSelections: TenseSelections = tenseList.map((tense) => { return { tense, selected: tense === 'Present' ? true : false }; });

  const [moodSelections, setMoodSelections] = useState<{ mood: Mood, selected: boolean }[]>(initialMoodSelections);
  const [tenseSelections, setTenseSelections] = useState<{ tense: Tense, selected: boolean }[]>(initialTenseSelections);
  const [wordlist, setWordlist] = useState<string | null>(null);
  const [allWordlists, setAllWordlists] = useState<WordList[] | null>(null);
  const user = useAppSelector(selectUser);
  

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
    const newMoodSelections = moodSelections.map(m => {
      if (m.mood !== mood) {
        return m;
      }
      m.selected = !m.selected;
      return m;
    });
    setMoodSelections(newMoodSelections);
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

  const onStart = (event: FormEvent) => {
    event.preventDefault();
    
    const settings: ConjugateSettings = {
      tenseSelections,
      moodSelections,
      wordlist
    };

    startConjugating(settings);
    
    
  };

  const onWordlistChange = (newValue: SingleValue<WordlistOption>) => {
    if (newValue?.value) {
      setWordlist(newValue.value);
    }
  };


  return (
    <form onSubmit={onStart}>
      <div>
      <div style={{display: "flex", marginBottom: "50px", fontSize: "20px"}}>
        <div style={{flex: 1}}>
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
        <div style={{flex: 1}}>
          <h4>Tenses</h4>
          {tenseList.map(tense =>
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
      <div>
        <h4>Select wordlist or all words</h4>
        {allWordlists !== null ? 
          <Select 
            className="basic-single"
            classNamePrefix="select"
            name="wordField"
            options={allWordlists.map(list => {
              return {label: list.title, value: list._id};
            })}
            onChange={onWordlistChange}
          /> :
          <p>No wordlists found. Create wordlists on user page.</p>
      }
      </div>
      <div>
        <button type='submit'>Begin</button>
      </div>
    </form>
  );
};
