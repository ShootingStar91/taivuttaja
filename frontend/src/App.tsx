import React from 'react';
import './App.css';
import { IndexPage } from './components/IndexPage';
import { ConjugatePage } from './components/ConjugatePage';
import { VocabPage } from './components/VocabPage';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

const App = () => {
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
            <Route path="conjugate" element={<ConjugatePage />} />
            <Route path="vocab" element={<VocabPage />} />
        </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
};

export default App;
