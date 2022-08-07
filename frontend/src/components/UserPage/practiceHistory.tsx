import React from "react";
import { moodList, tenseList, User } from "../../types";

type TableData = {
  form: string;
  count: number;
};

const renderTable = (tableData: TableData[] | null) => {
  if (!tableData) {
    return null;
  }
  return tableData.map((data) => (
    <tr key={data.form}>
      <td>{data.form}</td>
      <td className="pl-8">{data.count}</td>
    </tr>
  ));
};

export const getPracticeHistory = (user: User) => {
  const getMoodTableData = () => {
    if (!user) {
      return null;
    }
    const tableData: TableData[] = moodList.map((mood) => {
      const count = user.doneWords.filter(
        (dw) => dw.word.mood_english === mood
      ).length;
      return { form: mood, count };
    });
    return tableData.sort((a, b) => b.count - a.count);
  };

  const getTenseTableData = () => {
    if (!user) {
      return null;
    }
    const tableData: TableData[] = tenseList.map((tense) => {
      const count = user.doneWords.filter(
        (dw) => dw.word.tense_english === tense
      ).length;
      return { form: tense, count };
    });
    return tableData.sort((a, b) => b.count - a.count);
  };

  const dwDates = user.doneWords.map((dw) => new Date(dw.date).getDate());
  const uniqueDates = new Set(dwDates).size.toString();

  const uniqueTenseMoods = new Set(
    user.doneWords.map((dw) => dw.word.tense.concat(dw.word.mood))
  ).size;

  const uniqueVerbs = new Set(
    user.doneWords.map((dw) => dw.word.infinitive_english)
  ).size;
  
  return (
    <div className="container mx-auto">
      <h2>You have ...</h2>
      <div className="">
        <div className="m-4 ml-4">
          <ul>
            <li>
              conjugated a verb{" "}
              <span className="text-amber-400 font-bold">
                {user?.doneWords.length} times
              </span>{" "}
              in total
            </li>
            <li>
              practiced on{" "}
              <span className="text-sky-500 font-bold">
                {uniqueDates} different days
              </span>
            </li>
            <li>
              practiced{" "}
              <span className="text-orange-600 font-bold">
                {uniqueTenseMoods} unique combinations
              </span>{" "}
              of tense / mood
            </li>
            <li>
              practiced{" "}
              <span className="text-blue-500 font-bold">
                {uniqueVerbs} different verbs
              </span>
              !
            </li>
          </ul>
        </div>
        <div className="flex flex-auto gap-x-4 md:gap-x-8 mt-8">
          <div className="tablecard bg-amber-100">
            <table>
              <tbody>
                <tr>
                  <th>Mood</th>
                </tr>
                {renderTable(getMoodTableData())}
              </tbody>
            </table>
          </div>
          <div className="tablecard bg-sky-100">
            <table>
              <tbody>
                <tr>
                  <th>Tense</th>
                </tr>
                {renderTable(getTenseTableData())}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
