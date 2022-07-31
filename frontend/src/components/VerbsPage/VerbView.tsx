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
        errorToast(error);
        return;
      }
      setData(result);
    };
    void getVerb();
  }, []);


  const getTable = (words: Word[]) => {
    return (
      <table className='-ml-4'>
        <thead>
          <tr className='text-justify'>
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
                <td className='min-w-[120px]'>{d.form_1s || '-'}</td>
                <td className='pl-1 min-w-[120px]'>{d.form_2s || '-'}</td>
                <td className='pl-1 min-w-[120px]'>{d.form_3s || '-'}</td>
                <td className='pl-1 min-w-[120px]'>{d.form_1p || '-'}</td>
                <td className='pl-1 min-w-[120px]'>{d.form_2p || '-'}</td>
                <td className='pl-1 min-w-[120px]'>{d.form_3p || '-'}</td>
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
    <div className='text-xs -ml-2 sm:-ml-4'>
      <div className='flex auto-flex gap-x-2'>
        <SpanishFlag /> <h2 id='spanishword'>{data[0].infinitive}</h2>
      </div>
      <div className='flex auto-flex gap-x-2 pt-2 min-h-[100px]'>
        <EnglishFlag /> <h2>{data[0].infinitive_english}</h2>
      </div>

      {moodList.map((mood) =>
        <div key={mood} className='mb-1'>
          <h2>{mood}</h2>
          <div className='bg-amber-50 pl-6 pt-2 pb-2'>
            {getTable(data.filter(d => d.mood_english === mood))}
          </div>
          <p></p>
        </div>)}
    </div>
  );

};
