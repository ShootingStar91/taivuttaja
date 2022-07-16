import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { errorToast } from '../../reducers/toastApi';
import { wordService } from '../../services/words';
import { Word, moodList } from '../../types';
import { EnglishFlag, SpanishFlag } from '../Flags';

export const VerbView = () => {

  const { verb } = useParams();
  const [data, setData] = useState<Word[]>([]);

  useEffect(() => {
    const getVerb = async () => {
      if (!verb) {
        return;
      }
      const [error, result] = await wordService.getVerbDetails(verb);
      if (!result) {
        errorToast('Error getting verb data from server: ');
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
              <tr key={d._id} className='border-b last:border-hidden'>
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


  if (!data || !data[0]) {
    return <div>Loading...</div>;
  }

  return (
    <div className='text-xs -mx-8 -mt-8'>
      <div className='flex auto-flex gap-x-4 -mb-2'>
        <SpanishFlag /> <h2 id='spanishword'>{data[0].infinitive}</h2>
      </div>
      <div className='flex auto-flex gap-x-4 pt-4 min-h-[100px] -mb-4'>
        <EnglishFlag /> <h2>{data[0].infinitive_english}</h2>
      </div>

      {moodList.map((mood) =>
        <div key={mood} className='mb-8'>
          <h2>{mood}</h2>
          <div className='fullcard -ml-2'>
            {getTable(data.filter(d => d.mood_english === mood))}
          </div>
          <p></p>
        </div>)}
    </div>
  );

};
