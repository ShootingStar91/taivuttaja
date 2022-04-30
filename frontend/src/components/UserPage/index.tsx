import React, { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../reducers/hooks";
import { removeUser, selectUser, setGoal, setUser } from "../../reducers/user";
import { wordListService } from "../../services/wordlists";
import { moodList, tenseList, WordList } from "../../types";
import userService from '../../services/user';
import { showNotification } from "../../reducers/notification";

type TableData = {
  form: string,
  count: number
};

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

  const getMoodTableData = () => {
    if (!user) {
      return null;
    }
    const tableData: TableData[] = moodList.map(mood => {
      const count = user.doneWords.filter(dw => dw.word.mood_english === mood).length;
      return { form: mood, count };
    });
    return tableData.sort((a, b) => b.count - a.count);
  };

  const getTenseTableData = () => {
    if (!user) {
      return null;
    }
    const tableData: TableData[] = tenseList.map(tense => {
      const count = user.doneWords.filter(dw => dw.word.tense_english === tense).length;
      return { form: tense, count };
    });
    return tableData.sort((a, b) => b.count - a.count);
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

  const renderTable = (tableData: TableData[] | null) => {
    if (!tableData) {
      return null;
    }
    return (
      tableData.map(data =>
        <tr key={data.form}>
          <td>{data.form}</td>
          <td>
            {data.count}
          </td>
        </tr>
      )
    );
  };

  const setStrictAccents = async (value: boolean) => {
    if (!user || !user.token) {
      return;
    }
    const [error, result] = await userService.setStrictAccents(value, user.token);
    if (!result) {
      void dispatch(showNotification(error));
    }
    dispatch(setUser({ ...user, strictAccents: value }));
    void dispatch(showNotification("Setting changed!"));
  };


  if (!user) {
    return <>Error, no login found. Try to login again!</>;
  }



  const dwDates = user.doneWords.map(dw => new Date(dw.date).getDate());
  const uniqueDates = new Set(dwDates).size.toString();

  const uniqueTenseMoods = new Set(
    user.doneWords.map(dw => dw.word.tense.concat(dw.word.mood))
  ).size;


  return (
    <div>

      <div className='flex flex-auto gap-x-8 md:gap-x-20 justify-center'>
        <div>
          <h3>Daily goal</h3>
          <form onSubmit={onSetDailyGoal}><p>Set daily goal:</p>
            <p><input type="range" min="5" max="100" step="5" onChange={changeDailyGoal} style={{ width: "200px" }}></input> {dailyGoal}</p>
            <p><button className="btn" type='submit'>Save</button></p>
          </form>
        </div>
        <div>
          <h3>Strict accents</h3>
          <p><input type="radio" id="StrictAccentsFalse" name="strict_accents" defaultChecked={!user.strictAccents}
            onChange={() => setStrictAccents(false)} />
            <label htmlFor="strictAccents"> Allow</label></p>
          <p><input type="radio" id="StrictAccentsTrue" name="strict_accents" defaultChecked={user.strictAccents}
            onChange={() => setStrictAccents(true)} />
            <label htmlFor="strictAccents"> Require correct accents</label>
          </p>
        </div>
      </div>

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
      <p>You have conjugated {user?.doneWords.length} words in total, on {uniqueDates} days. Unique combinations of tense/mood: {uniqueTenseMoods}</p>

      <div style={{ padding: 20 }}>
        <table>
          <tbody>
            <tr>
              <th>Mood</th>
              <th></th>
            </tr>
            {renderTable(getMoodTableData())}

          </tbody>
        </table>
      </div>
      <div style={{ padding: 20 }}>

        <table>
          <tbody>

            <tr>
              <th>Tense</th>
              <th></th>
            </tr>
            {renderTable(getTenseTableData())}

          </tbody>
        </table>
      </div>

      <h3>User settings</h3>

      <form><p><input type="password" value={password} onChange={onChangePassword}></input></p>
        <p><button type='button' onClick={changePassword}>Change password</button></p></form>



      <h3>Delete user</h3>
      <button type='button' onClick={deleteUserButton}>Delete all user data</button>


    </div>
  );
};

