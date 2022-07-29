import React, { FormEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../reducers/hooks';
import { removeUser, selectUser, setGoal, setUser } from '../../reducers/user';
import { wordListService } from '../../services/wordlists';
import { moodList, tenseList, WordList } from '../../types';
import userService from '../../services/user';
import { FullModal } from '../Modal';
import { ERRORS } from '../../config';
import { PasswordModal } from './passwordModal';
import { errorToast, successToast } from '../../reducers/toastApi';

type TableData = {
  form: string,
  count: number
};

export const UserPage = () => {

  const navigate = useNavigate();
  const user = useAppSelector(selectUser);
  const [name, setName] = useState<string>('');
  const [wordLists, setWordLists] = useState<WordList[]>([]);
  const dispatch = useAppDispatch();
  const [dailyGoal, setDailyGoal] = useState<string>('50');
  const [strictAccents, setStrictAccents] = useState<boolean | undefined>(user?.strictAccents);
  const [showHistoryModal, setShowHistoryModal] = useState<boolean>(false);
  const [showPasswordModal, setShowPasswordModal] = useState<boolean>(false);
  const [userLoaded, setUserLoaded] = useState<boolean>(false);

  useEffect(() => {

    const getWordLists = async () => {
      if (user && user.token) {
        const [error, result] = await wordListService.getWordLists(user.token);

        if (!result) {
          errorToast(error);
          return;
        }

        setWordLists(result);
      }
    };

    const updateDoneWords = async () => {
      if (user && user.token) {
        const [error, result] = await userService.getDoneWords(user.token);
        if (!result) {
          errorToast(error);
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
    const answer = confirm('Are you sure you want to delete all your user data? This includes your username, saved progress and all wordlists. This cannot be undone.');
    if (answer) {
      const [error, result] = await userService.deleteUser(user.token);
      if (!result) {
        errorToast(error);
      }
      dispatch(removeUser());
      alert('All user data deleted.');
      navigate('/');
    }
  };

  const onSetDailyGoal = async (event: FormEvent) => {
    event.preventDefault();
    if (!user?.token) {
      errorToast(ERRORS.INVALID_LOGIN);
      return;
    }
    const result = await userService.setGoal(parseInt(dailyGoal), user.token);
    dispatch(setGoal(parseInt(dailyGoal)));
    if (result) {
      successToast('Daily goal set!');
    }
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
    if (user && user.token) {
      const newWordList: WordList = { title: name, words: [], owner: user };
      const [error, data] = await wordListService.createWordlist(newWordList, user.token);
      if (!data) {
        errorToast(error);
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
      errorToast(error);
    }
    dispatch(setUser({ ...user, strictAccents: newStrictAccents }));
  };

  if (!user) {
    return <>Error, no login found. Try to login again!</>;
  }

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

  const renderTable = (tableData: TableData[] | null) => {
    if (!tableData) {
      return null;
    }
    return (
      tableData.map(data =>
        <tr key={data.form}>
          <td>{data.form}</td>
          <td className='pl-8'>
            {data.count}
          </td>
        </tr>
      )
    );
  };

  const dwDates = user.doneWords.map(dw => new Date(dw.date).getDate());
  const uniqueDates = new Set(dwDates).size.toString();

  const uniqueTenseMoods = new Set(
    user.doneWords.map(dw => dw.word.tense.concat(dw.word.mood))
  ).size;

  const uniqueVerbs = new Set(user.doneWords.map(dw => dw.word.infinitive_english)).size;

  const getPracticeHistory = () => {
    return (
      <>
        <h2>You have ...</h2>
        <div className=''>
          <div className='m-4 ml-4'>
            <ul>
              <li>conjugated a verb <span className='text-amber-400 font-bold'>{user?.doneWords.length} times</span> in total</li>
              <li>practiced on <span className='text-sky-500 font-bold'>{uniqueDates} different days</span></li>
              <li>practiced <span className='text-orange-600 font-bold'>{uniqueTenseMoods} unique combinations</span> of tense / mood</li>
              <li>practiced <span className='text-blue-500 font-bold'>{uniqueVerbs} different verbs</span>!</li>

            </ul>
          </div>
          <div className='flex flex-auto gap-x-4 md:gap-x-8 mt-8'>

            <div className='tablecard bg-amber-100'>
              <table>
                <tbody>
                  <tr>
                    <th>Mood</th>
                  </tr>
                  {renderTable(getMoodTableData())}
                </tbody>
              </table>
            </div>
            <div className='tablecard bg-sky-100'>
              <table>
                <tbody>

                  <tr>
                    <th>Tense</th>
                  </tr>
                  {renderTable(getTenseTableData())}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </>
    );
  };

  if (showHistoryModal) {
    return <>
      <FullModal content={getPracticeHistory()} closeButtonText='Close' closeModal={() => setShowHistoryModal(false)} />
      <div className=''>
      </div>
    </>;
  }


  if (showPasswordModal) {
    return <>
      <FullModal content={<PasswordModal />} closeButtonText='Close' closeModal={() => setShowPasswordModal(false)} />
      <div className=''>
      </div>
    </>;
  }

  if (user) return (
    <>
      <div>
        <div className='flex flex-auto gap-x-8 md:gap-x-20 justify-center'>

          <div className='optioncard'>
            <h3>Daily goal</h3>
            <p>Set daily goal:</p>
            <p><input id='dailygoalslider' type='range' min='5' max='100' step='5' onChange={changeDailyGoal} style={{ width: '200px' }}></input> <span className='font-bold'>{dailyGoal}</span></p>
            <p><button id='setdailygoal' className='btn' type='button' onClick={onSetDailyGoal}>Save</button></p>
          </div>

          <div className='optioncard'>
            <h3 className='mb-4'>Strict accents mode</h3>
            <label htmlFor='strictaccentmode' className='relative inline-flex items-center mb-4 cursor-pointer'>
              <input id='strictaccentmode' type='checkbox' value='' className='sr-only peer' onChange={changeStrictAccents} checked={strictAccents} />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              <span id='strictaccentonoff' className='ml-3 text-sm font-medium text-gray-900 dark:text-gray-300'>{strictAccents ? 'On' : 'Off'}</span>
            </label>
            <div className='description'>{'If this is on, the app will require 100% correct accents. For example, \'correis\' will not be accepted for the word \'corréis\'.'}</div>
          </div>
        </div>
        <div className='flex flex-auto gap-x-8 md:gap-x-20 justify-center mt-12'>

          <div className='optioncard'>
            <p><button className='btn' type='button' onClick={() => { setShowHistoryModal(!showHistoryModal); window.scroll({ top: 0, left: 0, behavior: 'smooth' }); }}>View practice history</button></p>
            <p className='description'>View how many verbs you have conjugated, and which tenses and moods you have practiced the most.</p>
          </div>

          <div className='optioncard max-h-[500px]'>
            <h3>Your wordlists</h3>
            <div id='wordlists' className='max-h-[40%] overflow-auto'>
              {wordLists.length > 0 ?
                wordLists.map((list) => <div key={list.title}>
                  {list._id ? <a className='link' href={'wordlist/' + list._id}>{list.title}</a> :
                    list.title}
                </div>)
                : <p>No wordlists found</p>}
            </div>
            <h3 className='mt-2'>New wordlist</h3>
            <p>Name:</p>
            <p><input id='wordlistnamefield' className='textField' type='text' onChange={onNameChange}></input></p>
            <p><button className='btn' type='button' onClick={newWordList}>Create</button></p>
          </div>

        </div>
        <div className='flex flex-auto gap-x-8 md:gap-x-20 justify-center mt-8'>

          <div className='optioncard'>
            <p>
              <button className='btn' type='button' onClick={() => setShowPasswordModal(true)}>Change password</button>
            </p>
            <p>
              <button className='btn' type='button' onClick={deleteUserButton}>Delete all user data</button>
            </p>
          </div>

        </div>
      </div>
    </>
  );

return <div>User not found!</div>;

};
