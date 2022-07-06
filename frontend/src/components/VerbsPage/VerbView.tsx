import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch } from '../../reducers/hooks';
import { errorToast, showToast } from '../../reducers/notification';
import { wordService } from '../../services/words';
import { Word } from '../../types';

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

  return (
    <div>
      {data.map(d => <div key={d._id}>{d.form_1s} {d.form_2s} {d.form_3s} {d.form_1p} {d.form_2p} {d.form_3p}</div>)}
    </div>);
};