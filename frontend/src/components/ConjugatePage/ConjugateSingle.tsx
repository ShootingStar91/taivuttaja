import React, { useEffect, useState } from "react";
import { wordService } from "../../services/words";
import { Word } from "../../types";

export const ConjugateSingle = () => {
  
  const [word, setWord] = useState<Word | null>(null);

  useEffect(() => {
    wordService.getWord(null, 'en', null, null).then(result => {
      if (!result) {
        console.log("Error getting word");
        return;
      }
      setWord(result);
    }).catch(e => console.log(e));
  }, []);

  if (!word) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h4>{word.infinitive} ({word.infinitive_english}</h4>
    </div>
  );
};