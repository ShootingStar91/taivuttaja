import React, { FormEvent, useState } from "react";
import userService from "../../services/user";
import { useNavigate } from "react-router-dom";
import { setUser } from "../../reducers/user";
import { useAppDispatch } from "../../reducers/hooks";

export const LoginForm = () => {

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [notification, setNotification] = useState<string>("");
  
  const tryLogin = async (event: FormEvent) => {
    event.preventDefault();
    const user = await userService.tryLogin(username, password);

    if (!user) {
      setNotification("Could not login. Check username and password");
      setTimeout(() => { setNotification(""); }, 5000);
    } else {
      setNotification("");
      window.localStorage.setItem('loggedUser', JSON.stringify(user));
      dispatch(setUser( { ...user } ));
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
        setNotification("User created, but could not login! Try again soon");
        setTimeout(() => { setNotification(""); }, 5000);
      } else {
        setNotification("");
        window.localStorage.setItem('loggedUser', JSON.stringify(user));
        dispatch(setUser( { ...user } ));
        navigate('/conjugate');
          
      }
    } catch (e: any) {
      setNotification(e.response.data.error as string);      
      setTimeout(() => { setNotification(""); }, 5000);
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
      {notification !== "" && <div className="notificationDiv"><p className="notification">{notification}</p></div>}
      <form onSubmit={tryLogin}>
        <p><label>Username</label></p><p><input type='text' onChange={handleUsernameChange} value={username}></input></p>
        <p><label>Password</label></p><p><input type='password' onChange={handlePasswordChange} value={password}></input></p>
        <p><button type='submit'>Log in</button></p>
        <p><button type="button" onClick={tryNewUser}>Create new user</button></p>
      </form>
    </div>
  );
};
