import React from "react";
import { useAppSelector } from "../../reducers/hooks";
import { selectUser } from "../../reducers/user";
import { moodList, tenseList } from "../../types";

type TableData = {
  form: string,
  count: number
};

export const Modal = () => {

  const user = useAppSelector(selectUser);

  const getMoodTableData = () => {
    if (!user) {
      return null;
    }
    const tableData: TableData[] = moodList.map(mood => {
      const count = user.doneWords.filter(dw => dw.word.mood_english === mood).length;
      return { form: mood, count };
    });
    return tableData.sort((a, b) => b.count - a.count);
  };

  const getTenseTableData = () => {
    if (!user) {
      return null;
    }
    const tableData: TableData[] = tenseList.map(tense => {
      const count = user.doneWords.filter(dw => dw.word.tense_english === tense).length;
      return { form: tense, count };
    });
    return tableData.sort((a, b) => b.count - a.count);
  };

  const renderTable = (tableData: TableData[] | null) => {
    if (!tableData) {
      return null;
    }
    return (
      tableData.map(data =>
        <tr key={data.form}>
          <td>{data.form}</td>
          <td>
            {data.count}
          </td>
        </tr>
      )
    );
  };
  if (!user) {
    return null;
  }
  const dwDates = user.doneWords.map(dw => new Date(dw.date).getDate());
  const uniqueDates = new Set(dwDates).size.toString();

  const uniqueTenseMoods = new Set(
    user.doneWords.map(dw => dw.word.tense.concat(dw.word.mood))
  ).size;

  return (
    <div className='
      bg-white overflow-visible absolute ml-8 top-5 self-center rounded shadow-2xl min-w-[720px] md:w-[960px] z-10
      h-full p-8
    '>
      <div className='m-16'>
      <h2>Practice history</h2>
          <div className=''>

          <p>You have conjugated {user?.doneWords.length} words in total, on {uniqueDates} days.</p>
          <p>Unique combinations of tense/mood: {uniqueTenseMoods}</p>
          <div className='flex flex-auto gap-x-4 md:gap-x-8 mt-8'>

          <div style={{ padding: 20 }}>
            <table>
              <tbody>
                <tr>
                  <th>Mood</th>
                  <th></th>
                </tr>
                {renderTable(getMoodTableData())}

              </tbody>
            </table>
          </div>
          <div className=''>

            <table>
              <tbody>

                <tr>
                  <th>Tense</th>
                  <th></th>
                </tr>
                {renderTable(getTenseTableData())}

              </tbody>
            </table>
          </div>
        </div>
      </div>
      </div>
    </div>
  );

};