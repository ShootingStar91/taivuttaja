import React, { FormEvent, useEffect, useState, KeyboardEvent } from "react";
import { COLORS } from "../../config";
import { useAppSelector } from "../../reducers/hooks";
import { errorToast } from "../../reducers/toastApi";
import { selectUser } from "../../reducers/user";
import { ConjugateMode, ConjugateSettings } from "../../types";
import {
  deAccentify,
  forms,
  getForm,
  getFormDescription,
  getWordForm,
} from "../../utils";
import { EnglishFlag, SpanishFlag } from "../Flags";
import { FullModal } from "../Modal";
import { useWord } from "./useWord";

export const ConjugateSingle = ({
  settings,
  next,
  stop,
}: {
  settings: ConjugateSettings;
  next: (max: number) => void;
  stop: () => void;
}) => {
  const { word, getWord } = useWord(settings);
  const [answer, setAnswer] = useState<string | null>(null);
  const [form, setForm] = useState<string | null>(null);
  const [attempt, setAttempt] = useState<string>("");
  const [showingCorrect, setShowingCorrect] = useState<boolean>(false);
  const [correctAnswers, setCorrectAnswers] = useState<number>(0);

  const user = useAppSelector(selectUser);

  useEffect(() => {
    void newWord();
    // Can create unmounted error
  }, []);

  const newWord = async () => {
    const result = await getWord();
    if (!result) {
      return;
    }
    // Random a form only from those that are not empty
    const validForms = forms.filter((f) => getWordForm(result, f) !== "");
    const randomedForm =
      validForms[Math.floor(Math.random() * validForms.length)];
    setForm(randomedForm);
    const rightAnswer = getWordForm(result, randomedForm);
    if (rightAnswer) {
      setAnswer(rightAnswer);
      console.log("Correct answer: ", rightAnswer);
    }
  };

  const onChange = (event: FormEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;
    if (value !== null) {
      setAttempt(value);
    }
  };

  const onKeyDown = (event: KeyboardEvent<HTMLFormElement>) => {
    if (event.key === "Tab" || event.key === "Enter") {
      event.preventDefault();
      onTry();
    }
  };

  const onTry = () => {
    if (showingCorrect) {
      goNext();
      return;
    }
    if (!answer) {
      errorToast("Invalid word data");
      return;
    }

    if (attempt.toLowerCase() === answer.toLowerCase()) {
      void correctAnswer();
    } else {
      if (
        user &&
        !user.strictAccents &&
        deAccentify(attempt.toLowerCase()) === deAccentify(answer.toLowerCase())
      ) {
        void correctAnswer();
        return;
      }
      const field = document.getElementsByName("attemptField")[0];
      field.style.backgroundColor = COLORS.WRONG;

      setTimeout(() => {
        field.style.backgroundColor = COLORS.BLANK;
      }, 1000);
    }
  };

  const correctAnswer = () => {
    if (!answer) return;

    setShowingCorrect(true);
    const field = document.getElementsByName("attemptField")[0];
    field.style.backgroundColor = COLORS.CORRECT;
    setCorrectAnswers(correctAnswers + 1);
  };

  const goNext = () => {
    setShowingCorrect(false);
    const field = document.getElementsByName("attemptField")[0];
    void newWord();
    setAttempt("");
    next(settings.amount);
    field.style.backgroundColor = COLORS.BLANK;
  };

  const onClickSkip = () => {
    if (!word || !answer) {
      return;
    }

    if (settings.mode === ConjugateMode.Flashcard) {
      if (!showingCorrect) {
        setShowingCorrect(true);
      } else {
        setShowingCorrect(false);
        void newWord();
      }
      return;
    }

    const field = document.getElementsByName("attemptField")[0];

    if (!showingCorrect) {
      setShowingCorrect(true);
      setAttempt(answer);
      field.style.backgroundColor = COLORS.SHOWANSWER;
    } else {
      field.style.backgroundColor = COLORS.BLANK;
      setShowingCorrect(false);
      void newWord();
      setAttempt("");
      next(settings.amount);
    }
  };

  if (!word || !answer || !form) {
    return <div>Word loading...</div>;
  }

  const getContent = (mode: ConjugateMode) => {
    const getFlashcardPart = () => {
      if (showingCorrect) {
        return <h1 className="text-center mb-8">{answer}</h1>;
      }
      return <h1 className="text-center mb-8">_____</h1>;
    };

    return (
      <div className="grid justify-items-center">
        <div className="flex auto-flex gap-x-4">
          <SpanishFlag /> <h2 id="spanishword">{word.infinitive}</h2>
        </div>
        <div className="flex auto-flex gap-x-4 pt-4 min-h-[100px]">
          <EnglishFlag /> <h2>{word.infinitive_english}</h2>
        </div>
        <div className="mt-4 flex auto-flex gap-x-4">
          <h2 id="tense" className="text-amber-600">
            {word.tense_english}
          </h2>
          <h2 id="mood" className="text-sky-400">
            {word.mood_english.toLowerCase()}
          </h2>
        </div>
        <h2 id="personform" className="mt-4 text-orange-500">
          {getForm(form)}
        </h2>
        <span className="description">{getFormDescription(form)}</span>
        <div className="mt-8">
          {mode === ConjugateMode.Single && (
            <>
              <form onKeyDown={onKeyDown}>
                <div className={"rounded-lg"}>
                  <input
                    id="answerfield"
                    className={"textField w-[300px]"}
                    name="attemptField"
                    type="text"
                    onChange={onChange}
                    value={showingCorrect ? answer : attempt}
                    autoComplete="off"
                  ></input>
                </div>
              </form>
              <p>
                {!showingCorrect && (
                  <button
                    className="btn w-[300px]"
                    type="button"
                    onClick={onTry}
                  >
                    {showingCorrect ? "Next" : "Try"}
                  </button>
                )}
              </p>
            </>
          )}
          {mode === ConjugateMode.Flashcard && getFlashcardPart()}
          <button className="btn w-[300px]" type="button" onClick={onClickSkip}>
            {showingCorrect ? "Next" : "Show"}
          </button>

          <div id="correctanswers" style={{ display: "none" }}>
            {correctAnswers}
          </div>
        </div>
      </div>
    );
  };

  return (
    <FullModal
      content={getContent(settings.mode)}
      closeButtonText="Stop practice"
      closeModal={() => stop()}
    />
  );
};
