import React, { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../reducers/hooks";
import { removeUser, selectUser, setGoal } from "../../reducers/user";
import { wordListService } from "../../services/wordlists";
import { WordList } from "../../types";
import userService from '../../services/user';
import { showNotification } from "../../reducers/notification";

export const UserPage = () => {

  const navigate = useNavigate();
  const user = useAppSelector(selectUser);
  const [name, setName] = useState<string>("");
  const [wordLists, setWordLists] = useState<WordList[]>([]);
  const dispatch = useAppDispatch();
  const [dailyGoal, setDailyGoal] = useState<string>("50");
  const [password, setPassword] = useState<string>("");

  useEffect(() => {
    const getWordLists = async () => {
      if (user && user.token) {
        const [error, result] = await wordListService.getWordLists(user.token);

        if (!result) {
          void dispatch(showNotification(error));
          return;
        }
        setWordLists(result);
      }
    };
    void getWordLists();
  }, [user]);

  const onNameChange = (event: FormEvent<HTMLInputElement>) => {
    setName(event.currentTarget.value);
  };

  const deleteUserButton = async () => {
    if (!user?.token) {
      void dispatch(showNotification("Error: Invalid login. Try logging in again"));
      return;
    }
    const answer = confirm("Are you sure you want to delete all your user data? This includes your username, saved progress and all wordlists. This cannot be undone.");
    if (answer) {
      const [error, result] = await userService.deleteUser(user.token);
      if (!result) {
        void dispatch(showNotification(error));
      }
      dispatch(removeUser());
      alert("All user data deleted.");
      navigate('/');
    }
  };

  const onSetDailyGoal = async (event: FormEvent) => {
    event.preventDefault();
    if (!user?.token) {
      void dispatch(showNotification("Error: Invalid user. Try logging in again"));
      return;
    }
    const result = await userService.setGoal(parseInt(dailyGoal), user.token);
    dispatch(setGoal(parseInt(dailyGoal)));
    if (result) {
      void dispatch(showNotification("Daily goal set!"));
    }
  };

  const changeDailyGoal = (event: FormEvent<HTMLInputElement>) => {
    event.preventDefault();
    const newDailyGoal = event.currentTarget.value;
    if (newDailyGoal) {
      setDailyGoal(newDailyGoal);
    }
  };

  const onChangePassword = (event: FormEvent<HTMLInputElement>) => {
    const pw = event.currentTarget.value;
    if (pw) {
      setPassword(pw);
    }
  };

  const changePassword = async () => {
    if (!user?.token) {
      void dispatch(showNotification("Error: Invalid user. Try logging in again"));
      return;
    }
    const [error, result] = await userService.changePassword(password, user.token);
    if (!result) {
      void dispatch(showNotification(error));
    }
    void dispatch(showNotification("Password changed"));
  };

  const newWordList = async (event: FormEvent) => {
    event.preventDefault();
    if (user && user.token) {
      const newWordList: WordList = { title: name, words: [], owner: user };
      const [error, data] = await wordListService.createWordlist(newWordList, user.token);
      if (!data) {
        void dispatch(showNotification(error));
        return;
      }
      const id = data._id as string;
      navigate(`/wordlist/${id}`);
    }
  };

  if (!user) {
    return <>Error, no login found. Try to login again!</>;
  }

  return (
    <div>
      <h3>Daily goal</h3>
      <form onSubmit={onSetDailyGoal}><p>Set daily goal:</p>
        <p><input type="range" min="5" max="100" step="5" onChange={changeDailyGoal} style={{ width: "200px" }}></input> {dailyGoal}</p>
        <p><button type='submit'>Save</button></p>
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
      <h3>User info</h3>
      You have conjugated {user?.doneWords} words in total.
      <h3>User settings</h3>
      <form><p><input type="password" value={password} onChange={onChangePassword}></input></p>
        <p><button type='button' onClick={changePassword}>Change password</button></p></form>
      <h3>Delete user</h3>
      <button type='button' onClick={deleteUserButton}>Delete all user data</button>
    </div>
  );
};

