| Date | Hours | Description |
| ---- | ----- | ----------- |
| 18.2. | 4   | Set up project structure and backend, uploaded database, connected to it |
| 19.2. | 4   | Set up frontend, connected to backend, put some CSS. Made a simple vocabulary practice mode, where you get a random word. |
| 21.2. | 2   | Made first version of conjugations practice mode and optimized backend |
| 22.2. | 1   | Worked on frontend forms and CSS |
| 26.2. | 3   | Worked on frontend, field selection and checking correct answers on enter | 
| 9.3.  | 1   | Worked on login functionality |rca
| 10.3. | 2   | Login functionality again |
| 11.3. | 3   | Login middlewares finished, minor frontend fixes |
| 12.3. | 2   | Login page to frontend started |
| 14.3. | 3   | Added redux to handle user on frontend |
| 17.3. | 1   | Added logout |
| 18.3. | 3   | Tweaked user experience: conjugate form fields switching on enter/tab, notifications |
| 23.3. | 1   | Building user page to frontend, and service for getting/creating wordlists |
| 25.3. | 1   | Continued wordlist page and service |
| 27.3. | 3   | Continued wordlist on frontend, and worked on backend handling of wordlists |
| 30.3. | 2   | More backend handling of wordlists, tense & mood types added, authorization put to use |
| 31.3. | 4   | Improved logic of login on frontend, listing wordlists of user works with links to page of individual wordlist. Wordlist editing not yet done. |
| 1.4.  | 3   | Started to build functionality of adding words to wordlist. Added react-select to frontend, and route to backend. Still requires some work |
| 3.4.  | 2   | Added functionality to delete words from wordlists, both frontend and backend |
| 4.4.  | 3   | Refactored user-routes logic into user service & added data validation, made registration possible in frontend |
| 6.4.  | 4   | Backend work: Refactored logic from wordlist-routes to service, added validation. Improved error handling, wrote errorHandler-middleware and added usage of express-async-errors to avoid try-catch clutter |
| 8.4.  | 3   | More backend refactoring: Refactored some logic from words-routes to a service, and changed randomization to happen at database. |
| 9.4.  | 4   | Added settings to conjugation, allowing to choose tenses and moods to include. This is a raw version that is not fully functional yet. Also other front refactorings. |
| 10.4. | 2   | Added conjugation to limit words to chosen wordlist only. Added a flashcard page. |
| 14.4. | 2   | Worked on single word mode of conjugation, and refactored frontend in the process | 
| 15.5. | 4   | Continued on single word mode, added flag icons, added wordlist deletion to front and backend, refactored backend routes to not need user-assertion |
| 16.4. | 3   | Improved backend error handling, started moving notifications into redux. Goal is to have it centralized in Redux and to prevent new notifications being deleted too soon because of older ones |
| 17.4. | 1   | Continued on working with moving notification into redux, but it seems very difficult |
| 18.4. | 1   | Finally got notification working with Redux Toolkits createAsyncThunk |
| 20.4. | 3   | Added logic to prevent choosing combinations of mood and tense that are impossible. Also dealt with situations where some forms are empty, like 1st and 2nd person singular in imperative |
| 21.4. | 2   | Started building backend functionality for setting daily goal |
| 22.4. | 3   | Functionality for counting how many words are done, and showing progress towards daily goal. Added password changing |
| 23.4. | 4   | Added redux-toolkit middleware that saves user-state after every change. Also worked on code quality and error handling on frontend |
| 24.4. | 3   | Refactored frontend error handling by moving all try-catch from React-components to service-files. Not sure how wise this is but it seems clearer. Also tested and fixed other bugs |
| 27.4. | 1   | Added showing correct answers to full conjugating mode. Minor fixes & Readme update |
| 28.4. | 2   | Showing on how many days app has been used by user and how many unique mood/tense combinations have been conjugated | 
| 29.4. | 3   | Added information table of how much each tense and mood has been practiced. Added setting of strict mode for accents, which defines if accent mistakes are allowed. Fixed logic of tense/mood randoming that allowed some impossible cases. Fixed new user not logging in. |
| 30.4. | 4.5 | (To new branch: cssBranch) Studied, installed & configured Tailwind CSS. Started re-building frontend UI with it. |
| 1.5.  | 3.5 | Continued building frontend styles. |
| 2.5.  | 1   | Started building a modal component with Tailwind CSS |
| 4.5.  | 4   | Built a working version of modal. Fixes and improvements in styles. |
| 5.5.  | 3.5 | Continued building frontend UI & styles, fixed some small issues in both frontend & backends. |
| 6.5.  | 3.5 | Added changing password functionality into a modal. Made practice settings save & load into localstorage. Fixed small issues. |
| 20.6. | 4   | Fixed problems on wordlist page, merged cssBranch to main branch, started writing cypress tests |
| 23.6. | 3   | Continued writing cypress e2e tests |
| 24.6. | 4   | Set up test database in docker image, started writing backend unit tests with jest |
| 25.6. | 5   | Set up CI with Github Actions, started api tests with supertest |
| 27.6. | 2   | Writing cypress tests |
| 29.6. | 4   | More e2e tests. Setup AWS lightsail server for deployment of the project. |
| 30.6. | 4   | Setting up CD pipeline |
| 4.7.  | 3   | CI/CD |
| 6.7.  | 3   | Added verb search page, fixed UX issues |
| 9.7.  | 2   | Added individual verb conjugation table page, code quality fixes | 
| 11.7. | 1   | Fixed flag icons not working on windows, code quality |
| 12.7. | 2   | Changed UI styles |
| Total hours | 150     | 