import React, { useState, } from 'react';
import { ConjugateMode, ConjugateSettings } from '../../types';
import { ConjugateFull } from './ConjugateFull';
import { ConjugateSingle } from './ConjugateSingle';
import { ConjugateStart } from './ConjugateStart';


export const ConjugateIndex = () => {
  
  // stage = 0 if setting up session, or to indicate how many words are conjugated
  const [stage, setStage] = useState<number>(0);
  const [settings, setSettings] = useState<ConjugateSettings | null>(null);

  const startConjugating = (settings: ConjugateSettings) => {
    setSettings(settings);
    setStage(1);
  };

  const next = (max: number) => {
    console.log("max", max);
    console.log("stage:", stage);
    
    if (stage >= max) {
      setStage(0);
    } else {
      setStage(stage + 1);
    }
  };

  const stop = () => {
    setStage(0);
  };

  if (stage === 0 || settings === null) {
    return <ConjugateStart startConjugating={startConjugating} />;
  }

  if (settings.mode === ConjugateMode.Full) {
    return <ConjugateFull settings={settings} next={next} stop={stop} />;
  }
  
  return <ConjugateSingle settings={settings}  next={next} stop={stop} />;
  
  
};
