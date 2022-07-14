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
import { InfoBar } from './components/InfoBar';
import { showToast, successToast } from './reducers/notification';
import { VerbsPage } from './components/VerbsPage';
import { VerbView } from './components/VerbsPage/VerbView';

const App = () => {

  const user = useAppSelector(selectUser);

  const dispatch = useAppDispatch();


  const logout = () => {
    dispatch(removeUser());
    window.localStorage.clear();
    void dispatch(showToast(successToast('You are now logged out!')));
  };

  useEffect(() => {
    const loadedUser = userService.checkLogin();
    if (loadedUser) {
      dispatch(setUser(loadedUser));
    }

  }, []);

  const navBarLinkStyle = 'float-left hover:text-white';

  return (
    <div id='mainContainer' className=' container mx-auto max-w-[1024px]'>
      <BrowserRouter>
        <Notification />
        <InfoBar />

        <div id='navbar' className='bg-slate-200 container flex flex-wrap justify-center 
        items-center sm:gap-2 md:gap-8 mx-auto font-sans md:text-lg lg:text-lg min-w-[728px]'>
          <Link className={navBarLinkStyle} to='/'>Home</Link>
          <Link className={navBarLinkStyle} to='/conjugatestart'>Conjugate</Link>
          <Link className={navBarLinkStyle} to='/vocab'>Vocab</Link>
          <Link className={navBarLinkStyle} to='/verbs'>Search</Link>
          {user && <Link className={navBarLinkStyle} to='/userpage'>User page</Link>}
          {!user ? <Link className={navBarLinkStyle} to='/login'>Login</Link> :
            <Link className={navBarLinkStyle} to='/' onClick={logout}>Logout</Link>}
        </div>
        <div id='contentdiv' className='h-full bg-slate-100 pl-4 md:pl-12 pt-12 md:pr-20 
              pb-6 flex flex-col space-y-4 min-h-[500px] max-w-[1024px] min-w-[728px]'>
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
      </BrowserRouter>
    </div>
  );
};

export default App;
