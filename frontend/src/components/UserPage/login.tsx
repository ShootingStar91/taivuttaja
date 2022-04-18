import React, { FormEvent, useState } from "react";
import userService from "../../services/user";
import { useNavigate } from "react-router-dom";
import { setUser } from "../../reducers/user";
import { useAppDispatch } from "../../reducers/hooks";
import { clearNotification, setNotification } from "../../reducers/notification";

export const LoginForm = () => {

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  //const [notification, setNotification] = useState<string>("");

  const showNotification = (message: string) => {
    dispatch(setNotification(message));
    setTimeout(() => {
      dispatch(clearNotification());
    }, 5000);
  };

  const tryLogin = async (event: FormEvent) => {
    event.preventDefault();
    const user = await userService.tryLogin(username, password);

    if (!user) {
      showNotification("Could not login. Check username and password");
    } else {
      setNotification("");
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
        showNotification("User created, but could not login! Try again soon");
      } else {
        window.localStorage.setItem('loggedUser', JSON.stringify(user));
        dispatch(setUser({ ...user }));
        navigate('/conjugate');
      }
    } catch (e: any) {
      dispatch(setNotification(e.response.data.error as string));
    }
  };

  const handlePasswordChange = (event: FormEvent<HTMLInputElement>) => {
    setPassword(event.currentTarget.value);
  };

  const handleUsernameChange = (event: FormEvent<HTMLInputElement>) => {
    setUsername(event.currentTarget.value);
  };
  // {notification !== "" && <div className="notificationDiv"><p className="notification">{notification}</p></div>}

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
