import React, { FormEvent, useState } from "react";
import { userService } from "../../services/user";

export const LoginForm = () => {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [notification, setNotification] = useState('');

  const tryLogin = async (event: FormEvent) => {
    event.preventDefault();
    const result = await userService.tryLogin(username, password);
    if (result !== null) {
      setNotification(result);
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