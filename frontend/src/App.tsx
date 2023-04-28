import React, { useEffect } from "react";
import { IndexPage } from "./components/IndexPage";
import { VocabPage } from "./components/VocabPage";
import { LoginForm } from "./components/UserPage/login";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import { useAppDispatch, useAppSelector } from "./reducers/hooks";
import { removeUser, selectUser, setUser } from "./reducers/user";
import { UserPage } from "./components/UserPage";
import { WordListView } from "./components/UserPage/wordlist";
import { ConjugateIndex } from "./components/ConjugatePage";
import { Notification } from "./components/Notification";
import userService from "./services/user";
import { VerbsPage } from "./components/VerbsPage";
import { VerbView } from "./components/VerbsPage/VerbView";
import { successToast } from "./reducers/toastApi";
import { InfoBar } from "./components/InfoBar";
import { User } from "./types";

const App = () => {
  const user = useAppSelector(selectUser);

  const dispatch = useAppDispatch();

  useEffect(() => {
    const loadedUser = userService.checkLogin();
    if (loadedUser) {
      dispatch(setUser(loadedUser));
    } else {
      dispatch(removeUser());
    }
  }, []);

  return (
    <div
      id="mainContainer"
      className="grid grid-cols-small lg:grid-cols-normal grid-rows-normal auto-rows-[40px] mt-12 lg:gap-[2px]"
    >
      <BrowserRouter>
        <Notification />
        {user && (
          <div
            id="infobar"
            className="col-start-1 col-end-1 lg:col-start-2 lg:col-end-4 row-start-1 row-end-2 bg-header-color"
          >
            <InfoBar />
          </div>
        )}
        <Menu user={user} />
        <div
          id="contentdiv"
          className="min-w-[650px] col-start-1 lg:col-start-3 lg:col-end-3 row-start-3 row-end-4 lg:row-start-2 bg-bg-color"
        >
          <div className="bg-content-color p-4 p-6">
            <Routes>
              <Route path="conjugatestart" element={<ConjugateIndex />} />
              <Route path="vocab" element={<VocabPage />} />
              <Route path="login" element={<LoginForm />} />
              <Route path="verbs" element={<VerbsPage />} />
              <Route path="userpage" element={<UserPage />} />
              <Route path="wordlist/:id" element={<WordListView />} />
              <Route path="verb/:verb" element={<VerbView />} />
              <Route path="*" element={<IndexPage />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </div>
  );
};

const Menu = ({ user }: { user: User | undefined }) => {
  const route = useLocation();
  const dispatch = useAppDispatch();

  const linkBaseStyle =
    "flex-auto min-w-[140px] lg:w-[200px] h-[40px] lg:h-[40px] text-center active:bg-menu-color-active text-menu-font-color hover:cursor-default";
  const navBarLinkClass = linkBaseStyle + " bg-menu-color";
  const navBarLinkCurrent = linkBaseStyle + " bg-menu-color-active";

  const logout = () => {
    dispatch(removeUser());
    window.localStorage.clear();
    successToast("You are now logged out!");
  };

  const pages: Array<{
    title: string;
    url: string;
    requiresLogin?: boolean;
    hideOnLogin?: boolean;
  }> = [
    { title: "HOME", url: "/" },
    { title: "CONJUGATE", url: "/conjugatestart" },
    { title: "VOCAB", url: "/vocab" },
    { title: "VERBS", url: "/verbs" },
    { title: "USER PAGE", url: "/userpage", requiresLogin: true },
    { title: "LOGIN", url: "/login", hideOnLogin: true },
    { title: "LOGOUT", url: "", requiresLogin: true },
  ];

  return (
    <div
      id="navbar"
      className="w-auto col-start-1 col-end-1 lg:col-start-2 lg:col-end-3 row-start-2 row-end-3 flex flex-row lg:flex-col
        text-lg gap-[2px] select-none pointer-events-auto min-w-fit"
    >
      {pages.map(
        (page) =>
          ((!user && !page.requiresLogin) || (user && !page.hideOnLogin)) && (
            <Link
              key={page.title}
              draggable={false}
              className={
                route.pathname === page.url
                  ? navBarLinkCurrent
                  : navBarLinkClass
              }
              to={page.url}
              onClick={page.title === "LOGOUT" ? logout : undefined}
            >
              {page.title}
            </Link>
          )
      )}
    </div>
  );
};

export default App;
