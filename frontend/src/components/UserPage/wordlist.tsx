import React, { FormEvent, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { wordListService } from "../../services/wordlists";
import { WordList } from "../../types";
import { wordService } from "../../services/words";
import { useAppDispatch, useAppSelector } from "../../reducers/hooks";
import { selectUser } from "../../reducers/user";
import Select, { SingleValue } from 'react-select';
import { showNotification } from "../../reducers/notification";

type WordOption = {
  label: string,
  value: string
};

export const WordListView = () => {

  const navigate = useNavigate();
  const { id } = useParams();
  const [wordlist, setWordlist] = useState<WordList | undefined>();
  const [word, setWord] = useState<WordOption | null>(null);
  const [allWords, setAllWords] = useState<WordOption[] | undefined>();
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!id || !user || !user.token) { return; }
    wordListService.getWordList(id, user.token).then((data) => {
      setWordlist(data);
    }).catch((error: any) => void dispatch(showNotification((error as Error).message)));

  }, [user]);

  useEffect(() => {
    wordService.getStrippedWords().then((data) => {
      if (data) {
        setAllWords(data.map(w => { return { value: w.infinitive_english, label: w.infinitive_english }; }));
      } else {
        void dispatch(showNotification("Error getting words from server"));
      }
    }).catch((error: any) => void dispatch(showNotification((error as Error).message)));
  }, []);


  const onChange = (newValue: SingleValue<WordOption>) => {
    if (!newValue) return;
    setWord(newValue);
  };

  const deleteWordlistButton = () => {

    if (wordlist?._id && user?.token && confirm('Are you sure you want to permanently delete wordlist?')) {
      wordListService.deleteWordlist(wordlist._id, user.token).then((response) => {
        if (response) {
          navigate('/userpage/');
        } else {
          void dispatch(showNotification("Error deleting wordlist"));

        }
      }).catch((error: any) => void dispatch(showNotification((error as Error).message)));
    }
  };


  const addWord = async (event: FormEvent) => {
    event.preventDefault();
    if (!allWords) { return; }
    if (!wordlist) {
      void dispatch(showNotification("Error: Wordlist not found"));
      return;
    }
    if (word && wordlist._id && user && user.token
      && !wordlist.words.includes(word.value)) {

      try {
        // Here, also add word to wordlist on server
        setWordlist({ ...wordlist, words: [...wordlist.words, word.value] });
        await wordListService.addWord(word.value, wordlist._id, user.token);
        const newAllWords = allWords.filter(w => w.value !== word.value);
        setAllWords(newAllWords);
      } catch (e: any) {
        void dispatch(showNotification((e as Error).message));
      }
    }
  };

  const deleteWord = async (wordToDelete: string) => {
    if (!wordlist?._id || !user?.token) { return; }
    try {
      await wordListService.deleteWord(wordToDelete, wordlist?._id, user.token);
    } catch (e: any) {
      void dispatch(showNotification(e.response.data.error as string));
    }
    setWordlist({ ...wordlist, words: wordlist.words.filter(w => w === wordToDelete) });
  };

  if (!wordlist || !allWords) {
    return (<div>Wordlist not loaded or found.</div>);
  }


  return (
    <div><h3>Add words to wordlist: {wordlist.title}</h3>
      <Select
        className="basic-single"
        classNamePrefix="select"
        name="wordField"
        options={allWords}
        onChange={onChange}
      />
      <p><button type="button" onClick={addWord}>Add</button></p>

      <div>
        {wordlist.words.map(w => <p key={w}><a href="" onClick={() => deleteWord(w)}>Delete</a> | {w}</p>)}
      </div>
      <div>
        <button type="button" onClick={deleteWordlistButton}>Delete list</button>
      </div>
    </div>
  );
};
