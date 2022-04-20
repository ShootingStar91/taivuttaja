| Date | Hours | Description |
| ---- | ----- | ----------- |
| 18.2. | 4   | Set up project structure and backend, uploaded database, connected to it |
| 19.2. | 4   | Set up frontend, connected to backend, put some CSS. Made a simple vocabulary practice mode, where you get a random word. |
| 21.2. | 2   | Made first version of conjugations practice mode and optimized backend |
| 22.2. | 1   | Worked on frontend forms and CSS |
| 26.2. | 3   | Worked on frontend, field selection and checking correct answers on enter | 
| 9.3.  | 1   | Worked on login functionality |
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
| Total hours | 75     | 