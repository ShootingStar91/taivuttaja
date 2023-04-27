/* eslint-disable @typescript-eslint/no-misused-promises */
require("express-async-errors");

import express from "express";
import wordService from "../services/words";
import { isMood, isTense, isLanguage, isString } from "../utils/validators";

const router = express.Router();

// /api/words/...

router.get("/random/", async (req, res) => {
  const rawTense = req.query.tense as string;
  const rawMood = req.query.mood as string;

  if (!rawMood || !rawTense) {
    throw new Error("Mood or tense missing");
  }

  const mood = rawMood.charAt(0).toUpperCase() + rawMood.slice(1);
  const tense = rawTense.charAt(0).toUpperCase() + rawTense.slice(1);

  if (!isMood(mood) || !isTense(tense)) {
    throw new Error("Mood or tense invalid");
  }

  const word = await wordService.getRandomWord(tense, mood);
  res.send(word);
});

router.get("/word/", async (req, res) => {
  const word = req.query.mood as unknown;
  const rawMood = req.query.mood as unknown;
  const rawTense = req.query.tense as unknown;
  const language = req.query.language as unknown;
  if (!isString(rawMood) || !isString(rawTense) || !isString(word) || !isString(language)) {
    throw new Error("Invalid parameters, please supply strings");
  }
  if (!isLanguage(language)) {
    throw new Error("Invalid language parameter. Give either 'en' or 'es'");
  }

  if (!rawMood || !rawTense) {
    throw new Error("Mood or tense missing");
  }

  const mood = rawMood.charAt(0).toUpperCase() + rawMood.slice(1);
  const tense = rawTense.charAt(0).toUpperCase() + rawTense.slice(1);

  if (!isMood(mood) || !isTense(tense)) {
    throw new Error("Mood or tense invalid");
  }

  const result = await wordService.getWord(word, language, tense, mood);
  if (!result) {
    throw new Error("Could not find word, or given word was invalid.")
  }
  return res.send(result);
});

router.get("/verbdetails/:verb", async (req, res) => {
  const verb = req.params.verb;
  const result = await wordService.getVerbDetails(verb);
  res.send(result);
});

router.get("/allwordsstripped", async (_req, res, _next) => {
  const result = await wordService.getStrippedWords();
  res.send(result);
});

export default router;
