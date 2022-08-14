import React, { FormEvent, useEffect, useState } from "react";
import { wordService } from "../../services/words";
import { StrippedWord } from "../../types";

export const VerbsPage = () => {
  const [searchText, setSearchText] = useState("");
  const [allWords, setAllWords] = useState<StrippedWord[]>([]);

  useEffect(() => {
    const getStrippedWords = async () => {
      const result = await wordService.getStrippedWords();
      if (!result) {
        return;
      }
      setAllWords(result);
    };

    void getStrippedWords();
  }, []);

  const handleChange = (event: FormEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;
    if (value !== null) {
      setSearchText(value);
    }
  };

  const getResults = () => {
    const allResults = allWords.filter(
      (w) =>
        w.infinitive.includes(searchText) ||
        w.infinitive_english.includes(searchText)
    );

    const results =
      allResults.length <= 20 ? allResults : allResults.slice(0, 20);

    return (
      <>
        <h2>Click on verb to see details</h2>
        <div className="bg-amber-50 p-2">
          {results.map((word) => (
            <div key={word.infinitive}>
              <a href={"verb/" + word.infinitive}>
                {" "}
                <span className="font-bold text-amber-500 hover:text-amber-600">
                  {word.infinitive}
                </span>{" "}
                {word.infinitive_english}{" "}
              </a>
            </div>
          ))}
        </div>
      </>
    );
  };

  return (
    <div>
      <h2>Search for verbs</h2>
      <p></p>
      <input
        className="textField"
        type="text"
        onChange={handleChange}
        value={searchText}
      />
      <p></p>
      {searchText !== "" && getResults()}
    </div>
  );
};
