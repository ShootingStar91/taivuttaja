[![Test](https://github.com/ShootingStar91/taivuttaja/actions/workflows/main.yml/badge.svg)](https://github.com/ShootingStar91/taivuttaja/actions/workflows/main.yml)

# Taivuttaja

**Try the application here**: [http://conjugation.arttudev.studio](http://conjugation.arttudev.studio)

**A website-app for practicing conjugating Spanish verbs.** Practice project for https://fullstackopen.com course. This project is completely non-profit and open-source and is authored by Arttu Kangas.

It uses the database of conjugated Spanish verbs created by Fred Jehle and compiled by @ghidinelli: https://github.com/ghidinelli/fred-jehle-spanish-verbs

Css for toggle-item is borrowed form Flowbite: https://flowbite.com/docs/forms/toggle/

+ [License: MIT](LICENSE.md)

# Technologies

+ Frontend written in **Typescript & React 17**
  + **Redux toolkit**
  + **Tailwind CSS**
+ Backend in Typescript, **NodeJS Express**
  + **Mongoose & MongoDB**
+ **Unit and integration tests**
  + Jest, supertest, cypress
+ CI/CD
  + **GitHub Actions** runs tests and uses [appleboy/ssh-action] to make an AWS Lightsail server pull and deploy the project
  + **Docker** compose files for nginx reverse-proxy setup

# Instructions to try server

The project requires the mongoDB database ([repository of database](https://github.com/ghidinelli/fred-jehle-spanish-verbs)) to fully run, with appropriate secrets available for backend. However, the repository has a test version of the database with a few test words. There is a docker-compose.yml file in the backend folder to run the test database in a mongo image.

Clone repository `git clone https://github.com/ShootingStar91/taivuttaja`

Run mongo image with docker compose plugin and run backend in test mode

  cd taivuttaja/backend
  docker compose -f docker-compose.yml up -d
  npm install
  npm run start:test
  cd ..

Run frontend


  cd frontend
  npm install
  npm start


# Features

Here is a list of current feature. All verb practice only works from English to Spanish: user is given a word in English and has to type it in Spanish.

+ Practice vocabulary (verbs in infinite form)
+ Practice conjugation: Four moods and 10 tenses
  + Full mode: Type in all forms (first person singular, etc.)
  + Single mode: You get one random form from the given mood/tense combinations, such as third person plural
  + Flashcard: No typing, get a random form and guess it
+ View conjugation table of any verb
+ Register and login
  + Create custom wordlists allowing to practice specific verbs
  + Set daily goal
  + Delete user permanently
