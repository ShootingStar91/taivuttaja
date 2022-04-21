import React, { FormEvent, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { wordListService } from "../../services/wordlists";
import { WordList } from "../../types";
import { wordService } from "../../services/words";
import { useAppSelector } from "../../reducers/hooks";
import { selectUser } from "../../reducers/user";
import Select, { SingleValue } from 'react-select';

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

  useEffect(() => {
    if (!id || !user || !user.token) { return; }
    wordListService.getWordList(id, user.token).then((data) => {
      setWordlist(data);
    }).catch((error) => console.log(error));

  }, [user]);

  useEffect(() => {
    wordService.getStrippedWords().then((data) => {
      if (data) { 
        setAllWords(data.map(w => { return { value: w.infinitive_english, label: w.infinitive_english }; }));
      } else {
        console.log("Data from getStrippedWords was empty.");
      }
    }).catch((error) => {
      console.log(error);
    });
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
          console.log("Error deleting wordlist");
          
        }
      }).catch((e) => console.log(e));
    }
  };


  const addWord = async (event: FormEvent) => {
    event.preventDefault();
    if (!allWords) { return; }
    if (!wordlist) {
      console.log("Error: Wordlist not found");
      return;
    }
    if (word && wordlist._id && user && user.token
      && !wordlist.words.includes(word.value)) {
        
      // Here, also add word to wordlist on server
      setWordlist({ ...wordlist, words: [...wordlist.words, word.value] });
      await wordListService.addWord(word.value, wordlist._id, user.token);
      const newAllWords = allWords.filter(w => w.value !== word.value);
      setAllWords(newAllWords);
      
    }
  };

  const deleteWord = async (wordToDelete: string) => {
    if (!wordlist?._id || !user?.token) { return; }
    await wordListService.deleteWord(wordToDelete, wordlist?._id, user.token);
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
