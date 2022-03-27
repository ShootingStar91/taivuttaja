import React, { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../reducers/hooks";
import { selectUser } from "../../reducers/user";
import { wordListService } from "../../services/wordlists";
import { WordList } from "../../types";

export const UserPage = () => {
  
  const navigate = useNavigate();
  const user = useAppSelector(selectUser);
  const [name, setName] = useState<string>("");
  const [wordLists, setWordLists] = useState<WordList[]>([]);

  useEffect(() => {
    if (user && user.user && user.user.id) {
      wordListService.getWordLists(user.user.id).then((data) => {
        setWordLists(data);
      })
      .catch((error) => {
        console.log(error);
      });
    }
  }, []);

  const onNameChange = (event: FormEvent<HTMLInputElement>) => {
    setName(event.currentTarget.value);
  };

  const newWordList = async (event: FormEvent) => {
    event.preventDefault();
    console.log(name);
    if (user.user) {
      // Create wordlist (send it to server)
      // Open the wordlist editing page with id gotten from server
      const newWordList: WordList = { title: name, words: [], owner: user.user};
      const result = await wordListService.createWordlist(newWordList);
      const id = result.data as string;
      navigate(`/wordlist/${id}`);
    }
  };

  return (
    <div>
      <h3>Your wordlists</h3>
      {wordLists.length > 0 ? 
        wordLists.map((list) => <div key={list.title}>{list.title}</div>) 
        : <p>No wordlists found</p>}
      <h3>New wordlist</h3>
      <p>        
        <form onSubmit={newWordList}><p>Name: <input type="text" onChange={onNameChange}></input></p>
        <p><button type='submit'>Create</button></p>
</form></p>
      <h3>User settings</h3>
      <p>Email here</p>
      <p>Change password</p>
      <p>Delete all data</p>
    </div>
  );
};
