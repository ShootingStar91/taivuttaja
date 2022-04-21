import React, { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../reducers/hooks";
import { removeUser, selectUser } from "../../reducers/user";
import { wordListService } from "../../services/wordlists";
import { WordList } from "../../types";
import userService from '../../services/user';

export const UserPage = () => {

  const navigate = useNavigate();
  const user = useAppSelector(selectUser);
  const [name, setName] = useState<string>("");
  const [wordLists, setWordLists] = useState<WordList[]>([]);
  const dispatch = useAppDispatch();
  const [dailyGoal, setDailyGoal] = useState<string>();

  useEffect(() => {
    if (user && user.token) {
      wordListService.getWordLists(user.token).then((data) => {
        setWordLists(data);
      })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [user]);

  const onNameChange = (event: FormEvent<HTMLInputElement>) => {
    setName(event.currentTarget.value);
  };

  const deleteUserButton = async () => {
    if (!user?.token) {
      console.log("Error: User null or undefined on user page");
      return;
    }
    const answer = confirm("Are you sure you want to delete all your user data? This includes your username, saved progress and all wordlists. This cannot be undone");
    if (answer) {
      const result = await userService.deleteUser(user.token);
      if (result) {
        dispatch(removeUser());
        alert("All user data deleted.");
        navigate('/');
      }
    }
  };

  const onSetDailyGoal = async (event: FormEvent) => {
    event.preventDefault();
    if (!user?.token || !dailyGoal) {
      return;
    }
    await userService.setDailyGoal(parseInt(dailyGoal), user.token);
  };

  const changeDailyGoal = (event: FormEvent<HTMLInputElement>) => {
    event.preventDefault();
    const newDailyGoal = event.currentTarget.value;
    if (newDailyGoal) {
      setDailyGoal(newDailyGoal);
    }
  };



  const newWordList = async (event: FormEvent) => {
    event.preventDefault();
    console.log(name);
    console.log(user);

    if (user && user.token) {
      const newWordList: WordList = { title: name, words: [], owner: user };
      const result = await wordListService.createWordlist(newWordList, user.token);
      const id = result.data._id as string;
      navigate(`/wordlist/${id}`);
    }
  };


  return (
    <div>
      <h3>Daily goal</h3>
      <form onSubmit={onSetDailyGoal}><p>Set daily goal:</p>
        <p><input type="text" onChange={changeDailyGoal}></input></p>
        <p><button type='submit'>Set</button></p>
      </form>
      <h3>Your wordlists</h3>
      {wordLists.length > 0 ?
        wordLists.map((list) => <div key={list.title}>
          {list._id ? <a href={"wordlist/" + list._id}>{list.title}</a> :
            list.title}
        </div>)
        : <p>No wordlists found</p>}
      <h3>New wordlist</h3>
      <form onSubmit={newWordList}><p>Name:</p>
        <p><input type="text" onChange={onNameChange}></input></p>
        <p><button type='submit'>Create</button></p>
      </form>
      <h3>User settings</h3>
      <button type='button' onClick={deleteUserButton}>Delete all user data</button>
    </div>
  );
};
