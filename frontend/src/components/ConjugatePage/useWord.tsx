import { useState, useEffect } from "react";
import { wordService } from "../../services/words";
import { ConjugateSettings, Word } from "../../types";
import { getRandomForm } from "../../utils";

export const useWord = (settings: ConjugateSettings | null) => {
  const [word, setWord] = useState<Word | null>(null);

  useEffect(() => {
    void getWord();
  }, []);

  const getWord = async () => {
    console.log({ settings });
    if (!settings) {
      const result = await wordService.getRandomWord("Indicative", "Present");

      if (result) {
        setWord(result);
      }
      return result;
    }
    const { tense, mood } = getRandomForm(
      settings.tenseSelections,
      settings.moodSelections
    );

    // If wordlist exist, random a word from there
    const randomWord =
      settings.wordlist === null
        ? null
        : settings.wordlist.words[
            Math.floor(Math.random() * settings.wordlist.words.length)
          ];
    const word = randomWord ? randomWord.infinitive_english : null;

    if (!word) {
      const result = await wordService.getRandomWord(mood, tense);
      if (result) {
        setWord(result);
      }
      return result;
    }

    const result = await wordService.getWord(word, "en", mood, tense);

    if (!result) {
      return;
    }
    console.log("Correct answers: ");
    console.log(result.form_1s);
    console.log(result.form_2s);
    console.log(result.form_3s);
    console.log(result.form_1p);
    console.log(result.form_2p);
    console.log(result.form_3p);
    setWord(result);
    return result;
  };

  return { word, getWord };
};
