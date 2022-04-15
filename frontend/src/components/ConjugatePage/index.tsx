import React, { useState, } from 'react';
import { ConjugateMode, ConjugateSettings } from '../../types';
import { ConjugatePage } from './ConjugatePage';
import { ConjugateSingle } from './ConjugateSingle';
import { ConjugateStart } from './ConjugateStart';


export const ConjugateIndex = () => {
  
  // stage = 0 if setting up session, or to indicate how many words are conjugated
  const [stage, setStage] = useState<number>(0);
  const [settings, setSettings] = useState<ConjugateSettings | null>(null);

  const startConjugating = (settings: ConjugateSettings) => {
    setSettings(settings);
    setStage(1);
    console.log("moi");
    
  };

  const next = () => {
    if (stage === 10) {
      setStage(0);
    } else {
      setStage(stage + 1);
    }
  };
  console.log(settings);
  
  if (stage === 0 || settings === null) {
    return <ConjugateStart startConjugating={startConjugating} />;
  }

  if (settings.mode === ConjugateMode.Full) {
    return <ConjugatePage settings={settings} next={next} />;
  }
  
  return <ConjugateSingle settings={settings} />;
  
  
};
