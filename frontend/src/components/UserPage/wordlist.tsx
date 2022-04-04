import React, { FormEvent, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { wordListService } from "../../services/wordlists";
import { StrippedWord, WordList } from "../../types";
import { wordService } from "../../services/words";
import { useAppSelector } from "../../reducers/hooks";
import { selectUser } from "../../reducers/user";
import Select, { SingleValue } from 'react-select';

export const WordListView = () => {

  const { id } = useParams();
  const [wordlist, setWordlist] = useState<WordList | undefined>();
  const [word, setWord] = useState<StrippedWord | null>(null);
  const [allWords, setAllWords] = useState<StrippedWord[] | undefined>();
  const user = useAppSelector(selectUser);

  useEffect(() => {
    if (!id || !user || !user.token) { return; }
    wordListService.getWordList(id, user.token).then((data) => {
      setWordlist(data);
    }).catch((error) => console.log(error));

  }, [user]);

  useEffect(() => {
    wordService.getStrippedWords().then((data) => {
      if (data) {setAllWords(data);}
      else {
        console.log("Data from getStrippedWords was empty.");
      }
    }).catch((error) => {
      console.log(error);
    });
  }, []);


  const onChange = (newValue: SingleValue<{ value: StrippedWord, label: string }>) => {
    if (!newValue) return;
    setWord(newValue.value);
  };  

  

  const addWord = async (event: FormEvent) => {
    event.preventDefault();
    if (!allWords) { return; }
    if (!wordlist) {
      console.log("Error: Wordlist not found");
      return;
    }
    if (word && wordlist._id && user && user.token
       && !wordlist.words.includes(word.english)) {
      // Here, also add word to wordlist on server
      setWordlist({...wordlist, words: [...wordlist.words, word.english]});
      await wordListService.addWord(word, wordlist._id, user.token);
    }
  };

  const deleteWord = async (wordToDelete: string) => {
    if (!wordlist?._id || !user?.token) { return; }
    await wordListService.deleteWord(wordToDelete, wordlist?._id, user.token);
    setWordlist({...wordlist, words: wordlist.words.filter(w => w === wordToDelete)});
  };

  if (!wordlist || !allWords) {
    return (<div>Wordlist not loaded or found.</div>);
  }
  console.log("wordlist");
  console.log(wordlist);
  
  
  return (
    <div><h3>Add words to wordlist: {wordlist.title}</h3>
      <Select 
        className="basic-single"
        classNamePrefix="select"
        name="wordField"
        options={allWords.map(word => { return { value: word, label: word.english }; })}
        onChange={onChange}
      />
              <p><button type="button" onClick={addWord}>Add</button></p>

      <div>
        {wordlist.words.map(w => <p key={w}><a href="" onClick={() => deleteWord(w)}>Delete</a> | {w}</p>)}
      </div>
    </div>
  );
};
