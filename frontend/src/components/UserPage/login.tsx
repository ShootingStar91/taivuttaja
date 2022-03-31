import React, { FormEvent, useState } from "react";
import userService from "../../services/user";
import { useNavigate } from "react-router-dom";

export const LoginForm = ({onLogin}: {onLogin: () => void}) => {

  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [notification, setNotification] = useState<string>("");
  
  const tryLogin = async (event: FormEvent) => {
    event.preventDefault();
    const error = await userService.tryLogin(username, password);

    if (error !== null && error !== undefined) {
      console.log("error on login:");
      console.log(error);
      setNotification(error);
      setTimeout(() => { setNotification(""); }, 5000);
    } else {
      setNotification("");
      onLogin();
      navigate('/conjugate');
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
        <button type='submit'>Log in</button> 
      </form>
    </div>
  );
};
