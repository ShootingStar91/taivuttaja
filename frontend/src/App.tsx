/* eslint-disable @typescript-eslint/no-unsafe-assignment */
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
import spain_city_flag from './resources/spain-city-flag-cropped-2.jpeg';

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
    document.getElementsByTagName("body")[0].className = "bg-customamber";
  }, []);

  const navBarLinkStyle = "float-left hover:text-yellow-100";

  return (
    <div id='mainContainer' className="bg-amber-200 container sm mx-auto mb-6 max-w-[1024px] rounded-b-lg shadow-lg">
      <BrowserRouter>
        <img src={spain_city_flag}></img>
        <Notification />

        <div className="container flex flex-wrap justify-center items-center sm:gap-4 md:gap-12 mx-auto h-12 
                        rounded-t-md font-sans sm:text-lg md:text-xl lg:text-2xl">
          <Link className={navBarLinkStyle} to="/">Home</Link>
          <Link className={navBarLinkStyle} to="/conjugatestart">Conjugate</Link>
          <Link className={navBarLinkStyle} to="/vocab">Vocab</Link>
          {user && <Link className={navBarLinkStyle} to="/userpage">User page</Link>}
          {!user ? <Link className={navBarLinkStyle} to="/login">Login</Link> :
            <Link className={navBarLinkStyle} to="/" onClick={logout}>Logout</Link>}
        </div>
        <InfoBar />
        <div className="bg-amber-50 pl-4 md:pl-12 pt-12 md:pr-20 pb-6 flex flex-col space-y-4 rounded-b-lg shadow-2xl min-h-[500px]">
          <Routes>
            <Route path="conjugatestart" element={<ConjugateIndex />} />
            <Route path="vocab" element={<VocabPage />} />
            <Route path="login" element={<LoginForm />} />
            <Route path="userpage" element={<UserPage />} />
            <Route path="wordlist/:id" element={<WordListView />} />
            <Route path="*" element={<IndexPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
};

export default App;
