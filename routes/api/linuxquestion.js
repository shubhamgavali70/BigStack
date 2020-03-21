const express = require("express");
const passport = require("passport");
const router = express.Router();
//Load all the schemas here
const Person = require("../../models/Person");
const Profile = require("../../models/Profile");
const LinuxQuestion = require("../../models/LinuxQuestion");

// router.get("/", (req, res) => {
//   res.send("<h1>Heyy there I am linux question</h1>");
// });

//@type     POST
//@route    /api/linuxquestion/
//@desc     route for submitting linux question
//@access   PRIVATE
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const newLinuxQuestion = new LinuxQuestion({
      user: req.body.user,
      name: req.body.name,
      linuxquestion: req.body.linuxquestion,
      code: req.body.code
    });
    newLinuxQuestion
      .save()
      .then(ques => res.json(ques))
      .catch(err => console.log("error while saving th question " + err));
  }
);

//@type     GET
//@route    /api/linuxquestion/
//@desc     route for display all question
//@access   PUBLIC
router.get("/", (req, res) => {
  LinuxQuestion.find()
    .then(que => res.json(que))
    .catch(err => console.log("error while displaying all ques " + err));
});

//@type     POST
//@route    /api/linuxquestion/linuxanswer
//@desc     route for answering linux question
//@access   PRIVATE
router.post(
  "/linuxanswer/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    LinuxQuestion.findById(req.params.id)
      .then(ques => {
        const newAns = {
          user: req.user.id,
          linuxanstext: req.body.linuxanstext,
          name: req.body.name
        };
        ques.linuxanswer.push(newAns);
        ques
          .save()
          .then(ans => res.json(ans))
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
  }
);

//@type     POST
//@route    /api/linuxquestion/lovefromuser/:id
//@desc     route for upvote/like to ques
//@access   PRIVATE
router.post(
  "/lovefromuser/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        LinuxQuestion.findById(req.params.id)
          .then(question => {
            if (
              question.lovefromuser.filter(
                like => like.user.toString() === req.user.id.toString()
              ).length > 0
            ) {
              return res
                .status(400)
                .json({ nolike: "user had already gave like" });
            }
            question.lovefromuser.unshift({ user: req.user.id });
            question
              .save()
              .then(abcd => res.json(abcd))
              .catch(err => console.log(err));
          })
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
  }
);

module.exports = router;
