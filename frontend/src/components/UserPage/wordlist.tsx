import React, { FormEvent, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { wordListService } from "../../services/wordlists";
import { WordList } from "../../types";
import { wordService } from "../../services/words";
import { useAppDispatch, useAppSelector } from "../../reducers/hooks";
import { selectUser } from "../../reducers/user";
import Select, { SingleValue } from 'react-select';
import { showNotification } from "../../reducers/notification";
import { ERRORS } from "../../config";

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

    const getWordlist = async () => {
      if (!id || !user || !user.token) {
        void dispatch(showNotification(ERRORS.INVALID_LOGIN));
        return;
      }
      const [error, result] = await wordListService.getWordList(id, user.token);
      if (!result) {
        void dispatch(showNotification(error));
        return;
      }
      setWordlist(result);
    };

    void getWordlist();

  }, [user]);

  useEffect(() => {

    const getStrippedWords = async () => {
      const [error, result] = await wordService.getStrippedWords();
      if (!result) {
        void dispatch(showNotification(error));
        return;
      }
      setAllWords(result.map(w => { return { value: w.infinitive_english, label: w.infinitive_english }; }));
    };

    void getStrippedWords();

  }, []);


  const onChange = (newValue: SingleValue<WordOption>) => {
    if (!newValue) return;
    setWord(newValue);
  };

  const deleteWordlistButton = async () => {

    if (!(wordlist?._id && user?.token && confirm('Are you sure you want to permanently delete wordlist?'))) {
      return;
    }

    const [error, result] = await wordListService.deleteWordlist(wordlist._id, user.token);

    if (!result) {
      void dispatch(showNotification(error));
      return;
    }
    void dispatch(showNotification("Wordlist deleted successfully"));
    navigate('/userpage/');

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

      setWordlist({ ...wordlist, words: [...wordlist.words, word.value] });
      const [error, result] = await wordListService.addWord(word.value, wordlist._id, user.token);
      if (!result) {
        void dispatch(showNotification(error));
        return;
      }
      const newAllWords = allWords.filter(w => w.value !== word.value);
      setAllWords(newAllWords);
    }
  };

  const deleteWord = async (wordToDelete: string) => {
    if (!wordlist?._id || !user?.token) { return; }
    const [error, result] = await wordListService.deleteWord(wordToDelete, wordlist?._id, user.token);
    if (!result) {
      void dispatch(showNotification(error));
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
