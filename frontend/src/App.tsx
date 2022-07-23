import React, { useEffect } from 'react';
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
import { VerbsPage } from './components/VerbsPage';
import { VerbView } from './components/VerbsPage/VerbView';
import { successToast } from './reducers/toastApi';
import { InfoBar } from './components/InfoBar';

const App = () => {

  const user = useAppSelector(selectUser);

  const dispatch = useAppDispatch();


  const logout = () => {
    dispatch(removeUser());
    window.localStorage.clear();
    successToast('You are now logged out!');
  };

  useEffect(() => {
    const loadedUser = userService.checkLogin();
    if (loadedUser) {
      dispatch(setUser(loadedUser));
    } else {
      dispatch(removeUser());
    }

  }, []);

  const navBarLinkClass = "bg-menu-color w-[200px] h-[40px] text-center active:bg-menu-color-active";

  useEffect(() => {
    document.getElementsByTagName('body')[0].className = 'bg-bg-color';
  }, []);

  return (
    <div id='mainContainer' className='mx-auto grid grid-cols-24 grid-rows-24 mt-4 w-[1190px]'>
      <BrowserRouter>
        <Notification />
        <div id='infobar' className='col-start-0 col-end-24 row-start-0 row-end-1 bg-header-color'>
          <InfoBar />
        </div>
        <div id='navbar' className='col-start-1 col-end-7 row-start-2 row-end-24 flex flex-col
        md:text-lg lg:text-lg gap-[2px]'>
          <Link style={{userSelect: 'none'}} className={navBarLinkClass} to='/'>Home</Link>
          <Link className={navBarLinkClass} to='/conjugatestart'>Conjugate</Link>
          <Link className={navBarLinkClass} to='/vocab'>Vocab</Link>
          <Link className={navBarLinkClass} to='/verbs'>Verbs</Link>
          {user && <Link className={navBarLinkClass} to='/userpage'>User page</Link>}
          {!user ? <Link className={navBarLinkClass} to='/login'>Login</Link> :
            <Link className={navBarLinkClass} to='/' onClick={logout}>Logout</Link>}
        </div>
        <div id='contentdiv' className='col-start-11 col-end-24 row-start-2 row-end-24 flex flex-col w-[990px]'>
          <div className='bg-content-color p-2 sm:p-6'>
            <Routes>
              <Route path='conjugatestart' element={<ConjugateIndex />} />
              <Route path='vocab' element={<VocabPage />} />
              <Route path='login' element={<LoginForm />} />
              <Route path='verbs' element={<VerbsPage />} />
              <Route path='userpage' element={<UserPage />} />
              <Route path='wordlist/:id' element={<WordListView />} />
              <Route path='verb/:verb' element={<VerbView />} />
              <Route path='*' element={<IndexPage />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </div>
  );
};

export default App;
