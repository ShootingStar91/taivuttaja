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
import { InfoBar } from './components/InfoBar';

const App = () => {

  const user = useAppSelector(selectUser);

  const dispatch = useAppDispatch();


  const logout = () => {
    dispatch(removeUser());
    window.localStorage.clear();
  };

  useEffect(() => {
    const loadedUser = userService.checkLogin();
    if (loadedUser) {
      dispatch(setUser(loadedUser));
    }

  }, []);

  useEffect(() => {
    document.getElementsByTagName("body")[0].className = "bg-sky-50";
  }, []);

  const navBarLinkStyle = "float-left hover:text-amber-600";

  return (
    <div className="bg-amber-200 container sm mx-auto rounded-md mt-6 mb-6">
      <BrowserRouter>
        <div className="bg-sky-200 container flex flex-wrap justify-center items-center gap-12 mx-auto h-24 
                        rounded-t-md font-sans text-2xl">
          <Link className={navBarLinkStyle} to="/">Home</Link>
          <Link className={navBarLinkStyle} to="/conjugatestart">Conjugate</Link>
          <Link className={navBarLinkStyle} to="/vocab">Vocab</Link>
          {user && <Link className={navBarLinkStyle} to="/userpage">User page</Link>}
          {!user ? <Link className={navBarLinkStyle} to="/login">Login</Link> :
            <Link className={navBarLinkStyle} to="/" onClick={logout}>Logout</Link>}
        </div>
        <div className="bg-amber-400 container flex flex-wrap justify-center items-center gap-12 mx-auto p-1"><InfoBar /></div>
        <div className="pl-16 pt-12 pr-20 pb-6 flex flex-col space-y-4">
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
