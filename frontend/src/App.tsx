import React, { useEffect, useState } from 'react';
import './App.css';
import { IndexPage } from './components/IndexPage';
import { ConjugatePage } from './components/ConjugatePage';
import { VocabPage } from './components/VocabPage';
import { LoginForm } from './components/UserPage/login';
import { wordService } from './services/words';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Word, User } from './types';
import { checkLogin } from './services/user';
import { useAppDispatch } from './reducers/hooks';
import { removeUser, setUser as saveUser } from './reducers/user';
import { UserPage } from './components/UserPage';
import { WordListView } from './components/UserPage/wordlist';

const App = () => {

  const [word, setWord] = useState<Word | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const dispatch = useAppDispatch();
  const getWord = () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    wordService.getRandomWord().then((response) => {
      console.log("response: ");
      setWord(response);
    }).catch(error => console.log(error));
  };

  const logout = () => {
    dispatch(removeUser());
    setUser(null);
  };

  const login = (user: User) => {
    setUser(user);
  };


  useEffect(() => {
    console.log('checking login');
    const loadedLoginData = checkLogin();
    if (loadedLoginData) {
      const token = loadedLoginData.token;
      const loadedUser = loadedLoginData.user;
      console.log('dispatching');
      
      dispatch(saveUser({...loadedUser, token}));
    }
        
  }, []);
  
  console.log('before app return, user: ', user);
  
  return (
    <div className="mainDiv">
      <BrowserRouter>
          <div className="navbar">
            <Link className="navbarLink" to="/">Home</Link>
            <Link className="navbarLink" to="/conjugate">Conjugate</Link>
            <Link className="navbarLink" to="/vocab">Vocab</Link>
            <Link className="navbarLink" to="/userpage">User page</Link>
            {user === null ? <Link className="navbarLink" to="/login">Login</Link> :
                                  <Link className="navbarLink" to="/" onClick={logout}>Logout</Link>}
          </div>
          <div className="mainArea">
        <Routes>
            <Route index element={<IndexPage />} />
            <Route path="conjugate" element={<ConjugatePage word={word} getWord={getWord}  />} />
            <Route path="vocab" element={<VocabPage word={word} getWord={getWord} />} />
            <Route path="login" element={<LoginForm onLogin={login} />} />
            <Route path="userpage" element={<UserPage />} />
            <Route path="wordlist/:id" element={<WordListView />} />
        </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
};

export default App;
