import { useState } from "react";
import { wordService } from "../../services/words";
import { ConjugateSettings, Word } from "../../types";
import { getRandomForm } from "../../utils";

export const useWord = (settings: ConjugateSettings) => {
  const [word, setWord] = useState<Word | null>(null);

  const getWord = async () => {
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
    const wordParam = randomWord ? randomWord.infinitive_english : null;
    const result = await wordService.getWord(wordParam, "en", mood, tense);
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

  return {word, getWord};
};
