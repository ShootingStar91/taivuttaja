import React, { FormEvent, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { wordListService } from "../../services/wordlists";
import { StrippedWord, WordList } from "../../types";
import { wordService } from "../../services/words";

export const WordListView = () => {

  const { id } = useParams();
  const [wordlist, setWordlist] = useState<WordList | undefined>();
  const [word, setWord] = useState<string>("");
  const [allWords, setAllWords] = useState<StrippedWord[] | undefined>();

  useEffect(() => {
    if (!id) { return; }
    wordListService.getWordList(id).then((data) => {
      setWordlist(data);
    }).catch((error) => console.log(error));

  }, []);

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


  const onWordChange = (event: FormEvent<HTMLInputElement>) => {
    setWord(event.currentTarget.value);
  };  


  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!allWords) { return; }
    if (!wordlist) {
      console.log("Error: Wordlist not found");
      return;
    }
    const wordResult = allWords.find(strippedWord => strippedWord.english.toLowerCase() === word.toLowerCase());
    if (wordResult) {
      setWordlist({ ...wordlist, words: [ ...wordlist.words, wordResult ]});   
    } else {
      console.log("Error fetching word");
    }
  };
  if (!wordlist) {
    return (<div>Wordlist not loaded or found.</div>);
  }
  return (
    <div><h3>Add words to wordlist: {wordlist.title}</h3>
      <form onSubmit={onSubmit}>
        <p><input type="text" onChange={onWordChange}></input></p>
        <p><button type="submit">Add</button></p>
      </form>
      {wordlist.words.map(word => <p key={word.english}>{word}</p>)}

    </div>
  );
};
