const mongoose = require("mongoose");

let courseSchema = new mongoose.Schema({
  _id: Number,
  Name: {
    type: String,
    required: true,
  },
  Instructor: {
    type: String,
    required: true,
  },
  list: [
    {
      id: {
        type: Number,
        ref: "Students",
        required: true,
      },
      grade: {
        type: Number,
        max: 100,
        min: 0,
      },
    },
  ],
});

//mapping
let Course = mongoose.model("Courses", courseSchema);
module.exports = Course;
