import React, { useState, FormEvent, KeyboardEvent } from 'react';
import { ERRORS } from '../../config';
import { useAppSelector } from '../../reducers/hooks';
import { errorToast, successToast } from '../../reducers/toastApi';
import { selectUser } from '../../reducers/user';
import userService from '../../services/user';

export const PasswordModal = () => {
  const [currentPass, setCurrentPass] = useState<string>('');
  const [newPass, setNewPass] = useState<string>('');
  const [newPassVerify, setNewPassVerify] = useState<string>('');
  const user = useAppSelector(selectUser);

  const onClickChangePassword = async () => {
    if (!user?.token) {
      errorToast(ERRORS.INVALID_LOGIN);
      return;
    }
    if (newPass === newPassVerify) {
      const [error, result] = await userService.changePassword(currentPass, newPass, user.token);
      if (!result) {
        errorToast(error);
        return;
      }
      successToast('Password changed!');
    } else {
      errorToast('New password wasn\'t same in both fields!');
    }
  };

  const onChangeCurrentPass = (event: FormEvent<HTMLInputElement>) => {
    setCurrentPass(event.currentTarget.value);
  };

  const onChangeNewPass = (event: FormEvent<HTMLInputElement>) => {
    setNewPass(event.currentTarget.value);
  };

  const onChangeNewPassVerify = (event: FormEvent<HTMLInputElement>) => {
    setNewPassVerify(event.currentTarget.value);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      void onClickChangePassword();
    }
  };

  return (
    <div className=''>
      <h2>Change password</h2>
      <p></p>
      <div className='font-bold max-w-[600px]' onKeyDown={onKeyDown}>
        <div className='p-6'><label>Current password</label><input id='currentpasswordfield' className='textField' type='password' value={currentPass} onChange={onChangeCurrentPass}></input></div>
        <div className='p-6'><label>Type new password</label><input id='newpasswordfield1' className='textField' type='password' value={newPass} onChange={onChangeNewPass}></input></div>
        <div className='p-6'><label>Type new password again</label><input id='newpasswordfield2' className='textField' type='password' value={newPassVerify} onChange={onChangeNewPassVerify}></input></div>
      </div>
      <div  className='pt-6 pl-6'><button id='changepasswordbutton' type='button' className='btn' onClick={onClickChangePassword}>Change password</button></div>
    </div>);
};