import React, { useEffect } from 'react';
import './App.css';
import { IndexPage } from './components/IndexPage';
import { VocabPage } from './components/VocabPage';
import { LoginForm } from './components/UserPage/login';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from './reducers/hooks';
import { removeUser, selectUser, setUser } from './reducers/user';
import { UserPage } from './components/UserPage';
import { WordListView } from './components/UserPage/wordlist';
import { ConjugateIndex } from './components/ConjugatePage';
import { Notification } from './components/Notification';
import userService from './services/user';

const App = () => {

  const user = useAppSelector(selectUser);

  const dispatch = useAppDispatch();


  const logout = () => {
    dispatch(removeUser());
  };

  useEffect(() => {
    const loadedUser = userService.checkLogin();
    if (loadedUser) {
      dispatch(setUser(loadedUser));
      
    }

  }, []);
  
  return (
    <div className="mainDiv">
      <BrowserRouter>
        <div className="navbar">
          <Link className="navbarLink" to="/">Home</Link>
          <Link className="navbarLink" to="/conjugatestart">Conjugate</Link>
          <Link className="navbarLink" to="/vocab">Vocab</Link>
          {user && <Link className="navbarLink" to="/userpage">User page</Link>}
          {!user ? <Link className="navbarLink" to="/login">Login</Link> :
            <Link className="navbarLink" to="/" onClick={logout}>Logout</Link>}
        </div>
        {user && <div className="infoBar">Logged in as {user.username}</div>}
        <div className="mainArea">
        <Notification />
          <Routes>
            <Route index element={<IndexPage />} />
            <Route path="conjugatestart" element={<ConjugateIndex />} />
            <Route path="vocab" element={<VocabPage />} />
            <Route path="login" element={<LoginForm />} />
            <Route path="userpage" element={<UserPage />} />
            <Route path="wordlist/:id" element={<WordListView />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
};

export default App;
