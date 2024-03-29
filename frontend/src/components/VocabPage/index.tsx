import React, { FormEvent, useState, KeyboardEvent } from "react";
import { COLORS } from "../../config";
import { deAccentify } from "../../utils";
import { EnglishFlag, SpanishFlag } from "../Flags";
import { useWord } from "../ConjugatePage/useWord";

export const VocabPage = () => {
  const { word, getWord } = useWord(null);
  const [currentTry, setCurrentTry] = useState<string>("");
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const [timeoutId, setTimeoutId] = useState<number | null>(null);

  const onTry = () => {
    if (showAnswer && timeoutId !== null) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
      goNext();
      return;
    }
    if (!showAnswer) {
      check();
    }
  };

  const check = () => {
    if (word && currentTry.toLowerCase() === word.infinitive.toLowerCase()) {
      void correctAnswer();
    } else {
      const field = document.getElementsByName("attemptField")[0];
      if (
        word &&
        deAccentify(currentTry.toLowerCase()) ===
          deAccentify(word.infinitive.toLowerCase())
      ) {
        field.style.backgroundColor = COLORS.ALMOST_CORRECT;
      } else {
        field.style.backgroundColor = COLORS.WRONG;
      }
      setTimeout(() => {
        field.style.backgroundColor = COLORS.BLANK;
      }, 1000);
    }
  };

  const correctAnswer = () => {
    setShowAnswer(true);
    const field = document.getElementsByName("attemptField")[0];
    field.style.backgroundColor = COLORS.CORRECT;
    const newTimeoutId = window.setTimeout(() => {
      setTimeoutId(null);
      goNext();
    }, 2000);

    setTimeoutId(newTimeoutId);
  };

  const goNext = () => {
    if (timeoutId !== null) {
      window.clearTimeout(timeoutId);
      setTimeoutId(null);
    }
    setShowAnswer(false);
    const field = document.getElementsByName("attemptField")[0];
    void getWord();
    setCurrentTry("");
    field.style.backgroundColor = COLORS.BLANK;
  };

  const handleChange = (event: FormEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;
    if (value !== null) {
      setCurrentTry(value);
    }
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Tab" || event.key === "Enter") {
      event.preventDefault();
      onTry();
    }
  };

  const onClickSkip = () => {
    if (!word) {
      return;
    }
    if (!showAnswer) {
      setShowAnswer(true);
      setCurrentTry(word.infinitive);
      const field = document.getElementsByName("attemptField")[0];
      field.style.backgroundColor = COLORS.SHOWANSWER;
    } else {
      setShowAnswer(false);
      void getWord();
      setCurrentTry("");
      const field = document.getElementsByName("attemptField")[0];
      field.style.backgroundColor = COLORS.BLANK;
    }
  };

  return (
    <div className="p-8" onKeyDown={onKeyDown}>
      <div className="flex auto-flex gap-x-4 pt-4 min-h-[100px]">
        <EnglishFlag /> <h2>{word ? word.infinitive_english : ""}</h2>
      </div>
      <div>
        <div className="flex auto-flex gap-x-4">
          <SpanishFlag />
          <input
            name="attemptField"
            className="textField"
            type="text"
            onChange={showAnswer ? undefined : handleChange}
            value={currentTry}
          />
        </div>
        <div className="flex auto-flex gap-x-4 pt-8">
          <button
            className="btn w-[145px]"
            type="button"
            onClick={() => onTry()}
          >
            Try
          </button>
          <button className="btn w-[145px]" type="button" onClick={onClickSkip}>
            {showAnswer ? "Skip" : "Show"}
          </button>
        </div>
      </div>
    </div>
  );
};
