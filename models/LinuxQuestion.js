const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LinuxQuestionSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "myPerson"
  },
  name: {
    type: String
  },
  linuxquestion: {
    type: String,
    required: true
  },
  code: {
    type: String,
    required: true
  },
  linuxanswer: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "myPerson"
      },
      linuxanstext: {
        type: String,
        required: true
      },
      name: {
        type: String
      },
      date: {
        type: Date,
        default: Date.now()
      }
    }
  ],
  lovefromuser: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "myPerson"
      }
    }
  ]
});

module.exports = LinuxAnswer = mongoose.model(
  "myLinuxQues",
  LinuxQuestionSchema
);
