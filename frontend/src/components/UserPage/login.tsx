import React, { FormEvent, useState } from "react";
import userService from "../../services/user";
import { useNavigate } from "react-router-dom";
import { setUser } from "../../reducers/user";
import { useAppDispatch } from "../../reducers/hooks";
import { successToast } from "../../reducers/toastApi";

export const LoginForm = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const tryLogin = async (event: FormEvent) => {
    event.preventDefault();
    const user = await userService.tryLogin(username, password);
    if (!user) {
      return;
    }
    successToast("Login successful!");
    window.localStorage.setItem("loggedUser", JSON.stringify(user));
    
    dispatch(setUser({ ...user }));
    navigate("/userpage");
  };

  const tryNewUser = async () => {    
    const result = await userService.createUser(
      username,
      password
    );
    console.log(result);
    if (!result) {
      return;
    }

    const user = await userService.tryLogin(username, password);

    if (!user) {
      return;
    }

    window.localStorage.setItem("loggedUser", JSON.stringify(user));
    dispatch(setUser({ ...user }));
    navigate("/userpage");
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
        <div className="container flex flex-col justify-center">
          <h2>Username</h2>
          <p>
            <input
              id="usernamefield"
              type="text"
              onChange={handleUsernameChange}
              value={username}
              className="textField"
            ></input>
          </p>
          <h2>Password</h2>
          <p>
            <input
              id="passwordfield"
              type="password"
              onChange={handlePasswordChange}
              value={password}
              className="textField"
            ></input>
          </p>
        </div>
        <div className="container flex gap-8">
          <p>
            <button id="loginbutton" type="submit" className="btn">
              Log in
            </button>
          </p>
          <p>
            <button
              id="newuserbutton"
              type="button"
              onClick={tryNewUser}
              className="btn"
            >
              Create new user
            </button>
          </p>
        </div>
      </form>
    </div>
  );
};
