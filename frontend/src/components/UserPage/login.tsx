import React, { FormEvent, useState } from "react";
import userService from "../../services/user";
import { useNavigate } from "react-router-dom";
import { setUser } from "../../reducers/user";
import { useAppDispatch } from "../../reducers/hooks";
import { errorToast, showToast, successToast } from "../../reducers/notification";

export const LoginForm = () => {

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const tryLogin = async (event: FormEvent) => {
    event.preventDefault();
    const [error, user] = await userService.tryLogin(username, password);

    if (!user) {
      void dispatch(showToast(errorToast(error)));
      return;
    }
    void dispatch(showToast(successToast("Login successful!")));
    window.localStorage.setItem('loggedUser', JSON.stringify(user));
    dispatch(setUser({ ...user }));
    navigate('/userpage');

  };

  const tryNewUser = async () => {
    const [userError, result] = await userService.createUser(username, password);
    if (!result) {
      void dispatch(showToast(errorToast(userError)));
      return;
    }

    const [error, user] = await userService.tryLogin(username, password);

    if (!user) {
      void dispatch(showToast(errorToast(error)));
      return;
    }

    window.localStorage.setItem('loggedUser', JSON.stringify(user));
    dispatch(setUser({ ...user }));
    navigate('/userpage');

  };

  const handlePasswordChange = (event: FormEvent<HTMLInputElement>) => {
    setPassword(event.currentTarget.value);
  };

  const handleUsernameChange = (event: FormEvent<HTMLInputElement>) => {
    setUsername(event.currentTarget.value);
  };

  return (
    <div className="container flex justify-center">
      <form onSubmit={tryLogin}>
        <div className='container flex flex-col justify-center'>
          <h2>Username</h2>
            <p>
              <input type='text' onChange={handleUsernameChange} value={username}
              className='textField'></input></p>
          <h2>Password</h2><p><input type='password' onChange={handlePasswordChange} value={password}
          className='textField'></input></p>
        </div>
        <div className='container flex gap-8'>
          <p><button type='submit' className='btn'>Log in</button></p>
          <p><button type="button" onClick={tryNewUser} className='btn'>Create new user</button></p>
        </div>
      </form>
    </div>
  );
};
