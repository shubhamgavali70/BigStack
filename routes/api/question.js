const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");
//Loads Person model
const Person = require("../../models/Person");

//Loads Profile model
const Profile = require("../../models/Profile");

//Loads Question model
const Question = require("../../models/Question");

//@type     GET
//@route    /api/question
//@desc     route for showing all question
//@access   PUBLIC
router.get("/", (req, res) => {
  Question.find()
    .sort({ date: "descending" })
    .then(question => res.json(question))
    .catch(() => res.json({ noQues: "No questions" }));
});

//@type     POST
//@route    /api/question/
//@desc     route for submitting question
//@access   PRIVATE
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const newQuestion = new Question({
      textone: req.body.textone,
      texttwo: req.body.texttwo,
      user: req.body.user,
      name: req.body.name
    });
    newQuestion
      .save()
      .then(question => res.json(question))
      .catch(err => console.log("Unable to push data in database " + err));
  }
);

//@type     POST
//@route    /api/question/:id
//@desc     route for deleting question by id
//@access   PRIVATE
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Question.findById(req.params.id);
    Question.findOneAndRemove(req.params.id)
      .then(question => {
        question
          .save()
          .then(res.json({ success: "Sccessfully deleted" }))
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
  }
);

//@type     POST
//@route    /api/question/answer/:id
//@desc     route for answering question
//@access   PRIVATE
router.post(
  "/answer/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Question.findById(req.params.id)
      .then(question => {
        const newAnswer = {
          user: req.user.id,
          ansText: req.body.ansText,
          name: req.body.name
        };
        question.answer.unshift(newAnswer);
        question
          .save()
          .then(que => res.json(que))
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
  }
);

//@type     POST
//@route    /api/question/upvote/:id
//@desc     route for upvoting
//@access   PRIVATE
router.post(
  "/upvote/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        Question.findById(req.params.id)
          .then(question => {
            if (
              question.upvotes.filter(
                upvote => upvote.user.toString() === req.user.id.toString()
              ).length > 0
            ) {
              return res.status(400).json({ noupvote: "User already upvoted" });
            }
            question.upvotes.unshift({ user: req.user.id });
            question
              .save()
              .then(question => res.json(question))
              .catch(err => console.log(err));
          })
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
  }
);

//@type     POST
//@route    /api/question/devote/:id
//@desc     route for remove upvote
//@access   PRIVATE
// router.post("/devote/:id");

module.exports = router;
//Assignment - remove upvoting
//delete question
//delete all question

//Create a separate route for linux question
