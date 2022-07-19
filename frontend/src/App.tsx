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
import { VerbsPage } from './components/VerbsPage';
import { VerbView } from './components/VerbsPage/VerbView';
import { SpanishFlag } from './components/Flags';
import { successToast } from './reducers/toastApi';

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

  useEffect(() => {
    document.getElementsByTagName('body')[0].className = 'bg-stone-500';
  }, []);

  const navBarLinkStyle = 'float-left hover:text-amber-500';

  return (
    <div id='mainContainer' className='mt-4 container mx-auto max-w-[960px]'>
      <BrowserRouter>
        <Notification />
        <div className='bg-amber-500 rounded-t-md flex flex-wrap justify-center'>
          <div className='flex auto-flex gap-x-4'>
            <div className='mt-1 -mx-2'><SpanishFlag /></div> <h2>Conjugation app</h2>
          </div>
        </div>
        <div className='bg-slate-300'>
          <InfoBar />
        </div>
        <div className='bg-slate-200'>
          <div className='divide-y-2'>
            <div id='navbar' className='container flex flex-wrap justify-center 
        items-center gap-2 md:gap-4 lg:gap-8 mx-auto md:text-lg lg:text-lg min-w-[728px]'>
              <Link className={navBarLinkStyle} to='/'>Home</Link>
              <Link className={navBarLinkStyle} to='/conjugatestart'>Conjugate</Link>
              <Link className={navBarLinkStyle} to='/vocab'>Vocab</Link>
              <Link className={navBarLinkStyle} to='/verbs'>Verbs</Link>
              {user && <Link className={navBarLinkStyle} to='/userpage'>User page</Link>}
              {!user ? <Link className={navBarLinkStyle} to='/login'>Login</Link> :
                <Link className={navBarLinkStyle} to='/' onClick={logout}>Logout</Link>}
            </div>
          </div>
          <div id='contentdiv' className='overflow-auto h-full bg-slate-200 pl-4 md:pl-8 pt-4 md:pr-4 
              pb-6 flex flex-col'>
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
