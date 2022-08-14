import React, { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../reducers/hooks";
import { removeUser, selectUser, setUser } from "../../reducers/user";
import { wordListService } from "../../services/wordlists";
import { WordList } from "../../types";
import userService from "../../services/user";
import { FullModal } from "../Modal";
import { ERRORS } from "../../config";
import { PasswordModal } from "./passwordModal";
import { errorToast } from "../../reducers/toastApi";
import { getPracticeHistory } from "./practiceHistory";
import { DailyGoalSetting, StrictAccentSetting } from "./UserPageOptions";

export const UserPage = () => {
  const navigate = useNavigate();
  const user = useAppSelector(selectUser);
  const [name, setName] = useState<string>("");
  const [wordLists, setWordLists] = useState<WordList[]>([]);
  const dispatch = useAppDispatch();
  const [showHistoryModal, setShowHistoryModal] = useState<boolean>(false);
  const [showPasswordModal, setShowPasswordModal] = useState<boolean>(false);
  const [userLoaded, setUserLoaded] = useState<boolean>(false);

  useEffect(() => {
    const getWordLists = async () => {
      if (user && user.token) {
        const result = await wordListService.getWordLists(user.token);

        if (!result) {
          return;
        }

        setWordLists(result);
      }
    };

    const updateDoneWords = async () => {
      if (user && user.token) {
        const result = await userService.getDoneWords(user.token);
        if (result) {
          return;
        }
        dispatch(setUser({ ...user, doneWords: result }));
      }
    };
    void getWordLists();
    void updateDoneWords();
  }, [userLoaded]);

  useEffect(() => {
    if (user) {
      setUserLoaded(true);
    }
  }, [user]);

  const onNameChange = (event: FormEvent<HTMLInputElement>) => {
    setName(event.currentTarget.value);
  };

  const deleteUserButton = async () => {
    if (!user?.token) {
      errorToast(ERRORS.INVALID_LOGIN);
      return;
    }
    const answer = confirm(
      "Are you sure you want to delete all your user data? This includes your username, saved progress and all wordlists. This cannot be undone."
    );
    if (answer) {
      const result = await userService.deleteUser(user.token);
      if (!result) {
        return;
      }
      dispatch(removeUser());
      alert("All user data deleted.");
      navigate("/");
    }
  };

  const newWordList = async (event: FormEvent) => {
    event.preventDefault();
    if (user && user.token) {
      const newWordList: WordList = { title: name, words: [], owner: user };
      const data = await wordListService.createWordlist(
        newWordList,
        user.token
      );
      if (!data) {
        return;
      }
      const id = data._id as string;
      navigate(`/wordlist/${id}`);
    }
  };

  if (!user) {
    return <>Error, no login found. Try to login again!</>;
  }

  if (showHistoryModal) {
    return (
      <>
        <FullModal
          content={getPracticeHistory(user)}
          closeButtonText="Close"
          closeModal={() => setShowHistoryModal(false)}
        />
      </>
    );
  }

  if (showPasswordModal) {
    return (
      <>
        <FullModal
          content={<PasswordModal />}
          closeButtonText="Close"
          closeModal={() => setShowPasswordModal(false)}
        />
        <div className=""></div>
      </>
    );
  }

  if (user)
    return (
      <>
        <div className="divide-y-2 divide-slate-400">
          <div className="mt-2">
            <h1 className="mb-4">User settings</h1>
            <DailyGoalSetting />
          </div>
          <div className="py-4">
            <StrictAccentSetting />
          </div>

          <div className="py-4">
            <h3>Practice history</h3>
            <p>
              <button
                className="userpagebtn"
                type="button"
                onClick={() => {
                  setShowHistoryModal(!showHistoryModal);
                }}
              >
                View practice history
              </button>
            </p>
            <p className="description">
              View how many verbs you have conjugated, and which tenses and
              moods you have practiced the most.
            </p>
          </div>

          <div className="py-4">
            <h3>Wordlists</h3>
            <div id="wordlists" className="max-h-[40%] overflow-auto">
              {wordLists.length > 0 ? (
                <ul className="m-2 ml-4 list-disc">
                  {wordLists.map((list) => (
                    <li key={list.title}>
                      {list._id ? (
                        <a className="link" href={"wordlist/" + list._id}>
                          {list.title}
                        </a>
                      ) : (
                        list.title
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No wordlists found</p>
              )}
            </div>
            <h3 className="mt-2">Create new wordlist</h3>

            <div className="flex gap-2">
              <p>
                <input
                  id="wordlistnamefield"
                  className="textField"
                  type="text"
                  onChange={onNameChange}
                ></input>
              </p>
              <p>
                <button
                  id="createwordlistbutton"
                  className="userpagebtn"
                  type="button"
                  onClick={newWordList}
                >
                  Create
                </button>
              </p>
            </div>
          </div>

          <div className="py-4">
            <h3>Edit user</h3>
            <p>
              <button
                className="userpagebtn w-[200px]"
                type="button"
                onClick={() => setShowPasswordModal(true)}
              >
                Change password
              </button>
            </p>
            <p>
              <button
                className="userpagebtn w-[200px]"
                type="button"
                onClick={deleteUserButton}
              >
                Delete all user data
              </button>
            </p>
          </div>
        </div>
      </>
    );

  return <div>User not found!</div>;
};
