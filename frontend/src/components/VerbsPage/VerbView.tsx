import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch } from '../../reducers/hooks';
import { errorToast, showToast } from '../../reducers/notification';
import { wordService } from '../../services/words';
import { Word, moodList } from '../../types';

export const VerbView = () => {

  const { verb } = useParams();
  const [data, setData] = useState<Word[]>([]);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const getVerb = async () => {
      if (!verb) {
        return;
      }
      const [error, result] = await wordService.getVerbDetails(verb);
      if (!result) {
        void dispatch(showToast(errorToast('Error getting verb data from server: ')));
        console.log(error);
        return;
      }
      setData(result);
    };
    void getVerb();
  }, []);

  console.log(data);

  const getTable = (words: Word[]) => {
    return (
      <table className='-ml-4'>
        <thead>
          <tr>
            <th></th>
            <th>Yo</th>
            <th>Tu</th>
            <th>El / Ella</th>
            <th>Nosotros</th>
            <th>Vosotros</th>
            <th>Ellos / Ellas</th>
          </tr>
        </thead>
        <tbody>
          {words.map(d =>
            <React.Fragment key={d._id}>
              <tr>
                <td className='min-w-[150px] justify-start whitespace-nowrap align-center font-bold'>{d.tense}</td>
              </tr>
              <tr key={d._id} className='border-b'>
                <td></td>
                <td className='min-w-[120px]'>{d.form_1s || '---'}</td>
                <td className='pl-2 min-w-[120px]'>{d.form_2s || '---'}</td>
                <td className='pl-2 min-w-[120px]'>{d.form_3s || '---'}</td>
                <td className='pl-2 min-w-[120px]'>{d.form_1p || '---'}</td>
                <td className='pl-2 min-w-[120px]'>{d.form_2p || '---'}</td>
                <td className='pl-2 min-w-[120px]'>{d.form_3p || '---'}</td>
              </tr>
            </React.Fragment>
          )
          }
        </tbody>
      </table>
    );
  };



  return (
    <div className='text-xs -mx-8'>
      {moodList.map((mood) => 
        <div key={mood} >
          <div className='fullcard -ml-2'>
            <h2>{mood}</h2>
            {getTable(data.filter(d => d.mood_english === mood))}
            </div>
          <p></p>
        </div>)}
    </div>
  );

};