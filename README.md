[![Test](https://github.com/ShootingStar91/taivuttaja/actions/workflows/main.yml/badge.svg)](https://github.com/ShootingStar91/taivuttaja/actions/workflows/main.yml)

# Taivuttaja

A web-app for practicing conjugating Spanish verbs. Work in progress. Practice project for https://fullstackopen.com course, aiming for 175 hours of work. This project is completely non-profit and open-source and is authored by Arttu Kangas.

It uses the database of conjugated Spanish verbs created by Fred Jehle and compiled by @ghidinelli: https://github.com/ghidinelli/fred-jehle-spanish-verbs

Project is not yet deployed.

# Features

Here is a list of current feature. All verb practice only works from English to Spanish: user is given a word in English and has to type it in Spanish.

+ Practice vocabulary (verbs in infinite form)
+ Practice conjugation: Four moods and 10 tenses
  + Full mode: Type in all forms (first person singular, etc.)
  + Single mode: You get one random form from the given mood/tense combinations, such as third person plural
  + Flashcard: No typing, get a random form and guess it
+ Register and login
  + Create custom wordlists allowing to practice specific verbs
  + Set daily goal
  + Delete user permanently

# Technologies

+ Frontend written in Typescript & React 17
  + Redux toolkit
  + axios
  + Styles with Tailwind CSS
+ Backend in Typescript, NodeJS Express
  + Mongoose & MongoDB
+ Tests
  + Jest, supertest, cypress
+ CI
  + GitHub Actions
