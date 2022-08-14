import React, { FormEvent, KeyboardEvent, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../reducers/hooks";
import { wordService } from "../../services/words";
import { ConjugateSettings, Word } from "../../types";
import {
  getWordForm,
  getForm,
  getFormDescription,
  forms,
  getRandomForm,
  deAccentify,
} from "../../utils";
import { EnglishFlag, SpanishFlag } from "../Flags";
import userService from "../../services/user";
import { addDoneWord, selectUser } from "../../reducers/user";
import { COLORS } from "../../config";
import { FullModal } from "../Modal";
import { errorToast, successToast } from "../../reducers/toastApi";

export const ConjugateFull = ({
  settings,
  next,
  stop,
}: {
  settings: ConjugateSettings;
  next: (max: number) => void;
  stop: () => void;
}) => {
  const [word, setWord] = useState<Word | null>(null);
  const dispatch = useAppDispatch();
  const [emptyForms, setEmptyForms] = useState<string[]>([]);
  const initialState: { [fieldName: string]: string } = {};
  const user = useAppSelector(selectUser);
  const [showingAnswers, setShowingAnswers] = useState<boolean>(false);
  forms.forEach((form) => (initialState[form] = ""));
  const [formState, setFormState] = useState<{ [fieldName: string]: string }>({
    ...initialState,
  });

  useEffect(() => {
    if (!word) {
      void getWord();
    }
  }, []);

  useEffect(() => {
    // Check which forms are an empty string. Make those green and blocked from typing
    if (!word) return;
    const newEmptyForms: string[] = [];
    forms.forEach((form) => {
      if (getWordForm(word, form) === "") {
        document.getElementsByName(form)[0].style.backgroundColor =
          COLORS.BLOCKED;
        newEmptyForms.push(form);
      }
    });

    setEmptyForms(newEmptyForms);
  }, [word]);

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
    const result = await wordService.getWord(
      wordParam,
      "en",
      mood,
      tense
    );
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
  };

  const resetFormColors = () => {
    forms.forEach(
      (form) =>
        (document.getElementsByName(form)[0].style.backgroundColor =
          COLORS.BLANK)
    );
  };

  const handleChange = (event: FormEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;
    if (value !== null) {
      setFormState({ ...formState, [event.currentTarget.name]: value });
    }
  };

  const onTry = async (nextField: boolean) => {
    const activeField = document.activeElement?.getAttribute("id");
    if (activeField !== undefined && activeField !== null && nextField) {
      const activeId = parseInt(activeField);
      if (activeId < 5 - emptyForms.length) {
        const nextField = document.getElementById((activeId + 1).toString());
        nextField?.focus();
      }
    }

    if (word === null) {
      return;
    }
    let accentMistakes = false;
    let all_correct = true;
    forms.forEach((form) => {
      const attempt = formState[form];
      const correct = getWordForm(word, form);
      if (!correct) {
        return;
      }
      if (attempt === correct) {
        const color = attempt === "" ? COLORS.BLANK : COLORS.CORRECT;
        document.getElementsByName(form)[0].style.backgroundColor = color;
      } else {
        if (
          user &&
          !user.strictAccents &&
          deAccentify(attempt) === deAccentify(correct)
        ) {
          // Some accents were wrong but word otherwise correct
          document.getElementsByName(form)[0].style.backgroundColor =
            COLORS.ALMOST_CORRECT;
          accentMistakes = true;
        } else {
          // Wrong answer
          const color = formState[form] === "" ? COLORS.BLANK : COLORS.WRONG;
          all_correct = false;
          document.getElementsByName(form)[0].style.backgroundColor = color;
        }
      }
    });

    if (all_correct) {
      const message = accentMistakes
        ? "All correct, but remember the accents!"
        : "¡Todo correcto!";
      setShowingAnswers(true);
      successToast(message);
      if (user?.token) {
        const result = await userService.addDoneWord(
          word._id,
          user.token
        );
        if (result) {
          dispatch(addDoneWord());
        }
        
      }
    }
  };

  const goNext = () => {
    setFormState({ ...initialState });
    void getWord();
    resetFormColors();
    const nextField = document.getElementById("0");
    nextField?.focus();
    next(settings.amount);
  };

  const onKeyDown = async (e: KeyboardEvent<HTMLFormElement>) => {
    if (e.key === "Tab" || e.key === "Enter") {
      const activeField = document.activeElement?.getAttribute("id");
      if (activeField === null || activeField === undefined) {
        return;
      }
      if (e.key === "Enter" && activeField !== "5") {
        const nextField = parseInt(activeField) + 1;
        document.getElementById(nextField.toString())?.focus();
      }

      if (
        activeField === "5" &&
        !e.shiftKey
      ) {
        e.preventDefault();
        if (showingAnswers) {
          setShowingAnswers(false);
          e.preventDefault();
          goNext();
          return;
        }
  
      }
      await onTry(false);
    }
  };

  const onSkip = async () => {
    if (!word) {
      errorToast("Unexpected error!");
      return;
    }
    if (!showingAnswers) {
      setShowingAnswers(true);
      const newFormState = { ...initialState };
      forms.forEach((f) => {
        const answer = getWordForm(word, f);
        newFormState[f] = answer !== undefined ? answer : "";
        setFormState({ ...newFormState });
        document
          .getElementsByName(f)
          .forEach((element) => element.setAttribute("disabled", "true"));
        document.getElementsByName(f)[0].style.backgroundColor =
          COLORS.SHOWANSWER;
      });
    } else {
      forms.forEach((f) =>
        document
          .getElementsByName(f)
          .forEach((element) => element.removeAttribute("disabled"))
      );

      setShowingAnswers(false);
      setFormState({ ...initialState });
      await getWord();
      resetFormColors();
      next(settings.amount);
    }
  };

  if (word === null) {
    return <div>Loading...</div>;
  }

  const getContent = () => {
    return (
      <div className="md:pl-12">
        <div className="flex auto-flex gap-x-4">
          <SpanishFlag /> <h2>{word.infinitive}</h2>
        </div>
        <div className="flex auto-flex gap-x-4 pt-4">
          <EnglishFlag /> <h2>{word.infinitive_english}</h2>
        </div>
        <div className="mt-4 flex auto-flex gap-x-4">
          <h2 className="text-amber-600">{word.mood_english}</h2>
          <h2 className="text-sky-400">{word.tense_english.toLowerCase()}</h2>
        </div>
        <div className="mt-8">
          <form autoComplete="off" onKeyDown={onKeyDown}>
            <table>
              <tbody>
                {forms.map((form, index) => (
                  <React.Fragment key={form}>
                    <tr key={form}>
                      <td>
                        <input
                          className="textField"
                          type="text"
                          id={index.toString()}
                          name={form}
                          onChange={
                            emptyForms.includes(form) ? undefined : handleChange
                          }
                          value={formState[form]}
                          disabled={
                            emptyForms.includes(form) ? true : undefined
                          }
                        />
                      </td>
                      <td>
                        <div className="ml-8 min-h-[80px]">
                          <h3>{getForm(form)}</h3>
                          <div className="description">
                            {getFormDescription(form)}
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr></tr>
                    <tr></tr>
                    <tr></tr>
                  </React.Fragment>
                ))}
              </tbody>
            </table>
            <div className="flex gap-x-8 mt-8">
              <button
                className="btn w-[220px]"
                type="button"
                disabled={showingAnswers}
              >
                Try
              </button>
              <button className="w-[220px] btn" type="button" onClick={onSkip}>
                {showingAnswers ? "Next" : "Show answers"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };
  return (
    <FullModal
      content={getContent()}
      closeButtonText="Stop practice"
      closeModal={() => stop()}
    />
  );
};
