import React, { FormEvent, useState } from "react";
import { useAppSelector } from "../../reducers/hooks";
import { selectUser } from "../../reducers/user";
import { userService } from "../../services/user";

export const LoginForm = () => {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [notification, setNotification] = useState('');
  const user = useAppSelector(selectUser);
  console.log(user.user?.username);
  
  const tryLogin = async (event: FormEvent) => {
    event.preventDefault();
    const result = await userService.tryLogin(username, password);
    if (result !== null && result !== undefined) {
      setNotification(result);
      setTimeout(() => { setNotification(""); }, 5000);
    } else {
      setNotification("");
      // login successful. dispatch here with reducer to update user and change page that way
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
      {notification !== '' && <div className='notification'>{notification}</div>}
      <form onSubmit={tryLogin}>
        <p><label>Username</label></p><p><input type='text' onChange={handleUsernameChange} value={username}></input></p>
        <p><label>Password</label></p><p><input type='password' onChange={handlePasswordChange} value={password}></input></p>
        <button type='submit'>Log in</button> 
      </form>
    </div>
  );
};
