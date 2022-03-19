import React, { FormEvent, useState } from "react";
import { useAppSelector } from "../../reducers/hooks";
import { selectUser } from "../../reducers/user";
import { userService } from "../../services/user";
import { User } from "../../types";
import { useNavigate } from "react-router-dom";

export const LoginForm = ({onLogin}: {onLogin: (user: User) => void}) => {

  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [notification, setNotification] = useState<string>("");
  const user = useAppSelector(selectUser);
  console.log(user.user?.username);
  
  const tryLogin = async (event: FormEvent) => {
    event.preventDefault();
    const result = await userService.tryLogin(username, password);
    if (result !== null && result !== undefined) {
      console.log("result on login:");
      
      console.log(result);
      setNotification(result);
      setTimeout(() => { setNotification(""); }, 5000);
    } else {
      console.log("result on login:");
      console.log(result);
      setNotification("");
      onLogin(user.user as User);
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
