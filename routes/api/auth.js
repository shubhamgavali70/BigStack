const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jsonwt = require("jsonwebtoken");
const passport = require("passport");
const key = require("../../setup/myurl");

//@type     GET
//@route    /api/auth
//@desc     just for testing
//@access   PUBLIC
router.get("/", (req, res) => res.json({ test: "Auth successful" }));

//Importing Schema of Person for register
const Person = require("../../models/Person");

//@type     POST
//@route    /api/auth/register
//@desc     route for registration
//@access   PUBLIC
router.post("/register", (req, res) => {
  Person.findOne({ email: req.body.email })
    .then(person => {
      if (person) {
        res
          .status(400)
          .json({ emailError: "Email already exist is the system" });
      } else {
        const newPerson = new Person({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
          gender: req.body.gender
          //task:
        });
        //task:
        if (req.body.gender == "male") {
          newPerson.profilepic =
            "https://image.flaticon.com/icons/svg/236/236831.svg";
        } else if (req.body.gender == "female") {
          newPerson.profilepic =
            "https://image.flaticon.com/icons/svg/180/180678.svg";
        }
        //Encryption of password here
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newPerson.password, salt, (err, hash) => {
            // Store hash in your password DB.
            if (err) throw err;
            newPerson.password = hash;
            newPerson
              .save()
              .then(person => res.json(person))
              .catch(err => console.log(err));
          });
        });
      }
    })
    .catch(err => console.log(err));
});

//@type     POST
//@route    /api/auth/login
//@desc     route for login
//@access   PUBLIC
router.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  Person.findOne({ email })
    .then(person => {
      if (!person) {
        res.status(404).json({ emailError: "User not found with this email" });
      }
      bcrypt
        .compare(password, person.password)
        .then(isCorrect => {
          if (isCorrect) {
            //res.json({ success: "User is able to login successfully" });
            //use payload and create user token
            const payload = {
              id: person.id,
              name: person.name,
              email: person.email
            };
            jsonwt.sign(payload, key.secret, (err, token) => {
              if (err) throw err;
              res.json({
                success: true,
                token: `Bearer ${token}`
              });
            });
          } else {
            res.status(400).json({ passwordError: "Wrong password" });
          }
        })
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
});

//@type     POST
//@route    /api/auth/profile
//@desc     route for profile
//@access   PRIVATE
router.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    //console.log(req.user);
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      profilepic: req.user.profilepic
    });
  }
);

module.exports = router;
