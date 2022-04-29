import React, { FormEvent, useState } from "react";
import userService from "../../services/user";
import { useNavigate } from "react-router-dom";
import { setUser } from "../../reducers/user";
import { useAppDispatch } from "../../reducers/hooks";
import { showNotification } from "../../reducers/notification";

export const LoginForm = () => {

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const tryLogin = async (event: FormEvent) => {
    event.preventDefault();
    const [error, user] = await userService.tryLogin(username, password);
    
    if (!user) {
      void dispatch(showNotification(error));
      return;
    }
    void dispatch(showNotification("Login successful!"));
    window.localStorage.setItem('loggedUser', JSON.stringify(user));
    dispatch(setUser({ ...user }));
    navigate('/userpage');

  };

  const tryNewUser = async () => {
    const [userError, result] = await userService.createUser(username, password);
    if (!result) {     
      void dispatch(showNotification(userError));
      return;
    }

    const [error, user] = await userService.tryLogin(username, password);

    if (!user) {     
      void dispatch(showNotification(error));
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
    <div>
      <form onSubmit={tryLogin}>
        <p><label>Username</label></p><p><input type='text' onChange={handleUsernameChange} value={username}></input></p>
        <p><label>Password</label></p><p><input type='password' onChange={handlePasswordChange} value={password}></input></p>
        <p><button type='submit'>Log in</button></p>
        <p><button type="button" onClick={tryNewUser}>Create new user</button></p>
      </form>
    </div>
  );
};
