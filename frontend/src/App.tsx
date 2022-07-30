import React, { useEffect } from 'react';
import { IndexPage } from './components/IndexPage';
import { VocabPage } from './components/VocabPage';
import { LoginForm } from './components/UserPage/login';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
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
import { User } from './types';

const App = () => {

  const user = useAppSelector(selectUser);

  const dispatch = useAppDispatch();

  useEffect(() => {
    const loadedUser = userService.checkLogin();
    if (loadedUser) {
      dispatch(setUser(loadedUser));
    } else {
      dispatch(removeUser());
    }

  }, []);

 
  useEffect(() => {
    document.getElementsByTagName('body')[0].className = 'bg-bg-color';
  }, []);

  return (
    <div id='mainContainer' className='mx-auto grid grid-cols-24 grid-rows-24 mt-12 w-[1190px]'>
      <BrowserRouter>
        <Notification />
        <div id='infobar' className='col-start-0 col-end-24 row-start-0 row-end-1 bg-header-color w-[1190px] mb-[2px]'>
          <InfoBar />
        </div>
        <Menu user={user} />
        <div id='contentdiv' className='col-start-11 col-end-24 row-start-1 row-end-24 flex flex-col w-[990px]'>
          <div className='bg-content-color p-2 sm:p-6 ml-[2px]'>
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

const Menu = ({user}: {user: User | undefined}) => {
  const route = useLocation();
  const dispatch = useAppDispatch();

  const linkBaseStyle = 'w-[200px] h-[40px] text-center active:bg-menu-color-active text-menu-font-color hover:cursor-default';
  const navBarLinkClass = linkBaseStyle + " bg-menu-color";
  const navBarLinkCurrent = linkBaseStyle + " bg-menu-color-active";

  const logout = () => {
    dispatch(removeUser());
    window.localStorage.clear();
    successToast('You are now logged out!');
  };


  return (

    <div id='navbar' className='col-start-1 col-end-7 row-start-1 row-end-24 flex flex-col
        md:text-lg lg:text-lg gap-[2px] select-none pointer-events-auto'>
          <Link draggable={false} className={route.pathname === '/' ? navBarLinkCurrent : navBarLinkClass} to='/'>HOME</Link>
          <Link draggable={false} className={route.pathname === '/conjugatestart' ? navBarLinkCurrent : navBarLinkClass} to='/conjugatestart'>CONJUGATE</Link>
          <Link draggable={false} className={route.pathname === '/vocab' ? navBarLinkCurrent : navBarLinkClass} to='/vocab'>VOCAB</Link>
          <Link draggable={false} className={route.pathname === '/verbs' ? navBarLinkCurrent : navBarLinkClass} to='/verbs'>VERBS</Link>
          {user && <Link draggable={false} className={route.pathname === '/userpage' ? navBarLinkCurrent : navBarLinkClass} to='/userpage'>USER PAGE</Link>}
          {!user ? <Link draggable={false} className={route.pathname === '/login' ? navBarLinkCurrent : navBarLinkClass} to='/login'>LOGIN</Link> :
            <Link draggable={false} className={navBarLinkClass} to='/' onClick={logout}>LOGOUT</Link>}
        </div>
  );
};

export default App;
