import React, { useState } from 'react';
import './App.css';
import { IndexPage } from './components/IndexPage';
import { ConjugatePage } from './components/ConjugatePage';
import { VocabPage } from './components/VocabPage';
import { wordService } from './services/words';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Word } from './types';

const App = () => {

  const [word, setWord] = useState<Word | null>(null);

  const getWord = () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    wordService.getRandomWord().then((response) => {
      console.log("response: ");
      setWord(response);
    }).catch(error => console.log(error));
  };


  return (
    <div className="mainDiv">
      <BrowserRouter>
          <div className="navbar">
            <Link className="navbarLink" to="/">Home</Link>
            <Link className="navbarLink" to="/conjugate">Conjugate</Link>
            <Link className="navbarLink" to="/vocab">Vocab</Link>
          </div>
          <div className="mainArea">
        <Routes>
            <Route index element={<IndexPage />} />
            <Route path="conjugate" element={<ConjugatePage word={word} getWord={getWord}  />} />
            <Route path="vocab" element={<VocabPage word={word} getWord={getWord} />} />
        </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
};

export default App;
