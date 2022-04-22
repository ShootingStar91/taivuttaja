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
    const user = await userService.tryLogin(username, password);

    if (!user) {
      void dispatch(showNotification("Could not login. Check username and password"));
    } else {
      void dispatch(showNotification(""));
      window.localStorage.setItem('loggedUser', JSON.stringify(user));
      dispatch(setUser({ ...user }));
      navigate('/conjugate');
    }
  };

  const tryNewUser = async () => {
    try {
      const result = await userService.createUser(username, password);
      console.log("result:");

      console.log(result);

      const user = await userService.tryLogin(username, password);
      console.log("user after login in trynewuser:");
      console.log(user);

      if (!user) {
        void dispatch(showNotification("User created, but could not login! Try to login again"));
      } else {
        window.localStorage.setItem('loggedUser', JSON.stringify(user));
        dispatch(setUser({ ...user }));
        navigate('/conjugatestart');
      }
    } catch (e: any) {
      void dispatch(showNotification(e.response.data.error as string));
    }
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
