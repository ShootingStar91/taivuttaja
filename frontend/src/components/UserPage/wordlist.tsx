import React, { FormEvent, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { wordListService } from "../../services/wordlists";
import { StrippedWord, WordList } from "../../types";
import { wordService } from "../../services/words";
import { useAppSelector } from "../../reducers/hooks";
import { selectUser } from "../../reducers/user";
import Select, { SingleValue } from 'react-select';
import { ERRORS } from "../../config";
import { XCircleIcon } from '@heroicons/react/solid';
import { errorToast, successToast } from "../../reducers/toastApi";

type WordOption = {
  label: string,
  value: string
};

export const WordListView = () => {

  const navigate = useNavigate();
  const user = useAppSelector(selectUser);
  const { id } = useParams();
  const [wordlist, setWordlist] = useState<WordList | undefined>();
  const [word, setWord] = useState<WordOption | null>(null);
  const [allWords, setAllWords] = useState<StrippedWord[] | undefined>();

  useEffect(() => {
    if (!user) {
      return;
    }
    const getWordlist = async () => {
      if (!id || !user || !user.token) {
        errorToast(ERRORS.INVALID_LOGIN);
        return;
      }
      const [error, result] = await wordListService.getWordList(id, user.token);
      if (!result) {
        errorToast(error);
        return;
      }
      setWordlist(result);
      console.log("result", result);

    };

    void getWordlist();

  }, [user]);

  useEffect(() => {

    const getStrippedWords = async () => {
      const [error, result] = await wordService.getStrippedWords();
      if (!result) {
        errorToast(error);
        return;
      }
      setAllWords(result);

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

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [error, _] = await wordListService.deleteWordlist(wordlist._id, user.token);
    
    if (error) {
      errorToast(error);
      return;
    }
    successToast("Wordlist deleted successfully");
    navigate('/userpage/');

  };


  const addWord = async (event: FormEvent) => {
    event.preventDefault();
    if (!allWords) { return; }
    if (!wordlist) {
      errorToast("Wordlist not found!");
      return;
    }
    if (word && wordlist._id && user && user.token
      && wordlist.words) {
      const wordToAdd = allWords.find(w => w.infinitive_english === word.value);
      console.log(wordlist);

      if (!wordToAdd) {
        console.log("wordtoadd empty", wordToAdd, word);

        return;
      }
      setWordlist({ ...wordlist, words: [...wordlist.words, wordToAdd] });
      const [error, result] = await wordListService.addWord(word.value, wordlist._id, user.token);
      if (!result) {
        errorToast(error);
        return;
      }
      const newAllWords = allWords.filter(w => w.infinitive_english !== word.value);
      setAllWords(newAllWords);
    }
  };

  const deleteWord = async (wordToDelete: string) => {
    if (!wordlist?._id || !user?.token) { return; }
    const [error, result] = await wordListService.deleteWord(wordToDelete, wordlist?._id, user.token);
    if (!result) {
      errorToast(error);
    }
    setWordlist({ ...wordlist, words: wordlist.words.filter(w => w.infinitive_english !== wordToDelete) });
    // Word should be added back to allWords but ... do we have the strippedword still somewhere
  };

  if (!wordlist || !allWords) {
    return (<div>Wordlist not loaded or found.</div>);
  }
  console.log(wordlist);
  return (
    <div><h3>Add words to wordlist: {wordlist.title}</h3>
      <Select
        id='wordselectfield'
        className="basic-single"
        classNamePrefix="select"
        name="wordField"
        options={allWords.map(w => { return { label: w.infinitive + " | " + w.infinitive_english, value: w.infinitive_english }; })}
        onChange={onChange}
      />

      <p><button id='addwordbutton' className='btn' type="button" onClick={addWord}>Add</button></p>

      {wordlist.words.length > 0 &&
        <div id='words' className='fullcard'>
          {wordlist.words.map(w => 
            <p className='float' key={w.infinitive_english}>
              
              <XCircleIcon id='deleteicon' className='h-5 w-5 inline' onClick={() => deleteWord(w.infinitive_english)} /> <span className='text-amber-500'>{w.infinitive}</span>  {w.infinitive_english} </p>)}
        </div>
      }
      <div>
        <p><button id='deletewordlistbutton' className='btn' type="button" onClick={deleteWordlistButton}>Delete list</button></p>
      </div>
    </div>
  );
};
