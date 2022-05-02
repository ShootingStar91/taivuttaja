import React, { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../reducers/hooks";
import { removeUser, selectUser, setGoal, setUser } from "../../reducers/user";
import { wordListService } from "../../services/wordlists";
import { WordList } from "../../types";
import userService from '../../services/user';
import { showNotification } from "../../reducers/notification";
import { Modal } from "./modal";


export const UserPage = () => {

  const navigate = useNavigate();
  const user = useAppSelector(selectUser);
  const [name, setName] = useState<string>("");
  const [wordLists, setWordLists] = useState<WordList[]>([]);
  const dispatch = useAppDispatch();
  const [dailyGoal, setDailyGoal] = useState<string>("50");
  const [strictAccents, setStrictAccents] = useState<boolean | undefined>(user?.strictAccents);
  const [showModal, setShowModal] = useState<boolean>(false);

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

    const updateDoneWords = async () => {
      if (user && user.token) {
        const [error, result] = await userService.getDoneWords(user.token);
        if (!result) {
          void dispatch(showNotification(error));
          return;
        }
        dispatch(setUser({ ...user, doneWords: result }));
      }
    };

    void getWordLists();
    void updateDoneWords();
  }, []);



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
  /*
    const changePassword = async () => {
      if (!user?.token) {
        void dispatch(showNotification("Error: Invalid user. Try logging in again"));
        return;
      }
      const [error, result] = await userService.changePassword(password, user.token);
      if (!result) {
        void dispatch(showNotification(error));
        return;
      }
      void dispatch(showNotification("Password changed"));
    };
  */

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


  const changeStrictAccents = async () => {
    if (!user || !user.token) {
      return;
    }
    const newStrictAccents = !strictAccents;
    setStrictAccents(!strictAccents);
    const [error, result] = await userService.setStrictAccents(newStrictAccents, user.token);
    if (!result) {
      void dispatch(showNotification(error));
    }
    dispatch(setUser({ ...user, strictAccents: newStrictAccents }));
  };

  if (!user) {
    return <>Error, no login found. Try to login again!</>;
  }


  if (user && user.goal) return (
    <>{showModal && <Modal />}

      <div>
        <div className='flex flex-auto gap-x-8 md:gap-x-20 justify-center'>
          <div className='optioncard'>
            <h3>Daily goal</h3>

            <form onSubmit={onSetDailyGoal}><p>Set daily goal:</p>
              <p><input type="range" min="5" max="100" step="5" onChange={changeDailyGoal} style={{ width: "200px" }}></input> <div className='font-bold'>{dailyGoal}</div></p>
              <p><button className="btn" type='submit'>Save</button></p>
            </form>
          </div>
          <div className='optioncard'>

            <h3 className='mb-4'>Strict accents mode</h3>
            <label htmlFor="default-toggle" className="relative inline-flex items-center mb-4 cursor-pointer">
              <input type="checkbox" value="" id="default-toggle" className="sr-only peer" onClick={changeStrictAccents} checked={strictAccents} />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">{strictAccents ? "On" : "Off"}</span>
            </label>
            <div className='description'>{"If this is on, the app will require 100% correct accents. For example, 'correis' will not be accepted for the word 'corréis'."}</div>
          </div>
        </div>

        <div className='flex flex-auto gap-x-8 md:gap-x-20 justify-center mt-12'>
          <div className='optioncard'>
            <p><button className='btn' type='button' onClick={() => setShowModal(!showModal)}>View practice history</button></p>
            <p className='description'>View how many verbs you have conjugated, and which tenses and moods you have practiced the most.</p>
          </div>

          <div className='optioncard'>

            <h3>Your wordlists</h3>
            {wordLists.length > 0 ?
              wordLists.map((list) => <div key={list.title}>
                {list._id ? <a className='link' href={"wordlist/" + list._id}>{list.title}</a> :
                  list.title}
              </div>)
              : <p>No wordlists found</p>}

            <h3 className="mt-2">New wordlist</h3>
            <form onSubmit={newWordList}><p>Name:</p>
              <p><input className='textField' type="text" onChange={onNameChange}></input></p>
              <p><button className='btn' type='submit'>Create</button></p>
            </form>
          </div>

        </div>
        <div className='flex flex-auto gap-x-8 md:gap-x-20 justify-center mt-8'>

          <div className='optioncard'>
            <p>
              <button className='btn' type='button'>Change password</button>
            </p>
            <p>
              <button className='btn' type='button' onClick={deleteUserButton}>Delete all user data</button>
            </p>
          </div>
        </div>

      </div>
    </>
  );
  
  return null;

};

