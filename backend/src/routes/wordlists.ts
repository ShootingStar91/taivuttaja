/* eslint-disable @typescript-eslint/no-misused-promises */
import express, { Response } from "express";
import middleware from "../middleware";
import wordlistService from "../services/wordlists";
require("express-async-errors");

const router = express.Router();

router.post(
  "/deleteword/",
  middleware.userExtractor,
  async (req, res: Response) => {
    const result = await wordlistService.deleteWord(
      req.body.word,
      req.body.wordlistId,
      req.user._id
    );
    res.status(200).send(result);
  }
);

router.post("/addword/", middleware.userExtractor, async (req, res) => {
  const result = await wordlistService.addWord(
    req.body.word,
    req.body.wordlistId,
    req.user._id
  );
  if (!result) {
    throw new Error("Error adding word to wordlist");
  }
  res.send(result);
});

router.get("/", middleware.userExtractor, async (req, res) => {
  // Returns all owners wordlists
  const result = await wordlistService.getUsersLists(req.user._id);
  res.json(result);
});

router.get("/:id", middleware.userExtractor, async (req, res) => {
  const result = await wordlistService.getList(req.params.id, req.user._id);
  res.json(result);
});

router.post("/create/", middleware.userExtractor, async (req, res) => {
  const savedWordlist = await wordlistService.create(
    req.body.wordlist.title,
    req.user._id
  );
  res.status(200).send(savedWordlist);
});

router.post("/delete/", middleware.userExtractor, async (req, res) => {
  const result = await wordlistService.deleteWordlist(
    req.body.wordlistId,
    req.user._id
  );
  res.status(200).send(result);
});

export default router;
